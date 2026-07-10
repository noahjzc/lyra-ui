import { execFileSync } from 'node:child_process';

const tarball = process.argv[2];
if (!tarball) throw new Error('tarball path is required');

const entries = execFileSync('tar', ['-tf', tarball], {
  encoding: 'utf8',
})
  .trim()
  .split('\n');

const allowedRoots = [
  'package/package.json',
  'package/README.md',
  'package/LICENSE',
  'package/dist/',
];

for (const entry of entries) {
  if (!allowedRoots.some(root => entry === root || entry.startsWith(root))) {
    throw new Error(`Unexpected tarball entry: ${entry}`);
  }
}

for (const required of [
  'package/package.json',
  'package/README.md',
  'package/LICENSE',
  'package/dist/styles.css',
]) {
  if (!entries.includes(required))
    throw new Error(`Missing tarball entry: ${required}`);
}

console.log('tarball contents verified');
