import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  assertVersionIsUnpublished,
  isNpmNotFoundError,
  withoutNpmDryRun,
} from '../../scripts/release-preflight.mjs';
import {
  isExactSemver,
  parseConsumerArgs,
  resolveConsumerSpec,
} from '../../scripts/verify-consumer.mjs';
import {
  normalizeGithubRepository,
  parseRegistryVersion,
  type RegistryExecutionOptions,
  type RegistryExecutor,
  verifyRegistry,
} from '../../scripts/verify-registry.mjs';
import {
  assertTarballEntries,
  isAllowedTarballEntry,
} from '../../scripts/verify-tarball.mjs';

const defaultRegistryExecute = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('default registry executor must not run in tests');
  }),
);

vi.mock('node:child_process', async importOriginal => {
  const actual = await importOriginal<typeof import('node:child_process')>();
  const mocked = {
    ...actual,
    execFileSync: defaultRegistryExecute,
  };
  return {
    ...mocked,
    default: mocked,
  };
});

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
const registryVersion = '0.2.0';
const registryViewArgs = [
  'view',
  `@noah-ji/lyra-ui@${registryVersion}`,
  'name',
  'version',
  'license',
  'dist-tags.latest',
  'dist.integrity',
  'repository.url',
  '--json',
];
const validRegistryMetadata = {
  name: '@noah-ji/lyra-ui',
  version: registryVersion,
  license: 'MIT',
  'dist-tags.latest': registryVersion,
  'dist.integrity': 'sha512-example-integrity',
  'repository.url': 'git+https://github.com/noahjzc/lyra-ui.git',
};

interface RegistryCall {
  file: string;
  args: readonly string[];
  options: RegistryExecutionOptions;
}

