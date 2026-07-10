import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import ts from 'typescript';

const inputPath = process.argv[2];

if (!inputPath) {
  throw new Error(
    'Usage: node scripts/rewrite-imports.mjs <file-or-directory>',
  );
}

const repoRoot = process.cwd();
const srcRoot = resolve(repoRoot, 'src');

function collectFiles(path) {
  if (statSync(path).isFile()) return [path];

  return readdirSync(path, { withFileTypes: true }).flatMap(entry => {
    const child = resolve(path, entry.name);
    return entry.isDirectory() ? collectFiles(child) : [child];
  });
}

function toModuleSpecifier(fromFile, target) {
  let value = relative(dirname(fromFile), target).split(sep).join('/');
  value = value.replace(/\.(?:ts|tsx)$/, '');
  return value.startsWith('.') ? value : `./${value}`;
}

function resolveTarget(specifier) {
  if (specifier === '@/ui/lib/cn') return resolve(srcRoot, 'internal/cn');
  if (specifier === '@/ui/overlay/z-stack') {
    return resolve(srcRoot, 'overlay/z-stack');
  }
  if (specifier === '@/ui/primitives/shared/disclosure-motion') {
    return resolve(srcRoot, 'internal/disclosure-motion');
  }
  if (specifier === '@/ui/primitives') return resolve(srcRoot, 'index');
  if (specifier.startsWith('@/ui/primitives/')) {
    return resolve(
      srcRoot,
      'components',
      specifier.slice('@/ui/primitives/'.length),
    );
  }
  return null;
}

for (const file of collectFiles(resolve(repoRoot, inputPath))) {
  if (!['.ts', '.tsx'].includes(extname(file))) continue;

  const source = readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const edits = [];

  for (const statement of sourceFile.statements) {
    const moduleSpecifier =
      (ts.isImportDeclaration(statement) ||
        ts.isExportDeclaration(statement)) &&
      statement.moduleSpecifier;

    if (!moduleSpecifier || !ts.isStringLiteral(moduleSpecifier)) continue;

    const target = resolveTarget(moduleSpecifier.text);
    if (!target) continue;

    edits.push({
      end: moduleSpecifier.getEnd() - 1,
      start: moduleSpecifier.getStart(sourceFile) + 1,
      value: toModuleSpecifier(file, target),
    });
  }

  const rewritten = edits
    .sort((left, right) => right.start - left.start)
    .reduce(
      (text, edit) =>
        `${text.slice(0, edit.start)}${edit.value}${text.slice(edit.end)}`,
      source,
    );

  if (rewritten !== source) writeFileSync(file, rewritten);
}
