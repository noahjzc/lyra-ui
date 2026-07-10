import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertExactSemver } from './verify-consumer.mjs';

const usage = 'Usage: verify-registry.mjs <version>';
const name = '@noah-ji/lyra-ui';

export function parseRegistryVersion(args) {
  if (args.length !== 1) throw new Error(usage);
  return assertExactSemver(args[0]);
}

export function verifyRegistry(version) {
  assertExactSemver(version);
  const metadata = JSON.parse(
    execFileSync(
      'npm',
      [
        'view',
        `${name}@${version}`,
        'name',
        'version',
        'license',
        'dist-tags.latest',
        'dist.integrity',
        'repository.url',
        '--json',
      ],
      { encoding: 'utf8' },
    ),
  );

  if (metadata.name !== name) throw new Error('registry name mismatch');
  if (metadata.version !== version)
    throw new Error('registry version mismatch');
  if (metadata.license !== 'MIT') throw new Error('registry license mismatch');
  if (!metadata['dist.integrity'])
    throw new Error('registry integrity missing');
  if (!String(metadata['repository.url']).includes('noahjzc/lyra-ui')) {
    throw new Error('registry repository mismatch');
  }

  execFileSync('node', ['scripts/verify-consumer.mjs', '--registry', version], {
    stdio: 'inherit',
  });
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) verifyRegistry(parseRegistryVersion(process.argv.slice(2)));
