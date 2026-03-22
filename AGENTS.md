# AGENTS.md — lyra-ui

> A lightweight React component library built with Storybook, Vitest, Vite, and LESS.

## Quick Commands

| Task                            | Command                                               |
| ------------------------------- | ----------------------------------------------------- |
| Install dependencies            | `pnpm install`                                        |
| Start Storybook                 | `pnpm storybook`                                      |
| Build Storybook                 | `pnpm build-storybook`                                |
| Run all unit tests              | `pnpm test`                                           |
| Run tests in watch mode         | `pnpm test:watch`                                     |
| Run a single test file          | `pnpm vitest run path/to/file.test.ts`                |
| Run tests matching a name       | `pnpm vitest -t "test name"`                          |
| Run Storybook interaction tests | Via Storybook UI or `pnpm vitest --project storybook` |
| Lint TypeScript                 | `pnpm lint`                                           |
| Lint LESS styles                | `pnpm lint:style`                                     |
| Auto-fix lint issues            | `pnpm lint --fix` / `pnpm lint:style --fix`           |
| Format code                     | `pnpm format`                                         |
| Check formatting                | `pnpm format:check`                                   |
| Type-check                      | `pnpm tsc --noEmit`                                   |

**Package manager:** pnpm 10.32.1 — always use `pnpm`, never `npm` or `yarn`.

## Tech Stack

- **React 19** with **TypeScript 5.9** (strict mode)
- **Storybook 10.3** with `@storybook/react-vite`
- **Vitest 4.1** + **jsdom** for unit testing
- **Playwright** for browser testing
- **Vite 8** as bundler
- **LESS** for styling
- **ESLint** with `typescript-eslint` for code linting
- **Stylelint** with `stylelint-config-standard-less` for LESS linting
- **Prettier** for code formatting
- All deps are devDependencies; this is a library, not an app

## Project Structure

```
stories/           # Components, their LESS, and story files
  Button.tsx        # Component
  button.less       # Component styles
  Button.stories.ts # Storybook stories
  Button.test.tsx   # Unit tests
vite.config.ts      # Vite + Vitest configuration
vitest.setup.ts     # Vitest setup (jest-dom matchers)
eslint.config.js    # ESLint flat config
.prettierrc         # Prettier config
stylelint.config.js # Stylelint config for LESS
vite-env.d.ts       # Type declarations for .less modules
.storybook/         # Storybook configuration
.github/workflows/  # CI (NPM publish only, no lint/test CI yet)
```

## TypeScript Configuration

The project uses strict TypeScript. Key flags in `tsconfig.json`:

- `strict: true` — all strict checks enabled
- `jsx: "react-jsx"` — automatic JSX transform, no `import React` needed in JSX files
- `moduleResolution: "bundler"` — modern ESM resolution

## Code Style

### Formatting

Prettier enforces: single quotes, trailing commas, semicolons, 80-char line width, 2-space indent. Run `pnpm format` before committing.

### Components

- Use **arrow functions** with destructured props (not `function` declarations)
- Export the **props interface** with JSDoc comments on each property
- Default parameter values for optional props where appropriate

```tsx
export interface ButtonProps {
  /** Primary variant */
  primary?: boolean;
  /** Button label text */
  label: string;
  onClick?: () => void;
}

export const Button = ({ primary = false, label, ...props }: ButtonProps) => {
  return (
    <button type="button" {...props}>
      {label}
    </button>
  );
};
```

### Imports

- Use `import type` for type-only imports (ESLint enforces `consistent-type-imports`)
- Place type imports first, then third-party, then local — separated by blank lines
- LESS imports at the bottom of the import block

```ts
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';
import './button.less';
```

### Naming

- **Components:** PascalCase filenames and exports (`Button.tsx`, `export const Button`)
- **Props interfaces:** PascalCase with `Props` suffix (`ButtonProps`)
- **Types:** PascalCase (`type User`)
- **CSS classes:** BEM-like with `storybook-` prefix (`storybook-button--primary`)
- **Story files:** `<Component>.stories.ts`
- **Test files:** `<Component>.test.tsx`

### Types

- Prefer `interface` for object shapes (props), `type` for unions/intersections/aliases
- Use `satisfies` for Storybook meta objects: `const meta = { ... } satisfies Meta<typeof Button>`
- Avoid `any`; use `unknown` with type narrowing if needed
- Never use `@ts-ignore` — use `@ts-expect-error` instead

### Storybook Stories

- Use `type Story = StoryObj<typeof meta>` pattern
- Export named stories for each variant: `export const Primary: Story = { args: { ... } }`
- Add `tags: ['autodocs']` to meta for auto-generated docs
- Use `fn()` from `storybook/test` for action mocks, not `action()`

### LESS Styles

- Use `.less` files co-located with component (e.g., `button.less` next to `Button.tsx`)
- BEM-like naming: `storybook-button`, `storybook-button--primary`, `storybook-button--large`
- Take advantage of LESS features (nesting, variables, mixins) as needed

### Unit Tests

- Use `@testing-library/react` with Vitest
- Test file naming: `<Component>.test.tsx`
- Use `describe` / `it` blocks
- Use `vi.fn()` for mocking callbacks
- Check element presence via `screen.getByRole` / `toBeInTheDocument`
- Check className via `button.className.contains(...)`
- Check inline styles via `element.style.property`

### Error Handling

- Prefer early returns and guard clauses over nested conditions

## What to Avoid

- Do not add `import React from 'react'` — the `react-jsx` transform handles this
- Do not use `npm` or `yarn` — this project uses `pnpm`
- Do not add production `dependencies` — this is a library; everything goes in `devDependencies`
- Do not create files outside `stories/` or `.storybook/` without discussion
- Do not leave `console.log` in committed code

## Current Gaps

- No `build` script in package.json (CI expects `pnpm build`)
- No `index.js` entry point referenced by `package.json` `main` field
- No CI workflow for lint/test
