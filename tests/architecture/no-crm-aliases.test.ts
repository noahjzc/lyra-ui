import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

describe('package source boundaries', () => {
  it('does not retain crm-ui aliases', () => {
    for (const file of sourceFiles('src')) {
      if (!['.ts', '.tsx'].includes(extname(file))) continue;
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/@\/ui\//);
    }
  });

  it('does not import component css from TypeScript', () => {
    for (const file of sourceFiles('src/components')) {
      if (!['.ts', '.tsx'].includes(extname(file))) continue;
      expect(readFileSync(file, 'utf8'), file).not.toMatch(
        /(?:from|import)\s*['"][^'"]+\.css['"]/,
      );
    }
  });
});
