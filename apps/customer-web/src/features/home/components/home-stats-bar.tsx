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
        .stats-capsule {
          width: 100%;
          border-radius: 999px;
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: linear-gradient(135deg, #0c8c7f 0%, #0fa593 100%);
          box-shadow: 0 10px 25px -5px rgba(12, 140, 127, 0.3);
          opacity: ${visible ? 1 : 0};
          transform: translateY(${visible ? 0 : "10px"});
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          justify-content: center;
          cursor: pointer;
        }
        
        /* Smooth Interactive Hover Effects */
        .stat-item:hover .icon-wrapper {
          transform: scale(1.15);
          background: rgba(255, 255, 255, 0.25);
        }
        .stat-item:hover .stat-text {
          transform: translateX(2px);
          opacity: 0.95;
        }

        .icon-wrapper {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          backdrop-filter: blur(4px);
          transition: transform 0.25s ease, background 0.25s ease;
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
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          transition: transform 0.25s ease;
        }

        @media (max-width: 768px) {
          .stats-capsule {
            border-radius: 16px;
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
          /* Disable horizontal text move animation on mobile */
          .stat-item:hover .stat-text {
            transform: none;
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