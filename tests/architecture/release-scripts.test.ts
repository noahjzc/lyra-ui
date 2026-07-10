import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  parseConsumerArgs,
  resolveConsumerSpec,
} from '../../scripts/verify-consumer.mjs';
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

  it('accepts only an explicit registry mode for versions', () => {
    const request = parseConsumerArgs(['--registry', '0.2.0']);

    expect(request).toEqual({ mode: 'registry', version: '0.2.0' });
    expect(resolveConsumerSpec(request)).toBe('@noah-ji/lyra-ui@0.2.0');
  });

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
