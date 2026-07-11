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

export declare function withoutNpmDryRun(
  environment?: NodeJS.ProcessEnv,
): NodeJS.ProcessEnv;

export declare function releasePreflight(): void;
