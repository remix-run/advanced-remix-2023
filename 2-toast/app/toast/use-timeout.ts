import { useEffect, useRef } from "react";

export function useTimeout(callback: () => void, timeout: number) {
  const ref = useRef(callback);
  useEffect(() => {
    ref.current = callback;
  }, [callback]);
  useEffect(() => {
    const id = setTimeout(() => ref.current(), timeout);
    return () => clearTimeout(id);
  }, [timeout]);
}
