import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function isNpmNotFoundError(error) {
  if (typeof error?.status !== 'number' || error.status === 0) return false;

  const stderr = Buffer.isBuffer(error.stderr)
    ? error.stderr.toString('utf8')
    : error.stderr;
  return (
    typeof stderr === 'string' &&
    /^npm (?:error|ERR!) code E404\r?$/m.test(stderr)
  );
}

export function assertVersionIsUnpublished(packageJson, exec = execFileSync) {
  try {
    exec(
      'npm',
      ['view', `${packageJson.name}@${packageJson.version}`, 'version'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
  } catch (error) {
    if (isNpmNotFoundError(error)) return;
    throw error;
  }

  throw new Error(`${packageJson.name}@${packageJson.version} already exists`);
}

export function releasePreflight() {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const status = execFileSync('git', ['status', '--porcelain'], {
    encoding: 'utf8',
  });
  if (status.trim()) throw new Error('release requires a clean git worktree');

  assertVersionIsUnpublished(packageJson);
  execFileSync('pnpm', ['verify'], { stdio: 'inherit' });
  execFileSync('pnpm', ['pack:check'], { stdio: 'inherit' });
  execFileSync('pnpm', ['verify:consumer'], { stdio: 'inherit' });
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) releasePreflight();
