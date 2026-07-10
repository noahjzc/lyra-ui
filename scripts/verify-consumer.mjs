import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';

const requested = process.argv[2] ?? '.pack/noah-ji-lyra-ui-0.1.0.tgz';
const spec = requested.endsWith('.tgz')
  ? `file:${isAbsolute(requested) ? requested : resolve(requested)}`
  : `@noah-ji/lyra-ui@${requested}`;
const target = resolve('.tmp/consumer');

rmSync(target, { force: true, recursive: true });
cpSync('fixtures/consumer', target, { recursive: true });

const packagePath = resolve(target, 'package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
packageJson.dependencies['@noah-ji/lyra-ui'] = spec;
writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

function run(command, args) {
  execFileSync(command, args, { cwd: target, stdio: 'inherit' });
}

run('pnpm', ['install', '--no-frozen-lockfile']);
run('pnpm', ['typecheck']);
run('pnpm', ['build']);
run('pnpm', ['test:cjs']);
run('pnpm', ['test:private']);
