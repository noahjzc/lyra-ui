import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  assertVersionIsUnpublished,
  isNpmNotFoundError,
} from '../../scripts/release-preflight.mjs';
import {
  isExactSemver,
  parseConsumerArgs,
  resolveConsumerSpec,
} from '../../scripts/verify-consumer.mjs';
import { parseRegistryVersion } from '../../scripts/verify-registry.mjs';
import {
  assertTarballEntries,
  isAllowedTarballEntry,
} from '../../scripts/verify-tarball.mjs';

const requiredEntries = [
  'package/package.json',
  'package/README.md',
  'package/LICENSE',
  'package/dist/styles.css',
];
const invalidConsumerArgs: [string[]][] = [
  [[]],
  [['0.2.0']],
  [['--registry']],
  [['--registry', '0.2.0', 'extra']],
  [['release.tar.gz']],
];
const validRegistryVersions = ['0.2.0', '1.0.0-beta.1', '2.3.4-rc.0+build.7'];
const invalidRegistryVersions = [
  'v1.2.3',
  '1.2',
  '1.2.3.4',
  '1.2.3-',
  '01.2.3',
  '^1.2.3',
  '~1.2.3',
  '>=1.2.3',
  '1.2.x',
  'latest',
  'next',
  'file:../lyra-ui',
  'workspace:*',
  'git+https://github.com/noahjzc/lyra-ui.git',
  'https://registry.npmjs.org/package.tgz',
];

describe('tarball entry contract', () => {
  it.each(requiredEntries)('accepts public package entry %s', entry => {
    expect(isAllowedTarballEntry(entry)).toBe(true);
  });

  it.each([
    'package/LICENSE.bak',
    'package/README.md.old',
    'package/package.json.tmp',
    'package/dist/../escape.js',
    'package/./dist/styles.css',
    'package//dist/styles.css',
    '/package/dist/styles.css',
    'package\\dist\\styles.css',
    'package/LICENSE ',
  ])('rejects non-canonical or private entry %s', entry => {
    expect(isAllowedTarballEntry(entry)).toBe(false);
    expect(() => assertTarballEntries([...requiredEntries, entry])).toThrow(
      `Unexpected tarball entry: ${entry}`,
    );
  });

  it('requires every release root and the bundled stylesheet', () => {
    expect(() => assertTarballEntries(requiredEntries)).not.toThrow();
    expect(() => assertTarballEntries(requiredEntries.slice(0, -1))).toThrow(
      'Missing tarball entry: package/dist/styles.css',
    );
  });
});

describe('consumer arguments', () => {
  it('accepts an explicit local tarball', () => {
    const request = parseConsumerArgs(['release.tgz']);

    expect(request).toEqual({ mode: 'tarball', path: 'release.tgz' });
    expect(
      resolveConsumerSpec(request, {
        cwd: '/repo',
        isFile: () => true,
      }),
    ).toBe(`file:${resolve('/repo/release.tgz')}`);
  });

  it.each(validRegistryVersions)(
    'accepts exact registry version %s only in explicit registry mode',
    version => {
      const request = parseConsumerArgs(['--registry', version]);

      expect(request).toEqual({ mode: 'registry', version });
      expect(resolveConsumerSpec(request)).toBe(`@noah-ji/lyra-ui@${version}`);
      expect(isExactSemver(version)).toBe(true);
    },
  );

  it.each(invalidRegistryVersions)(
    'rejects non-exact registry version %s',
    version => {
      expect(isExactSemver(version)).toBe(false);
      expect(() => parseConsumerArgs(['--registry', version])).toThrow(
        'Registry version must be an exact semver',
      );
    },
  );

  it.each(invalidConsumerArgs)('rejects ambiguous arguments %j', args => {
    expect(() => parseConsumerArgs(args)).toThrow();
  });

  it('rejects a missing local tarball', () => {
    const request = parseConsumerArgs(['missing.tgz']);

    expect(() =>
      resolveConsumerSpec(request, {
        cwd: '/repo',
        isFile: () => false,
      }),
    ).toThrow('Tarball does not exist or is not a file: /repo/missing.tgz');
  });
});

describe('registry verification', () => {
  it.each(validRegistryVersions)('accepts exact version %s', version => {
    expect(parseRegistryVersion([version])).toBe(version);
  });

  it.each(invalidRegistryVersions)('rejects unsafe version %s', version => {
    expect(() => parseRegistryVersion([version])).toThrow(
      'Registry version must be an exact semver',
    );
  });

  it('requires exactly one version argument', () => {
    expect(() => parseRegistryVersion([])).toThrow(
      'Usage: verify-registry.mjs <version>',
    );
    expect(() => parseRegistryVersion(['0.2.0', 'extra'])).toThrow(
      'Usage: verify-registry.mjs <version>',
    );
  });

  it('invokes the consumer verifier in explicit registry mode', () => {
    const source = readFileSync('scripts/verify-registry.mjs', 'utf8');

    expect(source).toContain(
      "['scripts/verify-consumer.mjs', '--registry', version]",
    );
  });
});

describe('release registry lookup errors', () => {
  it('treats npm E404 as an unpublished version', () => {
    expect(
      isNpmNotFoundError({
        status: 1,
        stderr: 'npm error code E404\nnpm error 404 Not Found',
      }),
    ).toBe(true);
  });

  it.each([
    {
      status: 1,
      stderr: 'npm error code E401\nnpm error Unable to authenticate',
    },
    { status: 1, stderr: 'npm error code E403\nnpm error Forbidden' },
    {
      status: 1,
      stderr: 'npm error code ENETUNREACH\nnpm error network unreachable',
    },
    { status: 1, message: 'Command failed', stderr: '' },
    new Error('npm error E404 mentioned outside npm stderr'),
  ])('does not hide non-E404 failure %#', error => {
    expect(isNpmNotFoundError(error)).toBe(false);
  });

  it('continues only when npm view returns E404', () => {
    const error = Object.assign(new Error('npm view failed'), {
      status: 1,
      stderr: 'npm error code E404\nnpm error 404 Not Found',
    });

    expect(() =>
      assertVersionIsUnpublished(
        { name: '@noah-ji/lyra-ui', version: '0.2.0' },
        () => {
          throw error;
        },
      ),
    ).not.toThrow();
  });

  it('fails when npm view finds the version', () => {
    expect(() =>
      assertVersionIsUnpublished(
        { name: '@noah-ji/lyra-ui', version: '0.2.0' },
        () => '',
      ),
    ).toThrow('@noah-ji/lyra-ui@0.2.0 already exists');
  });

  it('rethrows non-E404 npm errors unchanged', () => {
    const error = Object.assign(new Error('npm view failed'), {
      status: 1,
      stderr: 'npm error code E401\nnpm error Unable to authenticate',
    });

    expect(() =>
      assertVersionIsUnpublished(
        { name: '@noah-ji/lyra-ui', version: '0.2.0' },
        () => {
          throw error;
        },
      ),
    ).toThrow(error);
  });
});