function createRegistryExecutor(
  npmResult: string | Error,
  calls: RegistryCall[],
): RegistryExecutor {
  return (file, args, options) => {
    calls.push({ file, args: [...args], options });
    if (file === 'npm') {
      if (npmResult instanceof Error) throw npmResult;
      return npmResult;
    }
    return Buffer.alloc(0);
  };
}

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
      expect(resolveConsumerSpec(request)).toBe(version);
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
  beforeEach(() => {
    defaultRegistryExecute.mockClear();
  });

  it.each(validRegistryVersions)('accepts exact version %s', version => {
    expect(parseRegistryVersion([version])).toBe(version);
  });

  it.each([
    ['git+https://github.com/noahjzc/lyra-ui.git', 'noahjzc/lyra-ui'],
    ['https://github.com/noahjzc/lyra-ui', 'noahjzc/lyra-ui'],
    ['https://github.com/noahjzc/lyra-ui.git', 'noahjzc/lyra-ui'],
    ['git@github.com:noahjzc/lyra-ui.git', 'noahjzc/lyra-ui'],
    ['https://github.com/noahjzc/lyra-ui-fork.git', 'noahjzc/lyra-ui-fork'],
    ['https://github.com/another-owner/lyra-ui.git', 'another-owner/lyra-ui'],
  ])('normalizes GitHub repository form %s', (repository, expected) => {
    expect(normalizeGithubRepository(repository)).toBe(expected);
  });

  it.each([
    null,
    { url: 'https://github.com/noahjzc/lyra-ui.git' },
    'http://github.com/noahjzc/lyra-ui.git',
    'https://gitlab.com/noahjzc/lyra-ui.git',
    'https://github.com/noahjzc/lyra-ui/tree/main',
    'https://github.com/noahjzc/lyra-ui.git?ref=main',
    'git@github.com:noahjzc/lyra-ui/extra.git',
  ])('rejects invalid GitHub repository value %j', repository => {
    expect(normalizeGithubRepository(repository)).toBeNull();
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

  it('queries complete metadata before verifying the registry consumer', () => {
    const calls: RegistryCall[] = [];

    verifyRegistry(
      registryVersion,
      createRegistryExecutor(JSON.stringify(validRegistryMetadata), calls),
    );

    expect(calls).toEqual([
      {
        file: 'npm',
        args: registryViewArgs,
        options: { encoding: 'utf8' },
      },
      {
        file: 'node',
        args: ['scripts/verify-consumer.mjs', '--registry', registryVersion],
        options: { stdio: 'inherit' },
      },
    ]);
    expect(defaultRegistryExecute).not.toHaveBeenCalled();
  });

  it.each([
    ['name', { name: '@noah-ji/lyra-ui-fork' }, 'registry name mismatch'],
    ['version', { version: '0.2.1' }, 'registry version mismatch'],
    ['license', { license: 'Apache-2.0' }, 'registry license mismatch'],
    [
      'dist-tags.latest',
      { 'dist-tags.latest': '0.1.0' },
      'registry latest tag mismatch',
    ],
    [
      'dist.integrity',
      { 'dist.integrity': '   ' },
      'registry integrity missing',
    ],
    [
      'repository.url',
      { 'repository.url': 'https://github.com/noahjzc/lyra-ui-fork.git' },
      'registry repository mismatch',
    ],
  ])(
    'rejects invalid %s metadata before consumer verification',
    (_, override, message) => {
      const calls: RegistryCall[] = [];
      const metadata = { ...validRegistryMetadata, ...override };

      expect(() =>
        verifyRegistry(
          registryVersion,
          createRegistryExecutor(JSON.stringify(metadata), calls),
        ),
      ).toThrow(message);
      expect(calls).toEqual([
        {
          file: 'npm',
          args: registryViewArgs,
          options: { encoding: 'utf8' },
        },
      ]);
    },
  );

  it.each([
    'git+https://github.com/noahjzc/lyra-ui.git',
    'https://github.com/noahjzc/lyra-ui',
    'https://github.com/noahjzc/lyra-ui.git',
    'git@github.com:noahjzc/lyra-ui.git',
  ])('accepts npm repository form %s', repository => {
    const calls: RegistryCall[] = [];
    const metadata = {
      ...validRegistryMetadata,
      'repository.url': repository,
    };

    expect(() =>
      verifyRegistry(
        registryVersion,
        createRegistryExecutor(JSON.stringify(metadata), calls),
      ),
    ).not.toThrow();
    expect(calls).toHaveLength(2);
  });

  it.each([
    'https://github.com/noahjzc/lyra-ui-fork.git',
    'https://github.com/another-owner/lyra-ui.git',
    'https://gitlab.com/noahjzc/lyra-ui.git',
    'https://github.com/noahjzc/lyra-ui/tree/main',
    'git@github.com:noahjzc/lyra-ui/extra.git',
  ])('rejects non-canonical repository %s', repository => {
    const calls: RegistryCall[] = [];
    const metadata = {
      ...validRegistryMetadata,
      'repository.url': repository,
    };

    expect(() =>
      verifyRegistry(
        registryVersion,
        createRegistryExecutor(JSON.stringify(metadata), calls),
      ),
    ).toThrow('registry repository mismatch');
    expect(calls).toHaveLength(1);
    expect(calls[0]?.file).toBe('npm');
  });

  it.each([
    Object.assign(new Error('registry authentication failed'), {
      code: 'E401',
    }),
    Object.assign(new Error('registry network failed'), {
      code: 'ENETUNREACH',
    }),
  ])('rethrows npm execution failure unchanged', failure => {
    const calls: RegistryCall[] = [];
    let thrown: unknown;

    try {
      verifyRegistry(registryVersion, createRegistryExecutor(failure, calls));
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBe(failure);
    expect(calls).toEqual([
      {
        file: 'npm',
        args: registryViewArgs,
        options: { encoding: 'utf8' },
      },
    ]);
  });

  it.each([
    ['malformed JSON', '{', 'registry metadata is not valid JSON'],
    [
      'null metadata',
      JSON.stringify(null),
      'registry metadata must be an object',
    ],
    [
      'array metadata',
      JSON.stringify([]),
      'registry metadata must be an object',
    ],
  ])('rejects %s before consumer verification', (_, output, message) => {
    const calls: RegistryCall[] = [];

    expect(() =>
      verifyRegistry(registryVersion, createRegistryExecutor(output, calls)),
    ).toThrow(message);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.file).toBe('npm');
  });
});

describe('release registry lookup errors', () => {
  it('does not leak an outer npm publish dry-run into nested pack checks', () => {
    expect(
      withoutNpmDryRun({
        npm_config_dry_run: 'true',
        NPM_CONFIG_DRY_RUN: 'true',
        KEEP_ME: 'yes',
      }),
    ).toEqual({ KEEP_ME: 'yes' });
  });

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
