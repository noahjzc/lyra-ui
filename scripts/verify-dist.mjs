import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

for (const [subpath, value] of Object.entries(packageJson.exports)) {
  if (subpath === './package.json') continue;
  const targets = typeof value === 'string' ? [value] : Object.values(value);
  for (const target of targets) {
    if (!existsSync(target))
      throw new Error(`Missing export target: ${target}`);
  }
}

const declarations = files('dist/types');
for (const declaration of declarations) {
  if (/\.d\.ts$/.test(declaration)) {
    const source = readFileSync(declaration, 'utf8');
    if (source.includes('@/ui/')) {
      throw new Error(`CRM alias leaked into declaration: ${declaration}`);
    }
  }
}

const css = readFileSync('dist/styles.css', 'utf8');
for (const token of [
  '--ui-background',
  '[data-theme="dark"]',
  '.ly-data-table-cell-pinned-left',
]) {
  if (!css.includes(token)) throw new Error(`Missing CSS contract: ${token}`);
}

console.log('dist contract verified');
