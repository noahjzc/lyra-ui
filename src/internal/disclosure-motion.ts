import * as React from 'react';

const DISCLOSURE_EXIT_FALLBACK_MS = 240;

export const disclosurePanelMotionClassName =
  'grid overflow-hidden transition-[grid-template-rows] duration-(--ui-motion-duration-disclosure) ease-(--ui-motion-ease-standard) motion-reduce:transition-none';

export const disclosurePanelContentMotionClassName = {
  closed: 'animate-ui-disclosure-out motion-reduce:animate-none',
  open: 'animate-ui-disclosure-in motion-reduce:animate-none',
} as const;

export interface DisclosureMotionItemState {
  open: boolean;
  present: boolean;
  visible: boolean;
}

export interface DisclosureMotionState {
  getDisclosureState: (key: string) => DisclosureMotionItemState;
  handleDisclosureTransitionEnd: (
    event: React.TransitionEvent<HTMLElement>,
    key: string,
  ) => void;
  reducedMotion: boolean;
}

function createKeySet(keys: readonly string[]) {
  return new Set(keys);
}

function hasSameKeys(current: Set<string>, next: Set<string>) {
  if (current.size !== next.size) return false;

  for (const key of current) {
    if (!next.has(key)) return false;
  }

  return true;
}

export function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener?.('change', handleChange);

    return () => {
      mediaQuery.removeEventListener?.('change', handleChange);
    };
  }, []);

  return reducedMotion;
}

export function useDisclosureMotion(
  openKeys: readonly string[],
): DisclosureMotionState {
  const reducedMotion = usePrefersReducedMotion();
  const openKeySignature = openKeys.join('\0');
  const openKeysRef = React.useRef(openKeys);
  const presentKeysRef = React.useRef(createKeySet(openKeys));
  const visibleKeysRef = React.useRef(createKeySet(openKeys));
  const [presentKeys, setPresentKeys] = React.useState<Set<string>>(() =>
    createKeySet(openKeys),
  );
  const [visibleKeys, setVisibleKeys] = React.useState<Set<string>>(() =>
    createKeySet(openKeys),
  );

  openKeysRef.current = openKeys;
  presentKeysRef.current = presentKeys;
  visibleKeysRef.current = visibleKeys;

  React.useEffect(() => {
    const currentOpenKeys = openKeysRef.current;
    const nextOpenKeys = createKeySet(currentOpenKeys);

    if (reducedMotion) {
      setPresentKeys(current =>
        hasSameKeys(current, nextOpenKeys) ? current : nextOpenKeys,
      );
      setVisibleKeys(current =>
        hasSameKeys(current, nextOpenKeys) ? current : nextOpenKeys,
      );
      return;
    }

    const currentPresentKeys = presentKeysRef.current;
    const nextVisibleKeys = new Set(
      currentOpenKeys.filter(openKey => currentPresentKeys.has(openKey)),
    );
    const openingKeys = currentOpenKeys.filter(
      openKey => !currentPresentKeys.has(openKey),
    );

    setPresentKeys(current => {
      const next = new Set(current);
      let changed = false;

      for (const openKey of currentOpenKeys) {
        if (!next.has(openKey)) {
          next.add(openKey);
          changed = true;
        }
      }

      return changed ? next : current;
    });
    setVisibleKeys(current =>
      hasSameKeys(current, nextVisibleKeys) ? current : nextVisibleKeys,
    );

    let visibilityFrame: number | undefined;
    const animationFrame =
      openingKeys.length > 0
        ? window.requestAnimationFrame(() => {
            visibilityFrame = window.requestAnimationFrame(() => {
              setVisibleKeys(current => {
                const next = new Set(current);

                for (const openingKey of openingKeys) {
                  next.add(openingKey);
                }

                return hasSameKeys(current, next) ? current : next;
              });
            });
          })
        : undefined;

    const exitTimeout = window.setTimeout(() => {
      const latestOpenKeys = createKeySet(openKeysRef.current);

      setPresentKeys(current => {
        const next = new Set(current);
        let changed = false;

        for (const key of current) {
          if (!latestOpenKeys.has(key)) {
            next.delete(key);
            changed = true;
          }
        }

        return changed ? next : current;
      });
    }, DISCLOSURE_EXIT_FALLBACK_MS);

    return () => {
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
      if (visibilityFrame !== undefined) {
        window.cancelAnimationFrame(visibilityFrame);
      }
      window.clearTimeout(exitTimeout);
    };
  }, [openKeySignature, reducedMotion]);

  const getDisclosureState = React.useCallback(
    (key: string): DisclosureMotionItemState => ({
      open: openKeysRef.current.includes(key),
      present: presentKeysRef.current.has(key),
      visible: visibleKeysRef.current.has(key),
    }),
    [],
  );

  const handleDisclosureTransitionEnd = React.useCallback(
    (event: React.TransitionEvent<HTMLElement>, key: string) => {
      if (event.currentTarget !== event.target) return;
      if (openKeysRef.current.includes(key)) return;

      setPresentKeys(current => {
        if (!current.has(key)) return current;

        const next = new Set(current);
        next.delete(key);
        return next;
      });
    },
    [],
  );

  return {
    getDisclosureState,
    handleDisclosureTransitionEnd,
    reducedMotion,
  };
}
