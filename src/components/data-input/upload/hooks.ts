import * as React from 'react';
import type { UploadFileItem } from './types';

export function useUploadFiles({
  defaultValue = [],
  onValueChange,
  value,
}: {
  defaultValue?: UploadFileItem[];
  onValueChange?: (files: UploadFileItem[]) => void;
  value?: UploadFileItem[];
}) {
  const [internalValue, setInternalValue] =
    React.useState<UploadFileItem[]>(defaultValue);
  const mergedValue = value ?? internalValue;

  const setValue = React.useCallback(
    (nextFiles: UploadFileItem[]) => {
      if (value == null) {
        setInternalValue(nextFiles);
      }

      onValueChange?.(nextFiles);
    },
    [onValueChange, value],
  );

  return [mergedValue, setValue] as const;
}
