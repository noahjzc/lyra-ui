import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertExactSemver } from './verify-consumer.mjs';

const usage = 'Usage: verify-registry.mjs <version>';
const name = '@noah-ji/lyra-ui';
const expectedRepository = 'noahjzc/lyra-ui';
const repositorySegmentPattern = /^[A-Za-z0-9_.-]+$/;

export function parseRegistryVersion(args) {
  if (args.length !== 1) throw new Error(usage);
  return assertExactSemver(args[0]);
}

function normalizeOwnerRepository(owner, repository) {
  const normalizedRepository = repository.endsWith('.git')
    ? repository.slice(0, -4)
    : repository;
  if (
    !repositorySegmentPattern.test(owner) ||
    !repositorySegmentPattern.test(normalizedRepository)
  ) {
    return null;
  }
  return `${owner}/${normalizedRepository}`;
}

export function normalizeGithubRepository(value) {
  if (typeof value !== 'string') return null;

  const repository = value.trim();
  const httpsMatch =
    /^(?:git\+)?https:\/\/github\.com\/([^/?#]+)\/([^/?#]+)$/.exec(repository);
  if (httpsMatch) {
    return normalizeOwnerRepository(httpsMatch[1], httpsMatch[2]);
  }

  const sshMatch = /^git@github\.com:([^/]+)\/([^/]+)$/.exec(repository);
  if (sshMatch) {
    return normalizeOwnerRepository(sshMatch[1], sshMatch[2]);
  }
  return null;
}

export function parseRegistryMetadata(output) {
  if (typeof output !== 'string') {
    throw new Error('registry metadata must be JSON text');
  }

  let metadata;
  try {
    metadata = JSON.parse(output);
  } catch (error) {
    throw new Error('registry metadata is not valid JSON', { cause: error });
  }
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error('registry metadata must be an object');
  }
  return metadata;
}

function assertRegistryMetadata(metadata, version) {
  if (metadata.name !== name) throw new Error('registry name mismatch');
  if (metadata.version !== version)
    throw new Error('registry version mismatch');
  if (metadata.license !== 'MIT') throw new Error('registry license mismatch');
  if (metadata['dist-tags.latest'] !== version) {
    throw new Error('registry latest tag mismatch');
  }
  if (
    typeof metadata['dist.integrity'] !== 'string' ||
    !metadata['dist.integrity'].trim()
  ) {
    throw new Error('registry integrity missing');
  }
  if (
    normalizeGithubRepository(metadata['repository.url']) !== expectedRepository
  ) {
    throw new Error('registry repository mismatch');
  }
}

export function verifyRegistry(version, execute = execFileSync) {
  assertExactSemver(version);
  const output = execute(
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
  );
  assertRegistryMetadata(parseRegistryMetadata(output), version);

  execute('node', ['scripts/verify-consumer.mjs', '--registry', version], {
    stdio: 'inherit',
  });
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) verifyRegistry(parseRegistryVersion(process.argv.slice(2)));
