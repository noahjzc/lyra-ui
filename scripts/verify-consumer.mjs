import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const usage = 'Usage: verify-consumer.mjs <tarball.tgz> | --registry <version>';
const exactSemverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export function isExactSemver(value) {
  return typeof value === 'string' && exactSemverPattern.test(value);
}

export function assertExactSemver(value) {
  if (!isExactSemver(value)) {
    throw new Error(`Registry version must be an exact semver: ${value ?? ''}`);
  }
  return value;
}

export function parseConsumerArgs(args) {
  if (args[0] === '--registry') {
    if (args.length !== 2 || !args[1] || args[1].startsWith('-')) {
      throw new Error(usage);
    }
    return { mode: 'registry', version: assertExactSemver(args[1]) };
  }

  if (args.length !== 1 || !args[0].endsWith('.tgz')) {
    throw new Error(usage);
  }
  return { mode: 'tarball', path: args[0] };
}

function isFile(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

export function resolveConsumerSpec(request, options = {}) {
  if (request.mode === 'registry') {
    return request.version;
  }

  const absolutePath = resolve(options.cwd ?? process.cwd(), request.path);
  const pathIsFile = options.isFile ?? isFile;
  if (!pathIsFile(absolutePath)) {
    throw new Error(`Tarball does not exist or is not a file: ${absolutePath}`);
  }
  return `file:${absolutePath}`;
}

export function verifyConsumer(args) {
  const spec = resolveConsumerSpec(parseConsumerArgs(args));
  const target = resolve('.tmp/consumer');

  rmSync(target, { force: true, recursive: true });
  cpSync('fixtures/consumer', target, { recursive: true });

  const packagePath = resolve(target, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  packageJson.dependencies['@noah-ji/lyra-ui'] = spec;
  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

  function run(command, commandArgs) {
    execFileSync(command, commandArgs, { cwd: target, stdio: 'inherit' });
  }

  run('pnpm', ['install', '--no-frozen-lockfile']);
  run('pnpm', ['typecheck']);
  run('pnpm', ['build']);
  run('pnpm', ['test:cjs']);
  run('pnpm', ['test:private']);
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) verifyConsumer(process.argv.slice(2));
