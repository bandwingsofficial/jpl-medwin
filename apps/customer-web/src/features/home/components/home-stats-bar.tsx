"use client";

import { useEffect, useRef, useState } from "react";
import { Package, Award, BadgeCheck, ShieldCheck } from "lucide-react";

type Stat = {
  icon: React.ElementType;
  label: string;
  value: number | null;
  suffix: string;
  word?: string;
  theme: "teal" | "purple" | "blue" | "amber";
};

const STATS: Stat[] = [
  { icon: Package, label: "Active products", value: 2000, suffix: "+", theme: "teal" },
  { icon: Award, label: "Trusted brands", value: 100, suffix: "+", theme: "purple" },
  { icon: BadgeCheck, label: "Genuine quality", value: 100, suffix: "%", theme: "blue" },
  { icon: ShieldCheck, label: "Best price", value: null, suffix: "", word: "Guaranteed", theme: "amber" },
];

const START_DELAY = 5000;
const COUNT_DURATION = 1300;

function useCountUpOnce(target: number | null, started: boolean) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!started || target === null) return;
    let rafId: number;
    let startTime: number | null = null;

    const delayTimer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const p = Math.min((timestamp - startTime) / COUNT_DURATION, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.floor(eased * target));
        if (p < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setDisplay(target);
        }
      };
      rafId = requestAnimationFrame(step);
    }, START_DELAY);

    return () => {
      clearTimeout(delayTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [started, target]);

  return display;
}

function StatCard({ icon: Icon, label, value, suffix, word, theme, started }: Stat & { started: boolean }) {
  const display = useCountUpOnce(value, started);

  return (
    <div className={`stat-card stat-${theme}`}>
      <div className="stat-icon">
        <Icon strokeWidth={2} />
      </div>
      <div className="stat-text">
        <div className="stat-number">
          {value !== null ? (
            <>
              {display.toLocaleString()}
              {suffix}
            </>
          ) : (
            word
          )}
        </div>
        <div className="stat-label">{label}</div>
      </div>
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
        .stats-strip {
          width: 100%;
          box-sizing: border-box;
          padding: 16px 16px;
          background: #ffffff;
          overflow: hidden;
        }

        .stats-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          opacity: ${visible ? 1 : 0};
          transform: translateY(${visible ? "0" : "12px"});
          transition: opacity 0.6s ease, transform 0.6s ease;
          box-sizing: border-box;
        }

        .stat-card {
          border-radius: 14px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-sizing: border-box;
          min-width: 0;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.75);
          flex-shrink: 0;
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5);
        }

        .stat-icon svg {
          width: 20px;
          height: 20px;
        }

        .stat-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          flex: 1;
        }

        .stat-number {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
          line-height: 1.2;
          white-space: nowrap;
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-teal {
          background: #ccfbf1;
        }
        .stat-teal .stat-icon {
          color: #0f766e;
        }
        .stat-teal .stat-number {
          color: #115e59;
        }
        .stat-teal .stat-label {
          color: #0f766e;
        }

        .stat-purple {
          background: #ede9fe;
        }
        .stat-purple .stat-icon {
          color: #6d28d9;
        }
        .stat-purple .stat-number {
          color: #5b21b6;
        }
        .stat-purple .stat-label {
          color: #6d28d9;
        }

        .stat-blue {
          background: #dbeafe;
        }
        .stat-blue .stat-icon {
          color: #1d4ed8;
        }
        .stat-blue .stat-number {
          color: #1e40af;
        }
        .stat-blue .stat-label {
          color: #1d4ed8;
        }

        .stat-amber {
          background: #fef3c7;
        }
        .stat-amber .stat-icon {
          color: #b45309;
        }
        .stat-amber .stat-number {
          color: #92400e;
        }
        .stat-amber .stat-label {
          color: #b45309;
        }

        /* Tablet: keep 4 columns too, just tighten spacing */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
          }
          .stat-card {
            padding: 14px 10px;
            gap: 8px;
          }
        }

        /* Mobile: force single line, 4 columns, stacked icon/text to save width */
       @media (max-width: 640px) {
  .stats-strip {
    padding: 5px 8px;
  }

  .stats-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 5px;
  }

  .stat-card {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 5px 3px;
    border-radius: 9px;
    gap: 2px;
  }

  .stat-icon {
    width: 22px;
    height: 22px;
    border-radius: 7px;
  }

  .stat-icon svg {
    width: 12px;
    height: 12px;
  }

  .stat-text {
    align-items: center;
    gap: 0;
    width: 100%;
  }

  .stat-number {
    font-size: 0.72rem;
    line-height: 1.1;
    white-space: nowrap;
  }

  .stat-label {
    font-size: 0.52rem;
    line-height: 1.1;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

        @media (max-width: 380px) {
          .stat-number {
            font-size: 0.7rem;
          }
          .stat-label {
            font-size: 0.52rem;
          }
          .stat-icon {
            width: 22px;
            height: 22px;
          }
          .stat-icon svg {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>

      <section className="stats-strip">
        <div className="stats-grid" ref={ref}>
          {STATS.map((item, i) => (
            <StatCard key={i} {...item} started={visible} />
          ))}
        </div>
      </section>
    </>
  );
}