import { execFileSync } from 'node:child_process';
import { posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const exactEntries = new Set([
  'package/package.json',
  'package/README.md',
  'package/LICENSE',
]);
const distPrefix = 'package/dist/';
const requiredEntries = [
  ...exactEntries,
  'package/dist/styles.css',
  'package/dist/tailwind-theme.css',
];

export function isAllowedTarballEntry(entry) {
  if (typeof entry !== 'string' || entry.length === 0) return false;
  if (entry.includes('\\') || entry.includes('\0')) return false;
  if (posix.isAbsolute(entry) || /^[A-Za-z]:\//.test(entry)) return false;

  const segments = entry.split('/');
  if (segments.includes('.') || segments.includes('..')) return false;
  if (posix.normalize(entry) !== entry) return false;

  return exactEntries.has(entry) || entry.startsWith(distPrefix);
}

export function assertTarballEntries(entries) {
  for (const entry of entries) {
    if (!isAllowedTarballEntry(entry)) {
      throw new Error(`Unexpected tarball entry: ${entry}`);
    }
  }

  for (const required of requiredEntries) {
    if (!entries.includes(required)) {
      throw new Error(`Missing tarball entry: ${required}`);
    }
  }
}

export function verifyTarball(tarball) {
  if (!tarball) throw new Error('tarball path is required');

  const output = execFileSync('tar', ['-tf', tarball], {
    encoding: 'utf8',
  });
  const entries = output.split(/\r?\n/);
  if (entries.at(-1) === '') entries.pop();

  assertTarballEntries(entries);
  console.log(`tarball contents verified: ${entries.length} entries`);
  return entries;
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) verifyTarball(process.argv[2]);
