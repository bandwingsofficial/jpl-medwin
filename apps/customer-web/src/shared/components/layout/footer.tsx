"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock3, ArrowUpRight } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook", bg: "#1877F2" },
  { icon: FaInstagram, href: "#", label: "Instagram", gradient: "linear-gradient(135deg, #FFB13D, #E23469, #9934B8)" },
  { icon: FaXTwitter, href: "#", label: "X", bg: "#000000" },
  { icon: FaYoutube, href: "#", label: "YouTube", bg: "#FF0000" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn", bg: "#0A66C2" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Bulk Contact", href: "/bulk-contact" },
  { label: "Payments", href: "/payments" },
];

const policyLinks = [
  { label: "Return Policy", href: "/return-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export function Footer() {
  return (
    <footer style={{
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(160deg, #042F2E 0%, #063832 50%, #052E2E 100%)",
      borderTop: "1px solid rgba(45,212,191,0.12)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── Social icons ── */
        .ft-social {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease;
          flex-shrink: 0;
        }
        .ft-social::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent);
          transform: translateX(-120%);
          transition: transform 0.6s ease;
        }
        .ft-social:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.35); }
        .ft-social:hover::after { transform: translateX(120%); }

        /* ── Nav links ── */
        .ft-link {
          display: inline-flex;
          align-items: center;
          gap: 0;
          color: rgba(204,230,227,0.75);
          font-size: 13px;
          font-weight: 400;
          text-decoration: none;
          transition: color 0.25s ease, gap 0.25s ease;
          position: relative;
          padding-bottom: 2px;
        }
        .ft-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: #2DD4BF;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ft-link:hover { color: #FFFFFF; gap: 4px; }
        .ft-link:hover::after { width: 100%; }
        .ft-link-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.25s ease, transform 0.25s ease;
          color: #2DD4BF;
          flex-shrink: 0;
        }
        .ft-link:hover .ft-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── Section heading ── */
        .ft-heading {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ft-heading::before {
          content: '';
          display: inline-block;
          width: 16px;
          height: 1.5px;
          background: #0D9488;
          flex-shrink: 0;
        }

        /* ── Contact items ── */
        .ft-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: rgba(204,230,227,0.75);
          font-size: 13px;
          line-height: 1.65;
          font-weight: 300;
          transition: color 0.25s ease;
        }
        .ft-contact-item:hover { color: #FFFFFF; }
        .ft-contact-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(13,148,136,0.15);
          border: 1px solid rgba(13,148,136,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #2DD4BF;
          transition: background 0.25s ease;
          margin-top: 1px;
        }
        .ft-contact-item:hover .ft-contact-icon { background: rgba(13,148,136,0.3); }

        /* ── Divider ── */
        .ft-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.15) 30%, rgba(45,212,191,0.15) 70%, transparent 100%);
        }

        /* ── Copyright bar ── */
        .ft-bottom {
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(4px);
          padding: 16px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }
        @media (min-width: 640px) {
          .ft-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
        .ft-india-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        /* ── Social row ── */
        .ft-social-row {
          padding: 20px 40px;
          border-bottom: 1px solid rgba(45,212,191,0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          text-align: center;
        }
        @media (min-width: 640px) {
          .ft-social-row {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }

        /* ── Grid ── */
        .ft-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          padding: 48px 40px 44px;
          max-width: 1140px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .ft-grid {
            grid-template-columns: 1.3fr 0.8fr 1fr 1.2fr;
            gap: 32px;
          }
        }

        @media (max-width: 640px) {
          .ft-social-row { padding: 18px 20px; }
          .ft-grid { padding: 36px 20px 32px; gap: 32px; }
          .ft-bottom { padding: 14px 20px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ft-social, .ft-link, .ft-contact-item { transition: none !important; }
        }
      `}} />

      {/* ── Ambient background glow ── */}
      <div style={{
        position: "absolute", top: -100, right: -100,
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: "20%",
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,212,191,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Faint diagonal line texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(120deg, transparent, transparent 60px, rgba(255,255,255,0.013) 60px, rgba(255,255,255,0.013) 61px)",
        pointerEvents: "none",
      }} />

      {/* ══════════════════════
          SOCIAL ROW
      ══════════════════════ */}
      <div className="ft-social-row" style={{ position: "relative", zIndex: 2 }}>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
            Stay connected with us
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {socialLinks.map(({ icon: Icon, href, label, bg, gradient }, i) => (
            <a
              key={i}
              href={href}
              aria-label={label}
              className="ft-social"
              style={{ background: gradient || bg }}
            >
              <Icon style={{ width: 14, height: 14 }} />
            </a>
          ))}
        </div>
      </div>

      {/* ══════════════════════
          MAIN GRID
      ══════════════════════ */}
      <div className="ft-grid" style={{ position: "relative", zIndex: 2 }}>

        {/* Col 1 — Brand */}
        <div>
          <Link href="/" style={{
            display: "inline-block",
            padding: "8px 12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            marginBottom: 20,
          }}>
            <Image
              src="/Logo/JPL Medwin1.png"
              alt="JPL Medwin"
              width={160}
              height={80}
              priority
              style={{ height: "auto", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }}
            />
          </Link>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "rgba(204,230,227,0.65)",
            lineHeight: 1.75,
            fontWeight: 300,
            maxWidth: 260,
          }}>
            Delivering trusted healthcare and wellness products with quality, care, and customer satisfaction across India.
          </p>
          {/* Cert badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
            {["ISO 13485", "CE Mark", "CDSCO"].map((cert, i) => (
              <span key={i} style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#2DD4BF",
                background: "rgba(13,148,136,0.12)",
                border: "1px solid rgba(13,148,136,0.2)",
                padding: "3px 8px",
                borderRadius: 3,
              }}>{cert}</span>
            ))}
          </div>
        </div>

        {/* Col 2 — Company */}
        <div>
          <div className="ft-heading">Company</div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
            {companyLinks.map((item, i) => (
              <li key={i}>
                <Link href={item.href} className="ft-link">
                  <ArrowUpRight size={13} className="ft-link-arrow" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Policies */}
        <div>
          <div className="ft-heading">Policies</div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
            {policyLinks.map((item, i) => (
              <li key={i}>
                <Link href={item.href} className="ft-link">
                  <ArrowUpRight size={13} className="ft-link-arrow" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Address */}
        <div>
          <div className="ft-heading">Registered Office</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="ft-contact-item">
              <div className="ft-contact-icon"><MapPin size={13} /></div>
              <p>JPL Markwin Private Limited,<br />Bengaluru,<br />India – 110074</p>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon"><Phone size={13} /></div>
              <p>+91-728-9999-456</p>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon"><Mail size={13} /></div>
              <p>support@jplmedwin.com</p>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon"><Clock3 size={13} /></div>
              <p>Mon – Sun, 9:00 AM – 9:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ padding: "0 40px", position: "relative", zIndex: 2 }}>
        <div className="ft-rule" />
      </div>

      {/* ══════════════════════
          COPYRIGHT BAR
      ══════════════════════ */}
      <div className="ft-bottom" style={{ position: "relative", zIndex: 2 }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: "rgba(255,255,255,0.3)",
          fontWeight: 400,
          letterSpacing: "0.02em",
        }}>
          © 2026 JPL MEDWIN · Powered by JPL Markwin Private Limited
        </p>
        <div className="ft-india-badge">
          <span style={{ fontSize: 14 }}>🇮🇳</span>
          Crafted with ❤️ in India
        </div>
      </div>
    </footer>
  );
}