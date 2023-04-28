import { useEffect, useRef } from "react";

export function useTimeout(callback: () => void, timeout: number) {
  let ref = useRef(callback);
  useEffect(() => {
    ref.current = callback;
  }, [callback]);
  useEffect(() => {
    let id = setTimeout(() => ref.current(), timeout);
    return () => clearTimeout(id);
  }, [timeout]);
}
