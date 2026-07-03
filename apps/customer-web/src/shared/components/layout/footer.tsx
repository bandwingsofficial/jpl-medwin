"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock3, ArrowUpRight, CheckCircle2 } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook", bg: "#1877F2" },
  { icon: FaInstagram, href: "#", label: "Instagram", gradient: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" },
  { icon: FaXTwitter, href: "#", label: "X", bg: "#000000" },
  { icon: FaYoutube, href: "#", label: "YouTube", bg: "#FF0000" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn", bg: "#0A66C2" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Careers", href: "/careers" },
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

const businessServices = [
  "Business Services",
  "Institutional Supply",
  "GST & Tax Invoice Available",
  "Bulk Order Support",
  "Original Brand Products",
  "Best Deals & Competitive Pricing",
];

export function Footer() {
  return (
    <footer style={{
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg, #0F766E 0%, #0B4F4A 45%, #052E2B 100%)",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

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
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent);
          transform: translateX(-120%);
          transition: transform 0.6s ease;
        }
        .ft-social:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.35); }
        .ft-social:hover::after { transform: translateX(120%); }

        .ft-link {
          display: inline-flex;
          align-items: center;
          gap: 0;
          color: rgba(255,255,255,0.75);
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
          background: #5EEAD4;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ft-link:hover { color: #FFFFFF; gap: 4px; }
        .ft-link:hover::after { width: 100%; }
        .ft-link-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.25s ease, transform 0.25s ease;
          color: #5EEAD4;
          flex-shrink: 0;
        }
        .ft-link:hover .ft-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .ft-heading {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #FFFFFF;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ft-heading::before {
          content: '';
          display: inline-block;
          width: 16px;
          height: 2px;
          background: #5EEAD4;
          flex-shrink: 0;
        }

        .ft-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: rgba(255,255,255,0.75);
          font-size: 13px;
          line-height: 1.6;
          font-weight: 400;
          transition: color 0.25s ease;
        }
        .ft-contact-item:hover { color: #FFFFFF; }
        .ft-contact-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #5EEAD4;
          transition: background 0.25s ease, transform 0.25s ease;
          margin-top: 2px;
        }
        .ft-contact-item:hover .ft-contact-icon { 
          background: rgba(255, 255, 255, 0.16); 
          transform: scale(1.05);
        }

        .ft-service-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.75);
          font-size: 13.5px;
          font-weight: 400;
          transition: transform 0.25s ease, color 0.25s ease;
        }
        .ft-service-item:hover {
          color: #FFFFFF;
          transform: translateX(4px);
        }
        .ft-service-icon {
          color: #5EEAD4;
          flex-shrink: 0;
        }

        .ft-rule {
          height: 1px;
          background: rgba(255,255,255,0.1);
        }

        .ft-bottom {
          background: #052E2B;
          padding: 18px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
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
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          color: #A7F3D0;
          font-weight: 500;
        }

        .ft-social-row {
          padding: 24px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
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

        .ft-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          padding: 40px 40px 52px;
          max-width: 1340px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .ft-grid {
            grid-template-columns: 1.4fr 0.8fr 0.9fr 1.3fr;
            gap: 32px;
          }
        }

        .ft-logo-link {
          display: block;
          line-height: 0;
          margin: -18px 0 -14px -14px;
          width: fit-content;
        }
      `}} />

      {/* Hexagon pattern overlay, matches the reference footer's subtle geometric texture */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", top: 0, right: 0, width: "55%", height: "100%", opacity: 0.06, pointerEvents: "none" }}
        viewBox="0 0 600 600"
        preserveAspectRatio="xMaxYMid slice"
      >
        <defs>
          <pattern id="ft-hex" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.1)">
            <polygon
              points="28,0 56,16 56,48 28,64 0,48 0,16"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.4"
            />
            <polygon
              points="28,32.5 56,48.5 56,80.5 28,96.5 0,80.5 0,48.5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.4"
            />
          </pattern>
        </defs>
        <rect width="600" height="600" fill="url(#ft-hex)" />
      </svg>

      <div style={{ position: "absolute", top: -100, right: -100, width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,234,212,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="ft-social-row" style={{ position: "relative", zIndex: 2 }}>
        <div>
          <p style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 500 }}>Stay connected with us</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {socialLinks.map(({ icon: Icon, href, label, bg, gradient }, i) => (
            <a key={i} href={href} aria-label={label} className="ft-social" style={{ background: gradient || bg }}>
              <Icon style={{ width: 15, height: 15 }} />
            </a>
          ))}
        </div>
      </div>

      <div className="ft-grid" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Link href="/" className="ft-logo-link">
            <Image src="/Logo/JPL Medwin2.png" alt="JPL Medwin" width={190} height={85} priority style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }} />
          </Link>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
            <div className="ft-contact-item">
              <div className="ft-contact-icon"><MapPin size={14} /></div>
              <p style={{ color: "inherit" }}>JPL Markwin Private Limited,<br />Bengaluru, India – 110074</p>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon"><Phone size={14} /></div>
              <a href="tel:+917289999456" style={{ textDecoration: "none", color: "inherit" }}><p>+91-72899 99456</p></a>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon"><Mail size={14} /></div>
              <a href="mailto:connect@jplmedwin.com" style={{ textDecoration: "none", color: "inherit" }}><p>connect@jplmedwin.com</p></a>
            </div>
          </div>
        </div>

        <div>
          <div className="ft-heading">Company</div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 14, listStyle: "none", padding: 0, margin: 0 }}>
            {companyLinks.map((item, i) => (
              <li key={i}><Link href={item.href} className="ft-link"><ArrowUpRight size={13} className="ft-link-arrow" />{item.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="ft-heading">Policies</div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 14, listStyle: "none", padding: 0, margin: 0 }}>
            {policyLinks.map((item, i) => (
              <li key={i}><Link href={item.href} className="ft-link"><ArrowUpRight size={13} className="ft-link-arrow" />{item.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="ft-heading">JPL Business Services</div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 16, listStyle: "none", padding: 0, margin: 0 }}>
            {businessServices.map((service, i) => (
              <li key={i} className="ft-service-item"><CheckCircle2 size={16} className="ft-service-icon" /><span>{service}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ padding: "0 40px", position: "relative", zIndex: 2 }}><div className="ft-rule" /></div>

      <div className="ft-bottom" style={{ position: "relative", zIndex: 2 }}>
        <p style={{ fontSize: 12.5, color: "#A7F3D0", fontWeight: 400, margin: 0 }}>© 2026 JPL MEDWIN · Powered by JPL Markwin Private Limited</p>
        <div className="ft-india-badge"><span>🇮🇳</span> Crafted with ❤️ in India</div>
      </div>
    </footer>
  );
}