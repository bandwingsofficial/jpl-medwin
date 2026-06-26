"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Stethoscope,
  Truck,
} from "lucide-react";

function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("ct-reveal-active");
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

export function ContactUsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const cardsRef = useScrollReveal(0);
  const addressRef = useScrollReveal(100);
  const ctaRef = useScrollReveal(150);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#0F172A", background: "#FFFFFF", width: "100%", overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        /* Scroll reveal */
        .ct-reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1);
        }
        .ct-reveal-active { opacity: 1 !important; transform: translateY(0) !important; }

        /* Hero fade-up */
        .ct-fade-up {
          opacity: 0;
          transform: translateY(20px);
          animation: ctFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes ctFadeUp { to { opacity: 1; transform: translateY(0); } }

        /* Contact method cards */
        .ct-method-card {
          background: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 2px;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .ct-method-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #0D9488, #2DD4BF);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .ct-method-card:hover::before { transform: scaleY(1); }
        .ct-method-card:hover {
          border-color: rgba(13,148,136,0.25);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px -12px rgba(13,148,136,0.15);
        }
        .ct-ghost-icon {
          position: absolute;
          right: -8px;
          bottom: -12px;
          color: rgba(13,148,136,0.05);
          pointer-events: none;
          transition: color 0.4s ease;
        }
        .ct-method-card:hover .ct-ghost-icon { color: rgba(13,148,136,0.09); }
        .ct-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: 10px;
          background: rgba(13,148,136,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0D9488;
          margin-bottom: 18px;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .ct-method-card:hover .ct-icon-wrap {
          background: #0D9488;
          color: #FFFFFF;
          transform: rotate(-6deg) scale(1.08);
        }

        /* Address block */
        .ct-address-block {
          border: 1px solid #EEF2F7;
          border-radius: 2px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 900px) {
          .ct-address-block { grid-template-columns: 1fr 1fr; }
        }
        .ct-address-left {
          padding: 52px 48px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
        .ct-address-left::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 48px;
          right: 48px;
          height: 1px;
          background: #EEF2F7;
        }
        @media (min-width: 900px) {
          .ct-address-left::after {
            top: 0;
            bottom: 0;
            left: auto;
            right: 0;
            width: 1px;
            height: auto;
            background: #EEF2F7;
          }
        }
        .ct-address-map {
          position: relative;
          min-height: 300px;
          overflow: hidden;
        }
        .ct-address-map img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 6s ease;
        }
        .ct-address-map:hover img { transform: scale(1.04); }
        .ct-map-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(4,47,46,0.55) 0%, transparent 70%);
        }
        .ct-map-pin {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .ct-pin-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #FCD34D;
          box-shadow: 0 0 0 4px rgba(252,211,77,0.3);
          animation: ctPulse 2s ease infinite;
        }
        @keyframes ctPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(252,211,77,0.3); }
          50% { box-shadow: 0 0 0 10px rgba(252,211,77,0); }
        }
        .ct-pin-label {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          padding: 6px 12px;
          border-radius: 2px;
          font-size: 11px;
          font-weight: 600;
          color: #0F172A;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          letter-spacing: 0.04em;
        }
        .ct-badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid #EEF2F7;
        }
        .ct-badge-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: #475569;
          font-weight: 400;
        }

        /* CTA bar */
        .ct-cta {
          position: relative;
          background: #042F2E;
          border-radius: 2px;
          padding: 40px 48px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        @media (min-width: 640px) {
          .ct-cta {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .ct-cta::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(13,148,136,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .ct-cta::after {
          content: '';
          position: absolute;
          bottom: -40px;
          left: 120px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .ct-call-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FCD34D;
          color: #0F172A;
          padding: 13px 24px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: z-index 0.2s ease;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .ct-call-btn:hover {
          background: #E2B632;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(252,211,77,0.35);
        }
        .ct-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2DD4BF;
          display: inline-block;
          animation: ctPulse 2s ease infinite;
          flex-shrink: 0;
        }

        /* Eyebrow */
        .ct-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .ct-eyebrow::before {
          content: '';
          display: inline-block;
          width: 18px;
          height: 1.5px;
          background: currentColor;
        }

        @media (max-width: 640px) {
          .ct-address-left { padding: 32px 24px; }
          .ct-cta { padding: 28px 24px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ct-reveal, .ct-method-card, .ct-address-map img { transition: none !important; }
          .ct-pin-dot { animation: none; }
          .ct-pulse-dot { animation: none; }
          .ct-fade-up { animation: none; opacity: 1; transform: none; }
        }
      `}} />

      {/* ══════════════════════════════════════
          HERO (Now configured with outer padding alignment)
      ══════════════════════════════════════ */}
      <section style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "24px 24px 0px 24px", // Top and side paddings line up with the rest of your sections
      }}>
        <div style={{
          position: "relative",
          background: "linear-gradient(120deg, #042F2E 0%, #0D9488 100%)",
          padding: "64px 40px 72px",   // Internal padding inside the hero image block
          borderRadius: "8px",         // Premium rounded card appearance
          overflow: "hidden",
          boxShadow: "0 20px 40px -15px rgba(4,47,46,0.15)"
        }}>
          {/* Ambient geometry */}
          <div style={{
            position: "absolute", top: "-80px", right: "-80px",
            width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-40px", left: "30%",
            width: 220, height: 220, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(252,211,77,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          {/* Large ghost text */}
          <div style={{
            position: "absolute", right: 24, top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(120px, 16vw, 220px)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.035)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}>Contact</div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="ct-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="ct-eyebrow" style={{ color: "#2DD4BF", marginBottom: 16 }}>JPL Markwin Private Limited</div>
            </div>
            <div className="ct-fade-up" style={{ animationDelay: "0.22s" }}>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 5vw, 54px)",
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                marginBottom: 18,
                maxWidth: 640,
              }}>
                Let's Start a<br />
                <span style={{ color: "#FCD34D" }}>Conversation</span>
              </h1>
            </div>
            <div className="ct-fade-up" style={{ animationDelay: "0.34s" }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(255,255,255,0.65)",
                fontSize: 15,
                lineHeight: 1.65,
                maxWidth: 520,
              }}>
                For product inquiries, order support, or service-related questions, the{" "}
                <span style={{ color: "#2DD4BF", fontWeight: 500 }}>JPL Markwin</span> team is here to provide expert assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTACT METHOD CARDS
      ══════════════════════════════════════ */}
      <section
        ref={cardsRef}
        className="ct-reveal"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 0" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {/* Phone */}
          <div
            className="ct-method-card"
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="ct-ghost-icon">
              <Phone size={100} />
            </div>
            <div className="ct-icon-wrap"><Phone size={20} /></div>
            <div className="ct-eyebrow" style={{ color: "#0D9488", marginBottom: 12 }}>Call Us</div>
            <div style={{ fontFamily: "'outfit', serif", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
              <a
  href="tel:+917289999456"
  style={{
    fontFamily: "'Outfit', sans-serif",
    fontSize: 18,
    fontWeight: 600,
    color: "#0F172A",
    marginBottom: 4,
    textDecoration: "none",
    display: "inline-block",
    cursor: "pointer",
    transition: "color 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = "#0D9488";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = "#0F172A";
  }}
>
  +91 728 9999 456
</a>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748B", fontWeight: 300, lineHeight: 1.6 }}>
              Direct line for immediate procurement help and urgent medical supply inquiries.
            </p>
          </div>

          {/* Email */}
          <div
            className="ct-method-card"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="ct-ghost-icon">
              <Mail size={100} />
            </div>
            <div className="ct-icon-wrap"><Mail size={20} /></div>
            <div className="ct-eyebrow" style={{ color: "#0D9488", marginBottom: 12 }}>Email Us</div>
            <a
  href="mailto:connect@jplmedwin.com"
  style={{
    fontFamily: "'Outfit', sans-serif",
    fontSize: 18,
    fontWeight: 600,
    color: "#0F172A",
    marginBottom: 4,
    textDecoration: "none",
    display: "inline-block",
    transition: "color 0.2s ease",
    cursor: "pointer",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = "#0D9488";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = "#0F172A";
  }}
>
  connect@jplmedwin.com
</a>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748B", fontWeight: 300, lineHeight: 1.6 }}>
              For detailed product quotes, catalogue requests, and partnership inquiries.
            </p>
          </div>

          {/* Hours */}
          <div
            className="ct-method-card"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="ct-ghost-icon">
              <Clock size={100} />
            </div>
            <div className="ct-icon-wrap"><Clock size={20} /></div>
            <div className="ct-eyebrow" style={{ color: "#0D9488", marginBottom: 12 }}>Our Hours</div>
            <div style={{ fontFamily: "'outfit', serif", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
              9:00 AM – 6:00 PM
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748B", fontWeight: 300, lineHeight: 1.6 }}>
              Monday through Saturday. Our specialists are available during all business hours.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ADDRESS & MAP
      ══════════════════════════════════════ */}
      <section
        ref={addressRef}
        className="ct-reveal"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 0" }}
      >
        <div className="ct-address-block">
          {/* Left: address content */}
          <div className="ct-address-left">
            <div style={{ marginBottom: 24 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(13,148,136,0.08)",
                border: "1px solid rgba(13,148,136,0.15)",
                color: "#0D9488",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "5px 10px",
                borderRadius: 2,
                marginBottom: 16,
              }}>
                <MapPin size={11} /> Headquarters
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 2.8vw, 30px)", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, marginBottom: 16 }}>
                Visit Our Office
              </h2>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#475569", lineHeight: 1.75, fontWeight: 300 }}>
                <strong style={{ color: "#0F172A", fontWeight: 600, display: "block", marginBottom: 4 }}>JPL Markwin Private Limited</strong>
                Chattarpur, New Delhi,<br />
                India – 110074
              </div>
            </div>

            <div className="ct-badge-row">
              <div className="ct-badge-item">
                <ShieldCheck size={15} color="#0D9488" style={{ flexShrink: 0 }} />
                <span>ISO 13485:2016 Facility</span>
              </div>
              <div className="ct-badge-item">
                <Truck size={15} color="#0D9488" style={{ flexShrink: 0 }} />
                <span>Pan-India Network</span>
              </div>
              <div className="ct-badge-item">
                <Stethoscope size={15} color="#0D9488" style={{ flexShrink: 0 }} />
                <span>Equipment Demo Center</span>
              </div>
            </div>
          </div>

          {/* Right: map image */}
          <div className="ct-address-map">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
              alt="Office location"
            />
            <div className="ct-map-overlay" />
            <div className="ct-map-pin">
              <div className="ct-pin-dot" />
              <div className="ct-pin-label">Chattarpur, New Delhi</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BAR
      ══════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="ct-reveal"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 72px" }}
      >
        <div className="ct-cta">
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div className="ct-pulse-dot" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#2DD4BF", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>
                Available Now
              </span>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2, marginBottom: 8 }}>
              Need immediate assistance?
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 440 }}>
              Our procurement specialists are just a call away for urgent medical supplies and order support.
            </p>
          </div>
          <a href="tel:+917289999456" className="ct-call-btn">
            <Phone size={15} />
            Call Now — +91 72899 99456
          </a>
        </div>
      </section>
    </div>
  );
}