import type { UploadBeforeResult } from './types';

export function formatFileSize(size?: number) {
  if (size == null) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function acceptTokens(accept?: string) {
  return accept
    ?.split(',')
    .map(token => token.trim().toLowerCase())
    .filter(Boolean);
}

export function matchesAccept(file: File, accept?: string) {
  const tokens = acceptTokens(accept);

  if (!tokens?.length) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return tokens.some(token => {
    if (token.endsWith('/*')) {
      return type.startsWith(token.slice(0, -1));
    }

    if (token.startsWith('.')) {
      return name.endsWith(token);
    }

    return type === token;
  });
}

export function normalizeBeforeResult(
  result: UploadBeforeResult | boolean,
): UploadBeforeResult {
  if (typeof result === 'boolean') {
    return { ok: result };
  }

  return result;
}
