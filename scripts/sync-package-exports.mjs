import { readFileSync, writeFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const entrypoints = JSON.parse(
  readFileSync('config/public-entrypoints.json', 'utf8'),
);

function target(name, types) {
  return {
    types: `./dist/types/${types}`,
    import: `./dist/esm/${name}.js`,
    require: `./dist/cjs/${name}.cjs`,
  };
}

const exportsMap = {
  '.': target('index', 'index.d.ts'),
  './overlay': target('overlay', 'overlay/index.d.ts'),
  './styles.css': './dist/styles.css',
  './tailwind-theme.css': './dist/tailwind-theme.css',
};

for (const [category, components] of Object.entries(entrypoints)) {
  exportsMap[`./${category}`] = target(
    category,
    `components/${category}/index.d.ts`,
  );

  for (const component of components) {
    exportsMap[`./${category}/${component}`] = target(
      `${category}/${component}`,
      `components/${category}/${component}/index.d.ts`,
    );
  }
}

exportsMap['./package.json'] = './package.json';
packageJson.exports = exportsMap;

writeFileSync('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);
