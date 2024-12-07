import { debounce } from "lodash";
import { useEffect, useMemo, useRef } from "react";

const useDebounce = (
  callback: () => void,
  duration: number | undefined = 500
) => {
  const ref = useRef<() => void>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return debouncedCallback;
};

export default useDebounce;
