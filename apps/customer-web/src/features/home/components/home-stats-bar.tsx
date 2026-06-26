"use client";

import { useEffect, useRef, useState } from "react";
import { Award, BadgeCheck, Package, ShieldCheck } from "lucide-react";

const STATS = [
  { icon: Package, title: "10,000+ Products", value: 10000, suffix: "+" },
  { icon: Award, title: "100+ Trusted Brands", value: 100, suffix: "+" },
  { icon: BadgeCheck, title: "100% Original", value: 100, suffix: "%" },
  { icon: ShieldCheck, title: "Assured Best Prices", value: null, suffix: "" },
];

// Hook: count-up animation
function useCountUp(target: number | null, duration = 1400, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started || target === null) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return count;
}

function StatItem({
  icon: Icon,
  title,
  value,
  suffix,
  index,
  started,
}: {
  icon: React.ElementType;
  title: string;
  value: number | null;
  suffix: string;
  index: number;
  started: boolean;
}) {
  const count = useCountUp(value, 1400, started);
  const displayText =
    value !== null
      ? `${count.toLocaleString()}${suffix} ${title.replace(/^[\d,+%]+ /, "")}`
      : title;

  return (
    <div
      className="stat-item"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Shimmer ring around icon */}
      <div className="icon-wrapper">
        <div className="icon-ring" />
        <Icon className="stat-icon" strokeWidth={2.5} />
      </div>

      <span className="stat-text">{displayText}</span>

      {/* Vertical divider — hidden on last & on mobile */}
      {index < STATS.length - 1 && <div className="divider" />}
    </div>
  );
}

export function HomeStatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .stats-section {
          width: 100%;
          padding: 4px 26px;
          background: #fff;
        }

        .stats-inner {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Capsule */
        .stats-capsule {
          position: relative;
          width: 100%;
          border-radius: 999px;
          overflow: hidden;
          padding: 20px 24px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-around;
          gap: 16px;

          /* Animated gradient background */
          background: linear-gradient(
            120deg,
            #0c8c7f 0%,
            #0fa593 40%,
            #0c8c7f 70%,
            #0a7a6e 100%
          );
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite;

          /* Depth shadow */
          box-shadow:
            0 8px 32px rgba(12, 140, 127, 0.35),
            0 2px 8px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255,255,255,0.15);

          /* Entrance */
          opacity: ${visible ? 1 : 0};
          transition: opacity 0.5s ease;
        }

        /* Subtle inner gloss */
        .stats-capsule::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.12) 0%,
            rgba(255,255,255,0) 60%
          );
          pointer-events: none;
          border-radius: inherit;
        }

        /* Traveling shimmer sweep */
        .stats-capsule::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.08),
            transparent
          );
          animation: sweep 4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes sweep {
          0%   { left: -60%; }
          100% { left: 160%; }
        }

        /* Each stat item */
        .stat-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1 1 auto;
          min-width: 160px;
          justify-content: center;
          padding: 4px 16px;

          opacity: 0;
          animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
          animation-play-state: ${visible ? "running" : "paused"};
        }

        .stat-item:hover .icon-wrapper {
          transform: scale(1.18) rotate(-6deg);
        }
        .stat-item:hover .stat-text {
          letter-spacing: 0.02em;
        }
        .stat-item:hover .icon-ring {
          opacity: 1;
          animation: pulse-glow 1s ease-out 1;
        }

        /* Icon circle */
        .icon-wrapper {
          position: relative;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
          backdrop-filter: blur(4px);
        }

        /* Rotating ring */
        .icon-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1.5px dashed rgba(255,255,255,0.35);
          opacity: 0;
          animation: shimmer 8s linear infinite;
          transition: opacity 0.3s;
        }

        .stat-icon {
          width: 18px;
          height: 18px;
          color: #fff;
          flex-shrink: 0;
          }

        .stat-text {
          font-size: clamp(0.78rem, 1.4vw, 0.96rem);
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          letter-spacing: 0.01em;
          transition: letter-spacing 0.3s ease;
          text-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }

        /* Divider */
        .divider {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 28px;
          background: rgba(255,255,255,0.22);
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .stats-capsule {
            border-radius: 24px;
            padding: 20px 16px;
            gap: 16px 12px;
            justify-content: space-between;
          }
          .stat-item {
            flex: 0 0 calc(50% - 6px);
            min-width: unset;
            padding: 6px 4px;
            justify-content: flex-start;
            box-sizing: border-box;
          }
          .divider {
            display: none;
          }
          .stat-text {
            font-size: 0.8rem;
            white-space: normal;
            line-height: 1.2;
          }
          .icon-wrapper {
            width: 34px;
            height: 34px;
          }
          .stat-icon {
            width: 16px;
            height: 16px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .stats-capsule,
          .stats-capsule::after,
          .icon-ring { animation: none; }
          .stat-item { opacity: 1; animation: none; }
        }
      `}</style>

      <section className="stats-section">
        <div className="stats-inner">
          <div className="stats-capsule" ref={ref}>
            {STATS.map((item, i) => (
              <StatItem
                key={i}
                icon={item.icon}
                title={item.title}
                value={item.value}
                suffix={item.suffix}
                index={i}
                started={visible}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}