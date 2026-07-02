"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "100+", label: "Trusted Brands" },
  { value: "10,000+", label: "Products Available" },
  { value: "25+", label: "States Served Across India" },
];

const values = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <path d="M14 23L12.7 21.8C7.2 16.8 4 13.9 4 10.3C4 7.4 6.3 5 9.2 5C10.8 5 12.3 5.8 13.2 7C14.1 5.8 15.6 5 17.2 5C20.1 5 22.4 7.4 22.4 10.3C22.4 13.9 19.2 16.8 13.7 21.8L14 23Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "Compassion",
    desc: "Understanding and supporting the deep needs of healthcare professionals and the patient lives they actively protect daily.",
  },
 {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {/* Lightbulb outline */}
        <path d="M9 18h6M10 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 3a7 7 0 00-7 7c0 2.34 1.15 4.42 2.92 5.7A2 2 0 018.7 17.2V18h6.6v-.8a2 2 0 01.78-1.5A7 7 0 0012 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Spark/Innovation ray */}
        <path d="M12 7v2M10 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Innovation",
    desc: "Continuously introducing better specialized products and intelligent solutions that enhance precision healthcare delivery.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <path d="M14 4L22 7V13C22 18.2 18.8 22.9 14 24C9.2 22.9 6 18.2 6 13V7L14 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10.5 14L13 16.5L17.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Trust & Integrity",
    desc: "Building enduring, high-integrity relationships through absolute transparency, business ethics, and localized accountability.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 21C7 17.7 10.1 15.5 14 15.5C17.9 15.5 21 17.7 21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 9C23.7 9.3 25 10.7 25 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 12.5C3 10.7 4.3 9.3 6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Customer-Centric Excellence",
    desc: "Putting client needs and professional fulfillment directly at the heart of every organizational decision and action.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11.5 11L13.3 12.8L16.8 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 16.5L10 23L14 20.5L18 23L17 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "Quality & Compliance",
    desc: "Upholding the absolute highest modern standards of material quality, global safety, and precise regulatory compliance.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 9V14L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Reliability & Timely Delivery",
    desc: "Ensuring entirely seamless supply chain mechanisms and highly dependable support service exactly when it matters most.",
  },
];

const team = [
  { initials: "RP", name: "Rajesh Pillai", role: "Founder & CEO", color: "#115E59" },
  { initials: "SM", name: "Sunita Menon", role: "Head of Procurement", color: "#115E59" },
  { initials: "AK", name: "Arjun Khanna", role: "Director, Partnerships", color: "#115E59" },
  { initials: "PD", name: "Priya Deshpande", role: "Customer Success Lead", color: "#115E59" },
];

function AnimatedCounter({ target }: { target: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const suffix = target.replace(/[0-9,]/g, "");
          const num = parseInt(target.replace(/\D/g, ""), 10);
          let start = 0;
          const duration = 1800;
          const step = Math.ceil(num / (duration / 16));
          const timer = setInterval(() => {
            start = Math.min(start + step, num);
            setDisplay(start.toLocaleString() + suffix);
            if (start >= num) clearInterval(timer);
          }, 16);
        }
      }) as IntersectionObserverCallback,
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{display}</span>;
}

function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

