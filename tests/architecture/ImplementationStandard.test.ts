import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

function implementationFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === 'stories' ? [] : implementationFiles(path);
    }
    return ['.ts', '.tsx'].includes(extname(path)) ? [path] : [];
  });
}

const forbiddenPatterns = [
  ['raw Tailwind duration utilities', /\bduration-\d+\b/],
  ['raw Tailwind easing utilities', /\bease-(?:in|out|in-out|linear)\b/],
  ['direct hex color utilities', /#[0-9a-fA-F]{3,8}\b/],
  [
    'direct Tailwind palette color utilities',
    /\b(?:bg|border|fill|ring|stroke|text)-(?:black|blue|cyan|slate|white)(?:[/-]|\b)/,
  ],
  ['one-off arbitrary shadows', /\bshadow-\[/],
  ['one-off arbitrary z-index', /\bz-\[/],
] as const;

describe('UI primitive implementation standard', () => {
  it.each(implementationFiles('src/components'))(
    '%s avoids raw motion, palette, shadow, and z-index utilities',
    filePath => {
      const source = readFileSync(filePath, 'utf8');
      for (const [name, pattern] of forbiddenPatterns) {
        expect(source, `${filePath} contains ${name}`).not.toMatch(pattern);
      }
    },
  );

  it('Form does not keep a catch-all components.tsx aggregate', () => {
    expect(existsSync('src/components/data-input/form/components.tsx')).toBe(
      false,
    );
  });
});
