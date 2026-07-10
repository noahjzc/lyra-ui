export type ConsumerRequest =
  | { mode: 'tarball'; path: string }
  | { mode: 'registry'; version: string };

export interface ConsumerSpecOptions {
  cwd?: string;
  isFile?: (path: string) => boolean;
}

export declare function parseConsumerArgs(args: string[]): ConsumerRequest;

export declare function resolveConsumerSpec(
  request: ConsumerRequest,
  options?: ConsumerSpecOptions,
): string;

export declare function verifyConsumer(args: string[]): void;
