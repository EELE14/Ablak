/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef } from "react";
import { watchViewport } from "ablak";

export function useScrollProgress(): React.RefObject<number> {
  const ref = useRef<number>(0);

  useEffect(() => {
    return watchViewport(
      ({ scroll, size }) => {
        const docScrollable = size.docY - size.y;
        ref.current = docScrollable > 0 ? scroll.top / docScrollable : 0;
      },
      { only: ["scroll", "size"] },
    );
  }, []);

  return ref;
}
