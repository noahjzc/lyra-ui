import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import entrypoints from './config/public-entrypoints.json';

function sourceEntry(path: string) {
  const candidates = [
    `${path}.ts`,
    `${path}.tsx`,
    `${path}/index.ts`,
    `${path}/index.tsx`,
  ];
  const match = candidates.find(candidate => existsSync(candidate));
  if (!match) throw new Error(`Missing public source entry: ${path}`);
  return resolve(match);
}

const entries: Record<string, string> = {
  index: sourceEntry('src/index'),
  overlay: sourceEntry('src/overlay'),
  styles: resolve('src/build-entry.ts'),
};

for (const [category, components] of Object.entries(entrypoints)) {
  entries[category] = sourceEntry(`src/components/${category}`);
  for (const component of components) {
    entries[`${category}/${component}`] = sourceEntry(
      `src/components/${category}/${component}`,
    );
  }
}

const runtimePackages = [
  'react',
  'react-dom',
  '@radix-ui/',
  '@tanstack/react-table',
  'class-variance-authority',
  'clsx',
  'dayjs',
  'lucide-react',
  'tailwind-merge',
];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    cssMinify: false,
    cssCodeSplit: false,
    emptyOutDir: true,
    lib: {
      entry: entries,
      formats: ['es', 'cjs'],
      cssFileName: 'styles',
      fileName: (format, entryName) =>
        `${format === 'es' ? 'esm' : 'cjs'}/${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    outDir: 'dist',
    rollupOptions: {
      external: id =>
        runtimePackages.some(name =>
          name.endsWith('/')
            ? id.startsWith(name)
            : id === name || id.startsWith(`${name}/`),
        ),
      output: {
        assetFileNames: asset =>
          asset.name?.endsWith('.css')
            ? 'styles.css'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
