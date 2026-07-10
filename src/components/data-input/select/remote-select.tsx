import { LoaderCircle, RotateCw } from 'lucide-react';
import * as React from 'react';
import { SelectField } from './select-field';
import type { RemoteSelectProps, SelectOption } from './types';

export function RemoteSelect({
  debounceMs = 300,
  emptyText = '暂无匹配选项',
  errorText = '选项加载失败',
  loadOptions,
  loadingText = '加载选项中',
  onOpenChange,
  selectedOption,
  value,
  ...props
}: RemoteSelectProps) {
  const [keyword, setKeyword] = React.useState('');
  const [options, setOptions] = React.useState<SelectOption[]>(
    selectedOption ? [selectedOption] : [],
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);
  const [open, setOpen] = React.useState(false);
  const [requestVersion, setRequestVersion] = React.useState(0);
  const requestIdRef = React.useRef(0);
  const displayOptions = React.useMemo(() => {
    if (
      selectedOption == null ||
      options.some(option => option.value === selectedOption.value)
    ) {
      return options;
    }

    return [selectedOption, ...options];
  }, [options, selectedOption]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 重试版本变化时需重新发起请求。
  React.useEffect(() => {
    if (!open) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(null);
      loadOptions(keyword.trim())
        .then(nextOptions => {
          if (requestIdRef.current !== requestId) return;

          setOptions(previousOptions => {
            const preservedSelected = previousOptions.find(
              option => option.value === value,
            );

            if (
              preservedSelected == null ||
              nextOptions.some(
                option => option.value === preservedSelected.value,
              )
            ) {
              return nextOptions;
            }

            return [preservedSelected, ...nextOptions];
          });
        })
        .catch(nextError => {
          if (requestIdRef.current === requestId) {
            setError(nextError);
          }
        })
        .finally(() => {
          if (requestIdRef.current === requestId) {
            setLoading(false);
          }
        });
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [debounceMs, keyword, loadOptions, open, requestVersion, value]);

  function handleRetry() {
    setRequestVersion(version => version + 1);
  }

  return (
    <SelectField
      {...props}
      emptyText={
        loading ? (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
            {loadingText}
          </span>
        ) : error ? (
          <span className="inline-flex items-center gap-2 text-ui-destructive">
            {errorText}
            <button
              className="inline-flex h-6 items-center gap-1 rounded border border-(--ui-input-error-border) bg-(--ui-input-error-background) px-2 text-xs font-extrabold"
              onClick={event => {
                event.stopPropagation();
                handleRetry();
              }}
              type="button"
            >
              <RotateCw aria-hidden="true" className="size-3" />
              重试
            </button>
          </span>
        ) : (
          emptyText
        )
      }
      onOpenChange={nextOpen => {
        setOpen(nextOpen);
        onOpenChange?.(nextOpen);
      }}
      onSearchChange={setKeyword}
      options={loading || error ? [] : displayOptions}
      searchable
      searchValue={keyword}
      value={value}
    />
  );
}
