import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const assetsDirectory = 'dist/assets';
const css = readdirSync(assetsDirectory)
  .filter(file => file.endsWith('.css'))
  .map(file => readFileSync(join(assetsDirectory, file), 'utf8'))
  .join('\n');

for (const contract of ['width:37rem', 'outline-color:var(--ui-ring)']) {
  if (!css.includes(contract)) {
    throw new Error(`Missing consumer Tailwind CSS contract: ${contract}`);
  }
}

console.log('consumer Tailwind CSS contract verified');
