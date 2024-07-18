import { useRef, useEffect } from "react";

//useEffect which runs only after mounting
function useEffectOnlyAfterMount(fn, inputs) {
  const isMountingRef = useRef(false);

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  useEffect(() => {
    if (!isMountingRef.current) {
      return fn();
    } else {
      isMountingRef.current = false;
    }
  }, [inputs, fn]);
}

export default useEffectOnlyAfterMount;
