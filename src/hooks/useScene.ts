import { useState, useEffect, useCallback, useRef } from 'react';

export function useScene() {
  const [scene, setScene] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startScene = useCallback(() => {
    if (isStarted) return;
    setIsStarted(true);

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [
      setTimeout(() => setScene(1), 1200),
      setTimeout(() => setScene(2), 2800),
      setTimeout(() => setScene(3), 4800),
      setTimeout(() => setScene(4), 7200),
      setTimeout(() => setScene(5), 11000),
    ];
  }, [isStarted]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return { scene, startScene };
}