export function AboutUsPage() {
  const [mounted, setMounted] = useState(false);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const statsRef = useScrollReveal();
  const whoWeAreRef = useScrollReveal();
  const missionVisionRef = useScrollReveal(100);
  const valuesRef = useScrollReveal();
  const productRef = useScrollReveal();
  const teamRef = useScrollReveal();
  const certRef = useScrollReveal();

  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#0F172A", background: "#FFFFFF", width: "100%", overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap');

        /* ── Reset ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Scroll Reveal ── */
        .reveal-section {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-active { opacity: 1 !important; transform: translateY(0) !important; }

        /* Hero entry */
        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

        /* ── Stats Section ── */
        .stat-item {
          position: relative;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .stat-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 32px;
          height: 2px;
          background: #0D9488;
          transition: transform 0.3s ease;
        }
        .stat-item:hover::after { transform: translateX(-50%) scaleX(1); }
        .stat-item:hover { transform: translateY(-3px); }
        .stat-value {
  font-family: 'Outfit';
  font-size: clamp(40px, 4vw, 56px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}
        .stat-accent { color: #0D9488; }

        /* ── Who We Are ── */
        .wwa-image-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 2px;
        }
        .wwa-image-wrap img {
          display: block;
          width: 100%;
          height: 420px;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .wwa-image-wrap:hover img { transform: scale(1.04); }
        .wwa-overlay-badge {
          position: absolute;
          bottom: 24px;
          right: -12px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(13,148,136,0.2);
          padding: 14px 20px;
          border-radius: 2px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
          min-width: 140px;
          text-align: center;
        }
        .wwa-corner-line {
          position: absolute;
          bottom: -16px;
          right: -16px;
          width: 65%;
          height: 65%;
          border: 1.5px solid #0D9488;
          border-radius: 2px;
          z-index: -1;
          opacity: 0.4;
        }
        .wwa-dot-grid {
          position: absolute;
          top: -20px;
          left: -20px;
          width: 100px;
          height: 100px;
          background-image: radial-gradient(circle, #0D9488 1px, transparent 1px);
          background-size: 12px 12px;
          opacity: 0.25;
          z-index: 1;
          pointer-events: none;
        }

        /* ── Mission Vision ── */
        .mv-block {
          position: relative;
          overflow: hidden;
          padding: 72px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }
        .mv-block::before {
          content: '"';
          font-family: 'Playfair Display', serif;
          font-size: 240px;
          line-height: 1;
          color: rgba(255,255,255,0.06);
          position: absolute;
          top: -20px;
          left: 20px;
          pointer-events: none;
          font-weight: 700;
        }
        .mv-label {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #2DD4BF;
          font-weight: 600;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mv-label::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 1px;
          background: #2DD4BF;
        }
        .mv-quote {
          font-family: 'Playfair Display', serif;
          font-size: clamp(17px, 2.2vw, 22px);
          font-style: italic;
          color: #FFFFFF;
          line-height: 1.6;
          font-weight: 400;
          max-width: 500px;
          position: relative;
          z-index: 1;
        }

        /* ── Values ── */
        .value-card {
          background: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 2px;
          padding: 28px 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          cursor: default;
        }
        .value-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(13,148,136,0.04) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .value-card:hover::before { opacity: 1; }
        .value-card:hover {
          border-color: #0D9488;
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -12px rgba(13,148,136,0.18);
        }
        .value-card-num {
          font-family: 'Playfair Display', serif;
          font-size: 64px;
          font-weight: 700;
          color: rgba(13,148,136,0.06);
          line-height: 1;
          position: absolute;
          top: 8px;
          right: 16px;
          transition: color 0.4s ease;
          pointer-events: none;
        }
        .value-card:hover .value-card-num { color: rgba(13,148,136,0.1); }
        .value-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(13,148,136,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0D9488;
          margin-bottom: 16px;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .value-card:hover .value-icon {
          background: #0D9488;
          color: #FFFFFF;
          transform: rotate(-6deg) scale(1.1);
        }

        /* ── Product Banner ── */
        .product-banner {
          position: relative;
          height: 340px;
          overflow: hidden;
        }
        .product-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
          display: block;
          transition: transform 8s ease;
        }
        .product-banner:hover img { transform: scale(1.04); }
        .product-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(4,47,46,0.92) 0%, rgba(17,94,89,0.5) 55%, transparent 100%);
        }
        .product-banner-text {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .product-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(45,212,191,0.15);
          border: 1px solid rgba(45,212,191,0.3);
          color: #2DD4BF;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 16px;
        }

        /* ── Team ── */
        .team-card {
          background: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 2px;
          padding: 28px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .team-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #0D9488, #2DD4BF);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .team-card:hover::before { transform: scaleX(1); }
        .team-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.1);
          border-color: #E2E8F0;
        }
        .team-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #115E59;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          margin: 0 auto 14px;
          position: relative;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .team-avatar::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid rgba(13,148,136,0);
          transition: all 0.4s ease;
        }
        .team-card:hover .team-avatar::after {
          border-color: rgba(13,148,136,0.4);
          inset: -6px;
        }
        .team-card:hover .team-avatar { box-shadow: 0 8px 24px rgba(17,94,89,0.3); }

        /* ── Certifications ticker ── */
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .cert-ticker-track {
          display: flex;
          gap: 0;
          animation: ticker 18s linear infinite;
          width: max-content;
        }
        .cert-ticker-track:hover { animation-play-state: paused; }
        .cert-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 36px;
          white-space: nowrap;
          border-right: 1px solid #E2E8F0;
        }
        .cert-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0D9488;
          flex-shrink: 0;
        }

        /* ── CTA buttons ── */
        .jpl-cta-btn {
          display: inline-block;
          background: #FCD34D;
          color: #0F172A;
          padding: 12px 28px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .jpl-cta-btn:hover {
          background: #E2B632;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(252,211,77,0.3);
        }
        .jpl-sec-btn {
          display: inline-block;
          background: transparent;
          color: #FFFFFF;
          padding: 12px 28px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.4);
          transition: all 0.2s ease;
        }
        .jpl-sec-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: #FFFFFF;
          transform: translateY(-1px);
        }

        /* ── Section eyebrow ── */
        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #0D9488;
          font-weight: 600;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .eyebrow::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 1.5px;
          background: #0D9488;
        }

        /* ── Horizontal rule dividers ── */
        .section-rule {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, #0D9488, #2DD4BF);
          margin: 16px 0 0;
          border-radius: 1px;
        }

        @media (max-width: 768px) {
          .mv-block { padding: 52px 28px; }
          .wwa-overlay-badge { right: 8px; }
          .product-banner-text { padding: 0 20px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal-section, .stat-item, .value-card, .team-card, .wwa-image-wrap img { transition: none !important; }
          .cert-ticker-track { animation: none; }
        }
      `}} />

      {/* ══════════════════════════════════════
          HERO — UNTOUCHED AS REQUESTED
      ══════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          padding: "80px 24px 100px 24px",
          backgroundImage: "linear-gradient(to right, rgba(11, 94, 105, 0.92) 25%, rgba(11, 94, 105, 0.8) 55%, rgba(11, 94, 105, 0.55) 100%), url('/Logo/About-bg1.jfif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          minHeight: "60vh",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ maxWidth: 650, marginTop: 0 }}>
            <div className="fade-up" style={{ animationDelay: "0.15s" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#FFFFFF", fontSize: "clamp(38px, 5vw, 56px)", fontWeight: 600, lineHeight: 1.1, marginBottom: 24, letterSpacing: "0.01em" }}>
                Trust, Innovation & <span style={{ color: "#FCD34D" }}>Compassion</span>
              </h1>
            </div>
            <div className="fade-up" style={{ animationDelay: "0.3s" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#E2E8F0", fontSize: 16, lineHeight: 1.6, marginBottom: 32, fontWeight: 400 }}>
                At JPL Markwin Private Limited, our foundation is built on deep <strong>Trust</strong>, cutting-edge <strong>Innovation</strong>, and profound <strong>Compassion</strong> for patient welfare. We translate these core principles into delivering superior medical infrastructure and personalized healthcare components across India.
              </p>
            </div>
            <div className="fade-up" style={{ animationDelay: "0.45s", display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="/products" className="jpl-cta-btn">Browse Catalogue</a>
              <a href="/contact" className="jpl-sec-btn">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR — Oversized numbers, ruled
      ══════════════════════════════════════ */}
      <section
        ref={statsRef}
        className="reveal-section"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #EEF2F7", position: "relative", overflow: "hidden" }}
      >
        {/* Ambient background teal watermark */}
        <div style={{
          position: "absolute",
          right: "-60px",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "'Playfair Display', serif",
          fontSize: 320,
          fontWeight: 700,
          color: "rgba(13,148,136,0.03)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "-0.05em",
        }}>+</div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-item" style={{
              padding: "40px 24px 36px",
              borderRight: i < stats.length - 1 ? "1px solid #EEF2F7" : "none",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}>
              <div className="stat-value">
                <span className="stat-accent">{mounted ? <AnimatedCounter target={s.value} /> : "0"}</span>
              </div>
              <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, #0D9488 0%, transparent 80%)", margin: "4px 0 8px", opacity: 0.35 }} />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748B", fontWeight: 400, letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHO WE ARE
      ══════════════════════════════════════ */}
      <section
        ref={whoWeAreRef}
        className="reveal-section"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60, alignItems: "center" }}
      >
        <div>
          <div className="eyebrow">About JPL Markwin</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, marginBottom: 20 }}>
            More Than a Marketplace —<br />A True Healthcare Supply Partner
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#475569", lineHeight: 1.75, marginBottom: 14, fontWeight: 300 }}>
            Serving dental clinics, hospitals, healthcare institutions, laboratories, and medical distributors across India, we provide a comprehensive portfolio of dental consumables, medical supplies, protective equipment, and essential healthcare products that meet rigorous quality and safety standards.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#475569", lineHeight: 1.75, fontWeight: 300 }}>
            Our customer-first approach drives us to understand the evolving needs of healthcare providers and deliver solutions that enhance efficiency, reliability, and patient outcomes. Backed by a strong supplier network and industry expertise, we ensure consistent quality, timely delivery, and responsive support.
          </p>
          <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 2, background: "linear-gradient(90deg, #0D9488, #2DD4BF)" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#0D9488", fontWeight: 500, letterSpacing: "0.06em" }}>Est. 2009, Mumbai</span>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div className="wwa-dot-grid" />
          <div className="wwa-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200"
              alt="Medical professional"
            />
          </div>
          <div className="wwa-overlay-badge">
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#0D9488", lineHeight: 1 }}>ISO</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: "#64748B", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>Certified Supplier</div>
          </div>
          <div className="wwa-corner-line" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          MISSION & VISION
      ══════════════════════════════════════ */}
      <section
        ref={missionVisionRef}
        className="reveal-section"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        <div className="mv-block" style={{ background: "#0D9488" }}>
          <div className="mv-label">Our Mission</div>
          <blockquote className="mv-quote">
            "To deliver dependable and innovative dental and hospital products that improve healthcare outcomes while creating lasting value for our customers through compassion, quality, trust, and service excellence."
          </blockquote>
        </div>

        <div className="mv-block" style={{ background: "#0F766E", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="mv-label">Our Vision</div>
          <blockquote className="mv-quote">
            "To become India's most trusted healthcare supply partner, recognized for innovation, customer-centricity, and compassionate commitment to advancing patient care."
          </blockquote>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CORE VALUES
      ══════════════════════════════════════ */}
      <section
        ref={valuesRef}
        className="reveal-section"
        style={{ background: "#F8FAFC", padding: "80px 24px" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>What Drives Us</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, color: "#0F172A", marginTop: 4 }}>Our Core Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 20 }}>
            {values.map((v, i) => (
              <div
                key={i}
                className="value-card"
                onMouseEnter={() => setHoveredValue(i)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                <div className="value-card-num">0{i + 1}</div>
                <div className="value-icon">{v.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748B", lineHeight: 1.65, fontWeight: 300 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRODUCT SHOWCASE BANNER
      ══════════════════════════════════════ */}
      <section ref={productRef} className="reveal-section product-banner">
        <img
          src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1400&q=85"
          alt="Medical setting"
        />
        <div className="product-banner-overlay" />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%" }}>
            <div className="product-pill">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2DD4BF", display: "inline-block" }} />
              Pan-India Distribution
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#FFFFFF", fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, lineHeight: 1.2, maxWidth: 520, marginBottom: 12 }}>
              Premium Medical Supplies.<br />One Trusted Platform.
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.65)", fontSize: 14, maxWidth: 400, lineHeight: 1.6 }}>
              Fully stocked and ready to ship to hospitals, labs, and clinics pan-India.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          LEADERSHIP TEAM
      ══════════════════════════════════════ */}
      <section
        ref={teamRef}
        className="reveal-section"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="eyebrow" style={{ justifyContent: "center" }}>The People Behind JPL Markwin</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, color: "#0F172A", marginTop: 4 }}>Leadership Team</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {team.map((m, i) => (
            <div key={i} className="team-card">
              <div className="team-avatar">{m.initials}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748B", fontWeight: 400 }}>{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CERTIFICATIONS TICKER
      ══════════════════════════════════════ */}
      <section
        ref={certRef}
        className="reveal-section"
        style={{ background: "#F8FAFC", borderTop: "1px solid #EEF2F7", borderBottom: "1px solid #EEF2F7", padding: "20px 0", overflow: "hidden" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Static label */}
          <div style={{
            padding: "0 28px",
            borderRight: "1px solid #E2E8F0",
            flexShrink: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#94A3B8",
            fontWeight: 500,
          }}>
            Certified &amp; Compliant
          </div>
          {/* Ticker */}
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div className="cert-ticker-track">
              {[...["ISO 13485:2016", "CE Mark", "FDA Registered", "CDSCO Approved", "GST Registered"], ...["ISO 13485:2016", "CE Mark", "FDA Registered", "CDSCO Approved", "GST Registered"]].map((cert, i) => (
                <div key={i} className="cert-item">
                  <div className="cert-dot" />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#334155", fontWeight: 500 }}>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}