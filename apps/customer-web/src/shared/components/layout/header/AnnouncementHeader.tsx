"use client";

import { useEffect, useRef, useState } from "react";

const announcements = [
  {
    label: "FIRST 2 ORDERS",
    text: "Free Delivery",
  },
  {
    label: "JPL MEDWIN",
    text: "One Place for All Your Dental Needs",
  },
  {
    label: "LAUNCH OFFER",
    text: "Get 5% OFF on Orders ₹5,000+",
  },
];

export default function AnnouncementHeader() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateMotion = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateMotion();

    mediaQuery.addEventListener("change", updateMotion);

    return () => {
      mediaQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <header className="jpl-announcement-header">
      <style>{`
        /* =========================================================
            JPL MEDWIN — ANNOUNCEMENT BAR
            New palette: deep navy base, warm gold accent.
            Reads as premium/clinical — pairs with the teal nav
            below as a deliberate two-tone brand system rather
            than one repeated color.
        ========================================================= */

        .jpl-announcement-header {
          width: 100%;
          height: 28px;

          position: relative;
          overflow: hidden;

          z-index: 1000;

          color: #ffffff;

          background: linear-gradient(90deg, #0a1f30 0%, #0e2c42 55%, #123a52 100%);

          border-bottom: 1px solid rgba(212, 175, 55, 0.25);

          box-shadow:
            0 2px 10px rgba(4, 15, 24, 0.35);
        }

        /* =========================================================
            VIEWPORT
        ========================================================= */

        .jpl-announcement-viewport {
          width: 100%;
          height: 100%;

          overflow: hidden;

          display: flex;
          align-items: center;

          position: relative;

          z-index: 2;
        }

        /* =========================================================
            SOFT EDGE MASK
        ========================================================= */

        .jpl-announcement-viewport::before,
        .jpl-announcement-viewport::after {
          content: "";

          position: absolute;

          top: 0;
          bottom: 0;

          width: 55px;

          z-index: 10;

          pointer-events: none;
        }

        .jpl-announcement-viewport::before {
          left: 0;

          background:
            linear-gradient(
              90deg,
              rgba(10, 31, 48, 0.95),
              rgba(10, 31, 48, 0)
            );
        }

        .jpl-announcement-viewport::after {
          right: 0;

          background:
            linear-gradient(
              270deg,
              rgba(18, 58, 82, 0.95),
              rgba(18, 58, 82, 0)
            );
        }

        /* =========================================================
            TRACK
        ========================================================= */

        .jpl-announcement-track {
          display: flex;

          width: max-content;
          min-width: max-content;

          align-items: center;

          animation:
            jplAnnouncementScroll
            30s
            linear
            infinite;

          will-change: transform;
        }

        .jpl-announcement-header:hover
        .jpl-announcement-track {
          animation-play-state: paused;
        }

        .jpl-announcement-track.paused {
          animation-play-state: paused;
        }

        .jpl-announcement-track.reduced-motion {
          animation: none;

          transform: translateX(0);
        }

        /* =========================================================
            GROUP
        ========================================================= */

        .jpl-announcement-group {
          display: flex;

          align-items: center;

          flex-shrink: 0;
        }

        /* =========================================================
            ITEM
        ========================================================= */

        .jpl-announcement-item {
          height: 28px;

          display: flex;

          align-items: center;

          padding: 0 32px;

          white-space: nowrap;

          font-family: "DM Sans", sans-serif;

          position: relative;
        }

        /* =========================================================
            VERTICAL DIVIDER
        ========================================================= */

        .jpl-announcement-item:not(:last-child)::after {
          content: "";

          position: absolute;

          right: 0;

          top: 50%;

          transform: translateY(-50%);

          width: 1px;

          height: 14px;

          background: rgba(212, 175, 55, 0.3);
        }

        /* =========================================================
            LABEL
        ========================================================= */

        .jpl-announcement-label {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          margin-right: 8px;

          color: #e8c468;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 0.11em;

          text-transform: uppercase;
        }

        /* =========================================================
            GOLD DOT
        ========================================================= */

        .jpl-announcement-label::before {
          content: "";

          width: 5px;
          height: 5px;

          flex-shrink: 0;

          border-radius: 50%;

          background: linear-gradient(135deg, #f4d786 0%, #d4af37 100%);

          box-shadow:
            0 0 0 2px rgba(212, 175, 55, 0.22),
            0 0 5px rgba(212, 175, 55, 0.5);
        }

        /* =========================================================
            MAIN TEXT
        ========================================================= */

        .jpl-announcement-text {
          color: rgba(255, 255, 255, 0.86);

          font-size: 10px;

          font-weight: 650;

          letter-spacing: 0.005em;
        }

        /* =========================================================
            CONTINUOUS LOOP
        ========================================================= */

        @keyframes jplAnnouncementScroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        /* =========================================================
            TABLET
        ========================================================= */

        @media (max-width: 768px) {
          .jpl-announcement-header {
            height: 28px;
          }

          .jpl-announcement-item {
            height: 28px;

            padding: 0 24px;
          }

          .jpl-announcement-label {
            font-size: 9px;

            margin-right: 7px;
          }

          .jpl-announcement-text {
            font-size: 9px;
          }

          .jpl-announcement-label::before {
            width: 4px;
            height: 4px;
          }

          .jpl-announcement-item:not(:last-child)::after {
            height: 12px;
          }

          .jpl-announcement-viewport::before,
          .jpl-announcement-viewport::after {
            width: 40px;
          }
        }

        /* =========================================================
            MOBILE
        ========================================================= */

        @media (max-width: 480px) {
          .jpl-announcement-header {
            height: 26px;
          }

          .jpl-announcement-item {
            height: 26px;

            padding: 0 16px;
          }

          .jpl-announcement-label {
            font-size: 8.5px;

            letter-spacing: 0.08em;

            margin-right: 6px;
          }

          .jpl-announcement-text {
            font-size: 8.5px;
          }

          .jpl-announcement-label::before {
            width: 4px;
            height: 4px;
          }

          .jpl-announcement-viewport::before,
          .jpl-announcement-viewport::after {
            width: 28px;
          }
        }

        /* =========================================================
            REDUCED MOTION
        ========================================================= */

        @media (prefers-reduced-motion: reduce) {
          .jpl-announcement-track {
            animation: none !important;

            transform: translateX(0) !important;
          }
        }
      `}</style>

      <div className="jpl-announcement-viewport">
        <div
          ref={trackRef}
          className={`jpl-announcement-track ${
            isPaused ? "paused" : ""
          } ${
            reducedMotion ? "reduced-motion" : ""
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* FIRST SET */}
          <div className="jpl-announcement-group">
            {announcements.map((announcement, index) => (
              <div
                className="jpl-announcement-item"
                key={`first-${index}`}
              >
                <span className="jpl-announcement-label">
                  {announcement.label}
                </span>

                <span className="jpl-announcement-text">
                  {announcement.text}
                </span>
              </div>
            ))}
          </div>

          {/* DUPLICATE SET FOR SEAMLESS LOOP */}
          <div
            className="jpl-announcement-group"
            aria-hidden="true"
          >
            {announcements.map((announcement, index) => (
              <div
                className="jpl-announcement-item"
                key={`second-${index}`}
              >
                <span className="jpl-announcement-label">
                  {announcement.label}
                </span>

                <span className="jpl-announcement-text">
                  {announcement.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}