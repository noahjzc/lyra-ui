export interface ReleasePackageJson {
  name: string;
  version: string;
}

export type NpmViewExecutor = (
  file: string,
  args: readonly string[],
  options: object,
) => string;

export declare function isNpmNotFoundError(error: unknown): boolean;

export declare function assertVersionIsUnpublished(
  packageJson: ReleasePackageJson,
  exec?: NpmViewExecutor,
): void;

export declare function releasePreflight(): void;
