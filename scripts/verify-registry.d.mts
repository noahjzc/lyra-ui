import type { Buffer } from 'node:buffer';

export interface RegistryMetadata {
  [field: string]: unknown;
}

export type RegistryExecutionOptions =
  | Readonly<{ encoding: 'utf8' }>
  | Readonly<{ stdio: 'inherit' }>;

export type RegistryExecutor = (
  file: string,
  args: readonly string[],
  options: RegistryExecutionOptions,
) => string | Buffer;

export declare function parseRegistryVersion(args: string[]): string;

export declare function normalizeGithubRepository(
  value: unknown,
): string | null;

export declare function parseRegistryMetadata(
  output: unknown,
): RegistryMetadata;

export declare function verifyRegistry(
  version: string,
  execute?: RegistryExecutor,
): void;
