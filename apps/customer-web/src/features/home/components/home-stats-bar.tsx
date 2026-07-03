"use client";

import { useEffect, useRef, useState } from "react";
import { Award, BadgeCheck, Package, ShieldCheck } from "lucide-react";

const STATS = [
  { icon: Package, title: "Products", value: 10000, suffix: "+" },
  { icon: Award, title: "Trusted Brands", value: 100, suffix: "+" },
  { icon: BadgeCheck, title: "Original", value: 100, suffix: "%" },
  { icon: ShieldCheck, title: "Assured Best Prices", value: null, suffix: "" },
];

function useCountUp(target: number | null, duration = 1200, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started || target === null) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
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
  started,
}: {
  icon: React.ElementType;
  title: string;
  value: number | null;
  suffix: string;
  started: boolean;
}) {
  const count = useCountUp(value, 1200, started);

  return (
    <div className="stat-item">
      <div className="icon-wrapper">
        <Icon className="stat-icon" strokeWidth={2.5} />
      </div>
      <span className="stat-text">
        {value !== null ? `${count.toLocaleString()}${suffix} ${title}` : title}
      </span>
      <span className="stat-underline" />
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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .stats-section {
          width: 100%;
          padding: 12px 16px;
          background: #fff;
        }
        .stats-inner {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ---------- Brand-Dark Blue Glassmorphism Capsule ---------- */
        .stats-capsule {
          position: relative;
          width: 100%;
          border-radius: 999px;
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          overflow: hidden;
          isolation: isolate;

          /* Updated baseline background to match the vibrant dark blue of the hover state */
          background: linear-gradient(
            135deg,
            rgba(26, 54, 110, 0.75) 0%,
            rgba(30, 64, 175, 0.6) 50%,
            rgba(26, 54, 110, 0.75) 100%
          );
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);

          box-shadow:
            0 10px 30px rgba(10, 25, 50, 0.45),
            inset 0 1px 1px rgba(255, 255, 255, 0.35),
            inset 0 -1px 1px rgba(15, 32, 67, 0.4);

          opacity: ${visible ? 1 : 0};
          transform: translateY(${visible ? 0 : "10px"});
          transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.4s ease, background 0.4s ease;
        }

        /* ---------- Animated rotating gradient border ---------- */
        .stats-capsule::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1.5px;
          border-radius: inherit;
          background: conic-gradient(
            from 0deg,
            rgba(255, 255, 255, 0.85),
            rgba(37, 99, 235, 0.3) 20%,
            rgba(255, 255, 255, 0.1) 40%,
            rgba(191, 219, 254, 0.9) 60%,
            rgba(37, 99, 235, 0.3) 80%,
            rgba(255, 255, 255, 0.85) 100%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: borderSpin 5s linear infinite;
          pointer-events: none;
          z-index: 2;
          transition: opacity 0.4s ease;
        }

        @keyframes borderSpin {
          to { transform: rotate(360deg); }
        }

        /* ---------- Continuous shimmer sweep across the glass ---------- */
        .stats-capsule::after {
          content: "";
          position: absolute;
          top: 0;
          left: -60%;
          width: 45%;
          height: 100%;
          background: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-20deg);
          animation: shimmerSweep 4.5s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes shimmerSweep {
          0%   { left: -60%; }
          55%  { left: 130%; }
          100% { left: 130%; }
        }

        /* ---------- Hover state: Same dark blue colour, with glows and faster animations ---------- */
        .stats-capsule:hover {
          background: linear-gradient(
            135deg,
            rgba(26, 54, 110, 0.75) 0%,
            rgba(30, 64, 175, 0.6) 50%,
            rgba(26, 54, 110, 0.75) 100%
          );
          box-shadow:
            0 14px 40px rgba(29, 78, 216, 0.5),
            0 0 0 1px rgba(147, 197, 253, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.45),
            inset 0 -1px 1px rgba(10, 25, 47, 0.5);
        }
        .stats-capsule:hover::before {
          animation-duration: 2.2s;
        }

        .stat-item {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex: 1;
          cursor: pointer;
        }
        .stat-item > .icon-wrapper,
        .stat-item > .stat-text {
          /* keep icon + label on one row, underline sits below */
        }

        .stat-item {
          flex-direction: row;
          justify-content: center;
          gap: 10px;
        }

        /* Per-item hover highlight */
        .stat-item:hover .icon-wrapper {
          transform: scale(1.18) rotate(-6deg);
          background: rgba(255, 255, 255, 0.35);
          border-color: rgba(191, 219, 254, 0.9);
          box-shadow: 0 0 18px rgba(147, 197, 253, 0.75);
        }
        .stat-item:hover .stat-text {
          transform: translateX(2px);
          opacity: 1;
          color: #eff6ff;
          text-shadow: 0 0 12px rgba(147, 197, 253, 0.8), 0 1px 3px rgba(10, 25, 47, 0.6);
        }
        .stat-item:hover .stat-underline {
          transform: scaleX(1);
          opacity: 1;
        }

        .icon-wrapper {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 50%;
          backdrop-filter: blur(6px);
          transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .stat-icon {
          width: 16px;
          height: 16px;
          color: #fff;
        }
        .stat-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          text-shadow: 0 1px 3px rgba(10, 25, 47, 0.6);
          transition: transform 0.3s ease, color 0.3s ease, text-shadow 0.3s ease;
        }

        /* animated underline highlight beneath each stat on hover */
        .stat-underline {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          transform-origin: center;
          width: 70%;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(191, 219, 254, 0.95) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          opacity: 0;
          transition: transform 0.35s ease, opacity 0.35s ease;
        }

        @media (max-width: 768px) {
          .stats-capsule {
            border-radius: 20px;
            padding: 16px;
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          .stat-item {
            width: 100%;
            justify-content: flex-start;
          }
          .stat-text {
            font-size: 0.85rem;
            white-space: normal;
          }
          .stat-item:hover .stat-text {
            transform: none;
          }
          .stat-underline {
            left: 42px;
            transform: scaleX(0);
            transform-origin: left;
            width: 40%;
          }
          .stat-item:hover .stat-underline {
            transform: scaleX(1);
          }
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
                started={visible}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}