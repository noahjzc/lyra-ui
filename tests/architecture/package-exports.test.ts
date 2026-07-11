import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import entrypoints from '../../config/public-entrypoints.json';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

const expectedSubpaths = [
  '.',
  './overlay',
  './styles.css',
  './tailwind-theme.css',
  ...Object.entries(entrypoints).flatMap(([category, components]) => [
    `./${category}`,
    ...(components as string[]).map(component => `./${category}/${component}`),
  ]),
  './package.json',
];

describe('package exports', () => {
  it('exposes exactly the approved public subpaths', () => {
    expect(Object.keys(packageJson.exports)).toEqual(expectedSubpaths);
  });

  it('does not expose private form or variant files', () => {
    expect(packageJson.exports['./data-input/form/context']).toBeUndefined();
    expect(packageJson.exports['./data-view/popover/variants']).toBeUndefined();
  });
});
