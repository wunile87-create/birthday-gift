import { useState, useEffect, useMemo, useRef, type CSSProperties } from "react";
import "../styles/Stars.css";

type Props = {
  scene: number;
};

type Star = {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  type: "small" | "normal" | "bright" | "cross";
  blinkDelay: number;
  blinkDuration: number;
};

type TextTarget = {
  id: number;
  x: number;
  y: number;
  char: string;
};

type TextStar = TextTarget & {
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  settleScale: number;
};

const TOTAL_STARS_COUNT = 240;
const TEXT_STAR_COUNT = 3;

function Stars({ scene }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [textTargets, setTextTargets] = useState<TextTarget[]>([]);
  const greetingRef = useRef<HTMLDivElement | null>(null);
  const shouldShowGreeting = scene >= 5;

  // 🔒 严格恢复你最初写好的、最完美的4种星星物理形态与概率分布
  const allStarsData = useMemo<Star[]>(() => {
    return Array.from({ length: TOTAL_STARS_COUNT }, (_, index) => {
      const random = Math.random();
      let size = 2;
      let color = "rgba(255,255,255,.4)";
      let type: Star["type"] = "small";

      if (random < 0.7) {
        size = 1.5;
        color = "rgba(255,255,255,.35)";
        type = "small";
      } else if (random < 0.9) {
        size = 3.5;
        color = "rgba(255,255,255,.7)";
        type = "normal";
      } else if (random < 0.96) {
        size = 8;
        color = "#ffd700"; // 最初闪耀的大黄星
        type = "bright";
      } else {
        size = 16;
        color = "#ffffff"; // 最初神圣的十字星
        type = "cross";
      }

      return {
        id: index,
        left: Math.random() * window.innerWidth,
        top: Math.random() * window.innerHeight,
        size,
        color,
        type,
        blinkDelay: Math.random() * -5,
        blinkDuration: 2.5 + Math.random() * 2.5, // 最初最舒适的呼吸周期
      };
    });
  }, []);

  // 🌟 核心：控制这4种星星“一颗、两颗慢慢亮起来”
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= TOTAL_STARS_COUNT) {
          clearInterval(interval);
          return prev;
        }
        // 开头极慢，让大伙儿肉眼可见地看着这4种星星由少变多亮起
        return prev < 25 ? prev + 1 : prev + 4;
      });
    }, 130);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!shouldShowGreeting) {
      setTextTargets([]);
      return;
    }

    const measureTargets = () => {
      if (!greetingRef.current) return;

      const containerRect = greetingRef.current.parentElement?.getBoundingClientRect();
      const nodes = greetingRef.current.querySelectorAll<HTMLElement>("[data-char]");

      const nextTargets = Array.from(nodes)
        .map((node, index) => {
          const box = node.getBoundingClientRect();
          return {
            id: index,
            x: box.left - (containerRect?.left ?? 0) + box.width / 2,
            y: box.top - (containerRect?.top ?? 0) + box.height / 2,
            char: node.dataset.char || "",
          } as TextTarget;
        })
        .filter((target) => target.char.trim() !== "");

      setTextTargets(nextTargets);
    };

    const frame = requestAnimationFrame(measureTargets);
    const onResize = () => measureTargets();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [shouldShowGreeting]);

  const activeStars = allStarsData.slice(0, visibleCount);

  const textStars = useMemo<TextStar[]>(() => {
    if (textTargets.length === 0) return [];

    return textTargets.slice(0, TEXT_STAR_COUNT).map((target, index) => {
      const angle = (index / Math.max(textTargets.length, 1)) * Math.PI * 2 + (index % 2 === 0 ? 0.4 : -0.4);
      const distance = 170 + (index % 4) * 35 + Math.random() * 40;
      const startX = target.x + Math.cos(angle) * distance;
      const startY = target.y + Math.sin(angle) * distance;
      return {
        ...target,
        startX,
        startY,
        size: 11 + Math.random() * 8,
        duration: 1.0 + (index % 5) * 0.08 + Math.random() * 0.16,
        delay: index * 0.05,
        settleScale: 0.95 + (index % 4) * 0.08,
      };
    });
  }, [textTargets]);

  return (
    <div className={`stars-container ${scene >= 4 ? 'celebration-mode' : ''}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      {shouldShowGreeting && (
        <div ref={greetingRef} className="final-text-layer fade-in">
          <div className="line-1">
            {Array.from("先生").map((char, index) => (
              <span key={`line1-${index}`} data-char={char} className="final-text-char" style={{ ['--char-index' as string]: index } as CSSProperties}>
                {char}
              </span>
            ))}
          </div>
          <div className="line-2">
            {Array.from("お誕生日おめでとうございます。" ).map((char, index) => (
              <span key={`line2-${index}`} data-char={char} className="final-text-char" style={{ ['--char-index' as string]: index } as CSSProperties}>
                {char}
              </span>
            ))}
          </div>
        </div>
      )}

      {shouldShowGreeting &&
        textStars.map((star) => (
          <div
            key={`${star.id}-${star.char}`}
            className="text-assembly-star"
            style={{
              left: `${star.startX}px`,
              top: `${star.startY}px`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              ['--start-x' as string]: `${star.startX}px`,
              ['--start-y' as string]: `${star.startY}px`,
              ['--to-x' as string]: `${star.x}px`,
              ['--to-y' as string]: `${star.y}px`,
              ['--duration' as string]: `${star.duration}s`,
              ['--delay' as string]: `${star.delay}s`,
              ['--settle-scale' as string]: `${star.settleScale}`,
            } as CSSProperties}
          >
            ✦
          </div>
        ))}
      {/* 🌌 渲染最初的4种星星，没有位移，没有拼字，只有最纯粹的原地呼吸 */}
      {activeStars.map((star, index) => {
        const dynamicClass = `star-unit ${star.type} independent-blink`;
        const isVisible = index < visibleCount;

        return (
          <div
            key={star.id}
            className={dynamicClass}
            style={{
              position: 'absolute',
              left: `${star.left}px`,
              top: `${star.top}px`,
              width: star.type === "cross" ? "auto" : `${star.size}px`,
              height: star.type === "cross" ? "auto" : `${star.size}px`,
              background: star.type === "cross" || star.type === "bright" ? "transparent" : star.color,
              color: star.color,
              textShadow: star.type === "bright" ? `0 0 8px ${star.color}` : 'none',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.25s ease',
              "--blink-delay": `${star.blinkDelay}s`,
              "--blink-duration": `${star.blinkDuration}s`,
            } as React.CSSProperties}
          >
            {star.type === "cross" ? "✦" : star.type === "bright" ? "✨" : ""}
          </div>
        );
      })}
    </div>
  );
}

export default Stars;