import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packDirectory = join(root, '.pack');

function runNode(script, args) {
  execFileSync(process.execPath, [join(root, 'scripts', script), ...args], {
    cwd: root,
    stdio: 'inherit',
  });
}

function findTarball() {
  const entries = readdirSync(packDirectory, { withFileTypes: true });
  const tarballs = entries.filter(
    entry => entry.isFile() && entry.name.endsWith('.tgz'),
  );
  if (entries.length !== 1 || tarballs.length !== 1) {
    throw new Error(
      `Expected exactly one tarball in .pack, found: ${entries
        .map(entry => entry.name)
        .join(', ')}`,
    );
  }
  return join(packDirectory, tarballs[0].name);
}

function main(args) {
  const withConsumer = args.length === 1 && args[0] === '--consumer';
  if (args.length !== 0 && !withConsumer) {
    throw new Error('Usage: pack-check.mjs [--consumer]');
  }

  rmSync(packDirectory, { force: true, recursive: true });
  mkdirSync(packDirectory, { recursive: true });
  execFileSync('pnpm', ['pack', '--pack-destination', packDirectory], {
    cwd: root,
    stdio: 'inherit',
  });

  const tarball = findTarball();
  runNode('verify-tarball.mjs', [tarball]);
  if (withConsumer) runNode('verify-consumer.mjs', [tarball]);
  console.log(`fresh tarball verified: ${tarball}`);
}

main(process.argv.slice(2));
