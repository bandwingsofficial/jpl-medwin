"use client";

import { useEffect, useRef } from "react";
import {
  Building2,
  FileText,
  Phone,
  Mail,
  Truck,
  ShieldCheck,
  Handshake,
  Stethoscope,
  ArrowUpRight,
} from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

const facilities = [
  {
    icon: Building2,
    title: "Hospitals & Institutions",
    description:
      "Dedicated procurement support for hospitals, clinics, diagnostic centers, and healthcare chains.",
  },
  {
    icon: FileText,
    title: "Quotation Support",
    description:
      "Custom quotations, GST billing, compliance documentation, and negotiated pricing.",
  },
  {
    icon: Truck,
    title: "Priority Equipment Logistics",
    description:
      "Safe bulk packaging, pallet shipping, heavy equipment dispatch, and scheduled institutional delivery.",
  },
];

const categories = [
  "Dental chairs & compressors",
  "Surgical kits & instrument trays",
  "Diagnostic devices & monitors",
  "Dental consumables & clinical tools",
  "Hospital furniture & OT equipment",
  "X-ray, RVG, imaging devices",
  "Lab and sterilization equipment",
];

function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add("bk-active"); },
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

export function BulkContactPage() {
  const heroRef   = useScrollReveal(0);
  const cardsRef  = useScrollReveal(80);
  const splitRef  = useScrollReveal(120);
  const ctaRef    = useScrollReveal(160);

  return (
    <StaticContentLayout title="Bulk Procurement">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .bk-reveal {
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1);
        }
        .bk-active { opacity: 1 !important; transform: translateY(0) !important; }

        /* Facility cards */
        .bk-fac-card {
          background: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 2px;
          padding: 28px 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .bk-fac-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #0D9488, #2DD4BF);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .bk-fac-card:hover::before { transform: scaleY(1); }
        .bk-fac-card:hover {
          border-color: rgba(13,148,136,0.25);
          transform: translateY(-5px);
          box-shadow: 0 18px 40px -12px rgba(13,148,136,0.15);
        }
        .bk-fac-num {
          position: absolute; right: 16px; top: 10px;
          font-family: 'Playfair Display', serif;
          font-size: 56px; font-weight: 700;
          color: rgba(13,148,136,0.05);
          line-height: 1; pointer-events: none;
          transition: color 0.4s ease;
        }
        .bk-fac-card:hover .bk-fac-num { color: rgba(13,148,136,0.1); }
        .bk-fac-icon {
          width: 42px; height: 42px; border-radius: 9px;
          background: rgba(13,148,136,0.08);
          display: flex; align-items: center; justify-content: center;
          color: #0D9488; margin-bottom: 16px;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .bk-fac-card:hover .bk-fac-icon {
          background: #0D9488; color: #FFFFFF;
          transform: rotate(-6deg) scale(1.08);
        }

        /* Category pills */
        .bk-cat-pill {
          display: flex; align-items: center; gap: 10px;
          background: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 2px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          color: #334155;
          transition: all 0.3s ease;
          cursor: default;
        }
        .bk-cat-pill:hover {
          border-color: rgba(13,148,136,0.3);
          background: rgba(13,148,136,0.03);
          color: #0F172A;
          transform: translateX(3px);
        }
        .bk-cat-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #0D9488; flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .bk-cat-pill:hover .bk-cat-dot { transform: scale(1.5); }

        /* Contact channels */
        .bk-contact-card {
          background: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 2px;
          padding: 24px 28px;
          display: flex; align-items: center; gap: 18px;
          position: relative; overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .bk-contact-card::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(13,148,136,0.04) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.4s ease;
        }
        .bk-contact-card:hover::after { opacity: 1; }
        .bk-contact-card:hover {
          border-color: rgba(13,148,136,0.25);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px -8px rgba(13,148,136,0.12);
        }
        .bk-contact-icon {
          width: 50px; height: 50px; border-radius: 10px;
          background: rgba(13,148,136,0.08);
          border: 1px solid rgba(13,148,136,0.15);
          display: flex; align-items: center; justify-content: center;
          color: #0D9488; flex-shrink: 0;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          position: relative; z-index: 1;
        }
        .bk-contact-card:hover .bk-contact-icon {
          background: #0D9488; color: #FFFFFF;
          border-color: transparent;
        }

        /* Quote button */
        .bk-quote-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #FCD34D; color: #0F172A;
          padding: 11px 22px; border-radius: 4px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer;
          transition: all 0.2s ease; white-space: nowrap; flex-shrink: 0;
        }
        .bk-quote-btn:hover {
          background: #E2B632; transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(252,211,77,0.35);
        }

        /* Eyebrow */
        .bk-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #0D9488;
        }
        .bk-eyebrow::before {
          content: ''; display: inline-block;
          width: 18px; height: 1.5px; background: #0D9488;
        }

        /* Compliance banner */
        .bk-compliance {
          background: #042F2E;
          border-radius: 2px;
          padding: 28px 32px;
          display: flex; align-items: flex-start; gap: 18px;
          position: relative; overflow: hidden;
        }
        .bk-compliance::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 220px; height: 220px; border-radius: 50%;
          background: radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .bk-compliance-icon {
          width: 44px; height: 44px; border-radius: 10px;
          background: rgba(45,212,191,0.12);
          border: 1px solid rgba(45,212,191,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #2DD4BF; flex-shrink: 0;
        }

        /* Image panel */
        .bk-img-panel {
          position: relative; overflow: hidden; border-radius: 2px;
          min-height: 240px;
        }
        .bk-img-panel img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 6s ease;
        }
        .bk-img-panel:hover img { transform: scale(1.04); }
        .bk-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(4,47,46,0.7) 0%, rgba(4,47,46,0.1) 60%, transparent 100%);
        }
        .bk-img-label {
          position: absolute; bottom: 20px; left: 20px;
          display: flex; flex-direction: column; gap: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          .bk-reveal, .bk-fac-card, .bk-cat-pill,
          .bk-contact-card, .bk-img-panel img { transition: none !important; }
          .bk-active { opacity: 1; transform: none; }
        }
      `}} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 72px", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ══════════════════════════════════════
            HERO HEADER
        ══════════════════════════════════════ */}
        <div
          ref={heroRef}
          className="bk-reveal"
          style={{
            background: "linear-gradient(120deg, #042F2E 0%, #0D9488 100%)",
            borderRadius: 2,
            padding: "48px 40px",
            position: "relative",
            overflow: "hidden",
            marginBottom: 32,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Ambient glows */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: "40%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(252,211,77,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
          {/* Ghost text */}
          <div style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", fontFamily: "'Playfair Display', serif", fontSize: "clamp(80px, 12vw, 160px)", fontWeight: 700, color: "rgba(255,255,255,0.04)", lineHeight: 1, pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>Bulk</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="bk-eyebrow" style={{ color: "#2DD4BF", marginBottom: 14 }}>Enterprise Procurement</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 14, maxWidth: 680 }}>
              Bulk Procurement of Medical,<br />Dental & Hospital Instruments
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 580, fontWeight: 300, marginBottom: 28 }}>
              <span style={{ color: "#2DD4BF", fontWeight: 500 }}>JPL Medwin</span> provides enterprise-grade bulk procurement for dental clinics, hospitals, labs, and institutional buyers with equipment-safe logistics and dedicated pricing tiers.
            </p>
            <button className="bk-quote-btn">
              Request a Quote <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════
            FACILITIES GRID
        ══════════════════════════════════════ */}
        <div ref={cardsRef} className="bk-reveal" style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <div className="bk-eyebrow" style={{ marginBottom: 8 }}>What We Offer</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
              Enterprise Bulk Order Facilities
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18 }}>
            {facilities.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bk-fac-card">
                  <div className="bk-fac-num">0{i + 1}</div>
                  <div className="bk-fac-icon"><Icon size={18} /></div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.65, fontWeight: 300 }}>{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════
            CATEGORIES SPLIT
        ══════════════════════════════════════ */}
        <div ref={splitRef} className="bk-reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 0, marginBottom: 32, border: "1px solid #EEF2F7", borderRadius: 2, overflow: "hidden" }}>
          {/* Image panel */}
          <div className="bk-img-panel" style={{ minHeight: 280 }}>
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1400&auto=format&fit=crop"
              alt="Bulk medical equipment"
            />
            <div className="bk-img-overlay" />
            <div className="bk-img-label">
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2DD4BF", fontWeight: 600 }}>Catalogue</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>10,000+<br />Products</span>
            </div>
          </div>

          {/* Categories list */}
          <div style={{ background: "#F8FAFC", padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D9488" }}>
                <Stethoscope size={16} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Bulk Categories We Support</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {categories.map((text, i) => (
                <div key={i} className="bk-cat-pill">
                  <div className="bk-cat-dot" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            CONTACT CHANNELS
        ══════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginBottom: 32 }}>
          <div className="bk-contact-card">
            <div className="bk-contact-icon"><Phone size={20} /></div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 5 }}>Bulk Sales Helpline</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>+91 728 9999 456</p>
            </div>
          </div>
          <div className="bk-contact-card">
            <div className="bk-contact-icon"><Mail size={20} /></div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 5 }}>Enterprise Email</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#0D9488", lineHeight: 1 }}>connect@jplmedwin.com</p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            COMPLIANCE CTA BANNER
        ══════════════════════════════════════ */}
        <div ref={ctaRef} className="bk-reveal bk-compliance">
          <div className="bk-compliance-icon"><ShieldCheck size={20} /></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2DD4BF", fontWeight: 600, marginBottom: 8 }}>
              How to Get Started
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, fontWeight: 300, maxWidth: 700 }}>
              Please share your hospital or clinic instrument requirement list, target quantity, and delivery timeline. Our B2B procurement team usually shares custom price quotations on the <span style={{ color: "#2DD4BF", fontWeight: 500 }}>same business day.</span>
            </p>
          </div>
        </div>

      </div>
    </StaticContentLayout>
  );
}