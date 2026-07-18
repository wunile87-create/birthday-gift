import { useState, useEffect } from 'react';

export function useScene() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setScene(1), 1200),
      setTimeout(() => setScene(2), 2800),
      setTimeout(() => setScene(3), 4800),
      setTimeout(() => setScene(4), 7200),
      setTimeout(() => setScene(5), 11000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return { scene };
}