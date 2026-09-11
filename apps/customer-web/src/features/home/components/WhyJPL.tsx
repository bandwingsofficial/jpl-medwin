"use client";

import { useEffect, useRef } from "react";

const reasons = [
  {
    number: "01",
    title: "All Your Dental Needs",
    description:
      "Dental materials, instruments, consumables and essential supplies — conveniently available in one place.",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 3.5C7.1 3.5 5.5 5 5.5 6.9C5.5 9.5 6.8 11.1 6.8 14.1C6.8 17.4 7.6 20.5 9.1 20.5C10.3 20.5 10.5 17.1 12 17.1C13.5 17.1 13.7 20.5 14.9 20.5C16.4 20.5 17.2 17.4 17.2 14.1C17.2 11.1 18.5 9.5 18.5 6.9C18.5 5 16.9 3.5 15 3.5C13.4 3.5 12.8 4.4 12 4.4C11.2 4.4 10.6 3.5 9 3.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.2 8.2C10.2 7.5 11.1 7.3 12 7.3C12.9 7.3 13.8 7.5 14.8 8.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  {
    number: "02",
    title: "Quality You Can Trust",
    description:
      "Carefully sourced products from trusted brands to support the quality and safety expected in dental practice.",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 3L19 6V11.2C19 15.8 16.3 19.7 12 21C7.7 19.7 5 15.8 5 11.2V6L12 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8.7 12L10.9 14.2L15.4 9.8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  {
    number: "03",
    title: "Competitive Prices",
    description:
      "Get the dental products you need at competitive prices, with clear pricing and GST-inclusive billing.",
    icon: (
  <span
    aria-hidden="true"
    style={{
      fontSize: "21px",
      fontWeight: 600,
      lineHeight: 1,
      fontFamily: "Arial, sans-serif",
    }}
  >
    ₹
  </span>
),
  },

  {
    number: "04",
    title: "Reliable Delivery",
    description:
      "Dependable delivery support helps ensure your essential dental supplies reach you when you need them.",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3.5 6.5H14.5V17.5H3.5V6.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 10H18L20.5 12.8V17.5H14.5V10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle
          cx="7"
          cy="18"
          r="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="17"
          cy="18"
          r="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M18 10V13H20.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  {
    number: "05",
    title: "Trusted Dental Brands",
    description:
      "Explore products from established dental and medical brands, all brought together for convenient online purchasing.",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 4.5H19V19.5H5V4.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8 8H16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 11.5H16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 15H12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  {
    number: "06",
    title: "Simple Online Ordering",
    description:
      "Find products, compare prices, add to cart and place your order easily from one convenient platform.",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3.5 5H5.2L7.1 15.2C7.3 16.2 8.2 17 9.3 17H17.5C18.5 17 19.3 16.4 19.6 15.5L21 9H6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="9.5"
          cy="20"
          r="1.2"
          fill="currentColor"
        />
        <circle
          cx="17"
          cy="20"
          r="1.2"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export default function WhyJPL() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const elements = section.querySelectorAll(
      ".why-jpl-reveal"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("why-jpl-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="why-jpl-section"
      aria-labelledby="why-jpl-title"
    >
      <style>{`
        .why-jpl-section,
        .why-jpl-section *,
        .why-jpl-section *::before,
        .why-jpl-section *::after {
          box-sizing: border-box;
        }

        .why-jpl-section {
          width: 100%;
          padding: 0 20px 52px;
          background: #ffffff;
          overflow: hidden;
        }

        .why-jpl-container {
          width: 100%;
          padding-top: 12px;
          max-width: 98%;
          margin: 0 auto;
        }

        /* ----------------------------------------
           SECTION HEADER
        ---------------------------------------- */

        .why-jpl-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          margin-bottom: 28px;
        }

        .why-jpl-heading {
          min-width: 0;
          max-width: none;
        }

       .why-jpl-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 10px;
  font-size: clamp(27px, 3vw, 34px);
  font-family: "DM Sans", sans-serif;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.025em;
  white-space: nowrap;
}

.why-jpl-eyebrow-black {
  color: #000000;
}

.why-jpl-eyebrow-teal {
  background: linear-gradient(
    90deg,
    #0f766e 0%,
    #0d9488 35%,
    #14b8a6 60%,
    #059669 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.why-jpl-eyebrow::before {
  content: "";
  width: 3px;
  height: 30px;
  border-radius: 2px;
  background: #0d9488;
}
        .why-jpl-title {
          margin: 0;
          color: #0f172a;
          font-family: "DM Sans", sans-serif;
           font-size: 11px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0.04em;
        }

        .why-jpl-title-accent {
          color: #0d9488;
        }

        .why-jpl-intro {
          max-width: 430px;
          margin: 0;
          color: #64748b;
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.65;
        }

        /* ----------------------------------------
           CARDS
        ---------------------------------------- */

        .why-jpl-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .why-jpl-card {
          position: relative;
          min-width: 0;
          min-height: 178px;
          padding: 19px 18px 18px;
          background: #ffffff;
          border: 1px solid #e5eaf0;
          border-radius: 8px;
          overflow: hidden;
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .why-jpl-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #0d9488;
          transition: width 0.28s ease;
        }

        .why-jpl-card:hover {
          transform: translateY(-3px);
          border-color: #cfe4e2;
          box-shadow: 0 8px 22px rgba(15, 118, 110, 0.07);
        }

        .why-jpl-card:hover::before {
          width: 100%;
        }

        .why-jpl-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .why-jpl-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #0d9488;
          background: #effcf9;
          border: 1px solid #d9f2ed;
          border-radius: 8px;
          transition:
            color 0.25s ease,
            background 0.25s ease,
            border-color 0.25s ease;
        }

        .why-jpl-card:hover .why-jpl-icon {
          color: #ffffff;
          background: #0d9488;
          border-color: #0d9488;
        }

        .why-jpl-number {
          color: #cbd5e1;
          font-family: "DM Sans", sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
        }

        .why-jpl-card-title {
          margin: 0 0 6px;
          color: #0f172a;
          font-family: "DM Sans", sans-serif;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        .why-jpl-card-description {
          margin: 0;
          color: #64748b;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.6;
        }

        /* ----------------------------------------
           BOTTOM STRIP
        ---------------------------------------- */

        .why-jpl-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 16px;
          padding: 13px 16px;
          background: #f8fafc;
          border: 1px solid #e8edf2;
          border-radius: 7px;
        }

        .why-jpl-bottom-content {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .why-jpl-check {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #0d9488;
          background: #e8faf6;
          border-radius: 50%;
        }

        .why-jpl-bottom-title {
          margin: 0;
          color: #334155;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.4;
        }

        .why-jpl-bottom-text {
          margin: 2px 0 0;
          color: #94a3b8;
          font-family: "DM Sans", sans-serif;
          font-size: 11px;
          font-weight: 400;
          line-height: 1.4;
        }

        .why-jpl-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          color: #0d9488;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: gap 0.2s ease;
        }

        .why-jpl-link:hover {
          gap: 9px;
        }

        /* ----------------------------------------
           SCROLL REVEAL
        ---------------------------------------- */

        .why-jpl-reveal {
          opacity: 0;
          transform: translateY(10px);
          transition:
            opacity 0.5s ease,
            transform 0.5s ease;
        }

        .why-jpl-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .why-jpl-grid .why-jpl-card:nth-child(1) {
          transition-delay: 0ms;
        }

        .why-jpl-grid .why-jpl-card:nth-child(2) {
          transition-delay: 50ms;
        }

        .why-jpl-grid .why-jpl-card:nth-child(3) {
          transition-delay: 100ms;
        }

        .why-jpl-grid .why-jpl-card:nth-child(4) {
          transition-delay: 150ms;
        }

        .why-jpl-grid .why-jpl-card:nth-child(5) {
          transition-delay: 200ms;
        }

        .why-jpl-grid .why-jpl-card:nth-child(6) {
          transition-delay: 250ms;
        }

        /* ----------------------------------------
           TABLET
        ---------------------------------------- */

        @media (max-width: 900px) {
          .why-jpl-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }

          .why-jpl-intro {
            max-width: 650px;
          }

          .why-jpl-title {
            white-space: normal;
          }

          .why-jpl-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        /* ----------------------------------------
           MOBILE
        ---------------------------------------- */

        @media (max-width: 600px) {
          .why-jpl-section {
            padding: 0 16px 42px;
          }

          .why-jpl-header {
            margin-bottom: 22px;
          }

          .why-jpl-title {
            font-size: 27px;
            white-space: normal;
          }

          .why-jpl-intro {
            font-size: 12px;
            line-height: 1.6;
          }

          .why-jpl-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .why-jpl-card {
            min-height: 0;
            padding: 17px;
          }

          .why-jpl-card-top {
            margin-bottom: 12px;
          }

          .why-jpl-bottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }

          .why-jpl-link {
            margin-left: 38px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .why-jpl-reveal,
          .why-jpl-card,
          .why-jpl-icon,
          .why-jpl-link {
            transition: none !important;
          }
        }
      `}</style>

      <div className="why-jpl-container">

        {/* SECTION HEADER */}
        <div className="why-jpl-header why-jpl-reveal">
          <div className="why-jpl-heading">
            <div className="why-jpl-eyebrow">
  <span className="why-jpl-eyebrow-black">Why</span>{" "}
  <span className="why-jpl-eyebrow-teal">Choose JPL</span>
</div>

            <h2
              id="why-jpl-title"
              className="why-jpl-title"
            >
              Everything You Need for Your
              <span className="why-jpl-title-accent">
                {" "}Dental Practice
              </span>
            </h2>
          </div>
        </div>

        {/* REASONS */}
        <div className="why-jpl-grid">
          {reasons.map((reason) => (
            <article
              key={reason.number}
              className="why-jpl-card why-jpl-reveal"
            >
              <div className="why-jpl-card-top">
                <div className="why-jpl-icon">
                  {reason.icon}
                </div>

                <span className="why-jpl-number">
                  {reason.number}
                </span>
              </div>

              <h3 className="why-jpl-card-title">
                {reason.title}
              </h3>

              <p className="why-jpl-card-description">
                {reason.description}
              </p>
            </article>
          ))}
        </div>

        {/* SMALL TRUST STRIP */}
        <div className="why-jpl-bottom why-jpl-reveal">
          <div className="why-jpl-bottom-content">
            <div className="why-jpl-check">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12.5L9.5 17L19 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <p className="why-jpl-bottom-title">
                Made for dental professionals
              </p>

              <p className="why-jpl-bottom-text">
                Quality products, trusted brands and dependable service.
              </p>
            </div>
          </div>

          <a
            href="/about"
            className="why-jpl-link"
          >
            Know More About JPL

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />

              <path
                d="M13 6L19 12L13 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}