import { useEffect, useState } from "react";

type SceneProps = {
  children: (scene: number) => React.ReactNode;
};

function Scene({ children }: SceneProps) {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setScene(1), 1000),
      setTimeout(() => setScene(2), 5000),
      setTimeout(() => setScene(3), 7000),
      setTimeout(() => setScene(4), 10000),
      setTimeout(() => setScene(5), 13000),
      setTimeout(() => setScene(6), 16000),
      setTimeout(() => setScene(7), 20000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return <>{children(scene)}</>;
}

export default Scene;