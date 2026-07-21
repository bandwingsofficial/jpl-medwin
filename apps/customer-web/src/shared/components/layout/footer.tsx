"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, ArrowUpRight, CheckCircle2 } from "lucide-react";
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
  { label: "Bulk Enquiry", href: "/bulk-contact" },
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
  "Trusted Supplier of Dental & Hospital Products",
  "Original & High-Quality Healthcare Products",
  "PAN India Supply Network",
  "Reliable Product Sourcing",
  "Customer-Centric Support",
  "Bulk & Institutional Supply",
];

export function Footer() {
  return (
    <footer style={{
      position: "relative",
      overflow: "hidden",
      backgroundColor: "#0D9488", 
      borderTop: "1px solid #0B7D73",
      fontFamily: "'DM Sans', sans-serif",
      color: "#FFFFFF"
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .ft-social { width: 36px; height: 36px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #FFFFFF; text-decoration: none; position: relative; overflow: hidden; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease; flex-shrink: 0; }
        .ft-social::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent); transform: translateX(-120%); transition: transform 0.6s ease; }
        .ft-social:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
        .ft-social:hover::after { transform: translateX(120%); }

        .ft-link { display: inline-flex; align-items: center; gap: 0; color: #FFFFFF; font-size: 15px; font-weight: 400; text-decoration: none; transition: color 0.25s ease, gap 0.25s ease; position: relative; padding-bottom: 2px; }
        .ft-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: #FFFFFF; transition: width 0.3s cubic-bezier(0.16,1,0.3,1); }
        .ft-link:hover { color: #E5E7EB; gap: 4px; }
        .ft-link:hover::after { width: 100%; }
        .ft-link-arrow { opacity: 0; transform: translateX(-4px); transition: opacity 0.25s ease, transform 0.25s ease; color: #FFFFFF; flex-shrink: 0; }
        .ft-link:hover .ft-link-arrow { opacity: 1; transform: translateX(0); }

        .ft-heading { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #FFFFFF; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
        .ft-heading::before { content: ''; display: inline-block; width: 16px; height: 2px; background: #FFFFFF; flex-shrink: 0; }

        .ft-contact-item { display: flex; align-items: flex-start; gap: 10px; color: #FFFFFF; font-size: 15px; line-height: 1.6; font-weight: 400; transition: color 0.25s ease; }
        .ft-contact-icon { width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #FFFFFF; transition: background 0.25s ease, transform 0.25s ease; margin-top: 2px; }

        .ft-service-item { display: flex; align-items: center; gap: 8px; color: #FFFFFF; font-size: 15px; font-weight: 400; transition: transform 0.25s ease; }
        .ft-service-item:hover { transform: translateX(4px); }
        .ft-service-icon { color: #FFFFFF; flex-shrink: 0; }

        .ft-rule { height: 1px; background: rgba(255,255,255,0.2); }
        .ft-bottom { background: #fea736; padding: 18px 40px; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; color: #FFFFFF; }
        @media (min-width: 640px) { .ft-bottom { flex-direction: row; justify-content: space-between; text-align: left; } }
        
        .ft-india-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 14px; color: #FFFFFF; font-weight: 500; }
        .ft-social-row { padding: 0 40px; border-bottom: 1px solid rgba(255,255,255,0.2); display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
        @media (min-width: 640px) { .ft-social-row { flex-direction: row; justify-content: space-between; text-align: left; height: 80px; } }

        .ft-grid { display: grid; grid-template-columns: 1fr; gap: 30px; padding: 30px 40px 48px; max-width: 1340px; margin: 0 auto; }
        @media (min-width: 768px) { .ft-grid { grid-template-columns: 1.4fr 0.8fr 0.9fr 1.3fr; gap: 24px; } }
        
        .ft-tag-container { display: flex; gap: 10px; margin-top: 15px; }
        .ft-tag { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; color: #FFFFFF; }
      `}} />

      <div className="ft-social-row" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <Image src="/Logo/Jpl_Logo.png" alt="JPL Medwin" width={180} height={80} priority style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <p style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 500, margin: 0 }}>Stay connected with us</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {socialLinks.map(({ icon: Icon, href, label, bg, gradient }, i) => (
              <a key={i} href={href} aria-label={label} className="ft-social" style={{ background: gradient || bg }}>
                <Icon style={{ width: 15, height: 15 }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="ft-grid" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="ft-heading" style={{ marginBottom: 10 }}>Contact Address</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="ft-contact-item">
              <div className="ft-contact-icon"><MapPin size={14} /></div>
              <p style={{ color: "#FFFFFF", margin: 0 }}>JPL Markwin Private Limited,<br />117/115A, Kamal Tower 2nd Cross, Vidhyanagar, opp. SKF Co, Bommasandra Industrial Area, Bangalore, Karnataka 560099</p>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon"><Phone size={14} /></div>
             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <a href="tel:+919187969350" style={{ textDecoration: "none", color: "inherit" }}>+91 91879 69350</a>
                <span>/</span>
                <a href="tel:+919187405646" style={{ textDecoration: "none", color: "inherit" }}>+91 91874 05646</a>
              </div>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon"><Mail size={14} /></div>
              <a href="mailto:connect@jplmedwin.com" style={{ textDecoration: "none", color: "inherit" }}><p style={{ margin: 0 }}>connect@jplmedwin.com</p></a>
            </div>
            <div className="ft-tag-container">
              <span className="ft-tag">Compassion</span>
              <span className="ft-tag">Innovation</span>
              <span className="ft-tag">Trust</span>
            </div>
          </div>
        </div>

        <div>
          <div className="ft-heading">Company</div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
            {companyLinks.map((item, i) => (
              <li key={i}><Link href={item.href} className="ft-link"><ArrowUpRight size={13} className="ft-link-arrow" />{item.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="ft-heading">Policies</div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
            {policyLinks.map((item, i) => (
              <li key={i}><Link href={item.href} className="ft-link"><ArrowUpRight size={13} className="ft-link-arrow" />{item.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="ft-heading">JPL Business Services</div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 14, listStyle: "none", padding: 0, margin: 0 }}>
            {businessServices.map((service, i) => (
              <li key={i} className="ft-service-item"><CheckCircle2 size={16} className="ft-service-icon" /><span>{service}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ padding: "0 40px", position: "relative", zIndex: 2 }}><div className="ft-rule" /></div>

      <div className="ft-bottom" style={{ position: "relative", zIndex: 2 }}>
        <p style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 400, margin: 0 }}>
          © 2026 JPL MEDWIN · Powered by JPL Markwin Private Limited
        </p>
        <div className="ft-india-badge"><span>🇮🇳</span> Crafted with ❤️ in India</div>
      </div>
    </footer>
  );
}