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
for (const token of ['--ui-background', '.ly-data-table-cell-pinned-left']) {
  if (!css.includes(token)) throw new Error(`Missing CSS contract: ${token}`);
}
if (!/\[data-theme=(?:"dark"|'dark'|dark)\]/.test(css)) {
  throw new Error('Missing CSS contract: [data-theme="dark"]');
}

const tailwindTheme = readFileSync('dist/tailwind-theme.css', 'utf8');
if (!tailwindTheme.includes('@theme inline')) {
  throw new Error('Missing raw Tailwind theme contract: @theme inline');
}
if (!tailwindTheme.includes('--color-ui-background:')) {
  throw new Error('Missing raw Tailwind theme contract: UI color mapping');
}
if (tailwindTheme.includes('--ui-background:')) {
  throw new Error('Tailwind theme contract must not duplicate token values');
}

console.log('dist contract verified');
