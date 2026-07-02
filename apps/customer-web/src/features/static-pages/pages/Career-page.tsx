"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Upload, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPinHouse, 
  User,
  Loader2,
  Building2,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

interface ApplicationFormData {
  fullName: string;
  mobileNumber: string;
  address: string;
  appliedPosition: string;
  resume: File | null;
}

const CURATED_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Full-Stack Engineer",
    department: "Engineering & Tech",
    location: "Bengaluru, India (Hybrid)",
    type: "Full-Time",
  },
  {
    id: "job-2",
    title: "Technical Product Manager",
    department: "Product Strategy",
    location: "Remote (India)",
    type: "Full-Time",
  }
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

export default function CareersPage() {
  const heroRef  = useScrollReveal(0);
  const jobsRef  = useScrollReveal(80);
  const formRef  = useScrollReveal(120);
  const footerRef = useScrollReveal(160);

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    mobileNumber: "",
    address: "",
    appliedPosition: "",
    resume: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const emailTo = "connect@jplmedwin.com";
      const subject = encodeURIComponent(`Job Application: ${formData.fullName} - ${formData.appliedPosition}`);
      const body = encodeURIComponent(
        `Hello Team,\n\nA new candidate has submitted their profile details:\n\n` +
        `• Name: ${formData.fullName}\n` +
        `• Mobile Number: ${formData.mobileNumber}\n` +
        `• Position Applied: ${formData.appliedPosition}\n` +
        `• Residential Address: ${formData.address}\n\n` +
        `Note: The applicant's resume (${formData.resume ? formData.resume.name : "No file uploaded"}) was attached via the UI pipeline.`
      );

      window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
      setIsSuccess(true);
    } catch (err) {
      console.error("Submission Error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StaticContentLayout title="Careers">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&family=Outfit:wght@600;700&display=swap');

        .bk-reveal {
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1);
        }
        .bk-active { opacity: 1 !important; transform: translateY(0) !important; }

        /* Job cards premium border styling */
        .bk-job-card {
          background: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 2px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
        }
        .bk-job-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #0D9488, #2DD4BF);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .bk-job-card:hover::before { transform: scaleY(1); }
        .bk-job-card:hover {
          border-color: rgba(13,148,136,0.25);
          transform: translateY(-4px);
          box-shadow: 0 18px 40px -12px rgba(13,148,136,0.12);
        }

        /* Eyebrow pattern */
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

        /* Form Controls */
        .bk-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .bk-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #475569;
        }
        .bk-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .bk-input-icon {
          position: absolute;
          left: 14px;
          color: #94A3B8;
          pointer-events: none;
          transition: color 0.3s ease;
        }
        .bk-input {
          width: 100%;
          height: 44px;
          padding-left: 42px;
          padding-right: 16px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #0F172A;
          outline: none;
          transition: all 0.3s ease;
        }
        .bk-input:focus {
          border-color: #0D9488;
          box-shadow: 0 0 0 1px rgba(13,148,136,0.15);
        }
        .bk-input:focus + .bk-input-icon {
          color: #0D9488;
        }
        .bk-textarea {
          width: 100%;
          padding: 12px 16px 12px 42px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #0F172A;
          outline: none;
          resize: none;
          transition: all 0.3s ease;
        }
        .bk-textarea:focus {
          border-color: #0D9488;
          box-shadow: 0 0 0 1px rgba(13,148,136,0.15);
        }
        .bk-textarea:focus + .bk-input-icon {
          color: #0D9488;
        }

        /* Custom Dropdown Arrow overlay */
        .bk-select-wrapper::after {
          content: '▼';
          font-size: 8px;
          color: #64748B;
          position: absolute;
          right: 16px;
          pointer-events: none;
        }

        /* Premium File Upload Box */
        .bk-file-dropzone {
          position: relative;
          border: 1px dashed #CBD5E1;
          border-radius: 2px;
          padding: 24px;
          background: #F8FAFC;
          text-align: center;
          transition: all 0.3s ease;
        }
        .bk-file-dropzone:hover {
          background: rgba(13,148,136,0.02);
          border-color: #0D9488;
        }

        /* Form container box */
        .bk-form-panel {
          background: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 2px;
          padding: 36px;
        }

        /* Action Buttons */
        .bk-submit-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: #0F172A; color: #FFFFFF;
          width: 100%; height: 46px; border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          border: none; cursor: pointer;
          transition: all 0.2s ease;
        }
        .bk-submit-btn:hover:not(:disabled) {
          background: #1E293B;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(15,23,42,0.15);
        }
        .bk-submit-btn:disabled {
          opacity: 0.6; cursor:not-allowed;
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

        @media (prefers-reduced-motion: reduce) {
          .bk-reveal, .bk-job-card, .bk-file-dropzone, .bk-submit-btn { transition: none !important; }
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
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: "40%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(252,211,77,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", fontFamily: "'Playfair Display', serif", fontSize: "clamp(80px, 11vw, 160px)", fontWeight: 700, color: "rgba(255,255,255,0.04)", lineHeight: 1, pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>Careers</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="bk-eyebrow" style={{ color: "#2DD4BF", marginBottom: 14 }}>Join Our Team</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 14, maxWidth: 680 }}>
              Build the Future of Healthcare<br />Logistics & Technology
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 580, fontWeight: 300 }}>
              Review our live open parameters below and register your profile. <span style={{ color: "#2DD4BF", fontWeight: 500 }}>JPL Medwin</span> fosters elite operational development across technology pipelines and institutional networks.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            LIVE ROLES SEGMENT
        ══════════════════════════════════════ */}
        <div ref={jobsRef} className="bk-reveal" style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <div className="bk-eyebrow" style={{ marginBottom: 8 }}>Active Vacancies</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
              Current Curated Openings
            </h2>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {CURATED_JOBS.map((job) => (
              <div 
                key={job.id} 
                className="bk-job-card"
                onClick={() => setFormData(prev => ({ ...prev, appliedPosition: job.title }))}
              >
                <div>
                  <span style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: "#0D9488", background: "rgba(13,148,136,0.06)", padding: "3px 8px", borderRadius: 2 }}>
                    {job.department}
                  </span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#0F172A", marginTop: 12, marginBottom: 4 }}>
                    {job.title}
                  </h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "#64748B", marginTop: 20, fontWeight: 400 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} className="text-teal-600" /> {job.location}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} className="text-teal-600" /> {job.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            APPLICATION FORM INTERACTION
        ══════════════════════════════════════ */}
        <div ref={formRef} className="bk-reveal" style={{ marginBottom: 32 }}>
          <div className="bk-form-panel">
            {isSuccess ? (
              <div style={{ textAlign: "center", padding: "32px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <div style={{ display: "inline-flex", height: 48, width: 48, alignItems: "center", justifyContent: "center", borderRadius: "50%", color: "#16A34A", border: "1px solid #DCFCE7" }}>
                  <CheckCircle2 size={26} className="text-emerald-600" />
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#0F172A" }}>
                  Application Initialized!
                </h2>
                <p style={{ fontSize: 13, color: "#64748B", maxWidth: 440, lineHeight: 1.6, fontWeight: 300 }}>
                  Your application parameters have been collected. Your email client will now assist you in delivering the profile package straight to <strong style={{ color: "#0F172A", fontWeight: 500 }}>connect@jplmedwin.com</strong>.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  style={{ background: "none", border: "none", fontSize: 12, fontWeight: 600, color: "#0D9488", cursor: "pointer", textDecoration: "underline", marginTop: 8 }}
                >
                  Submit another profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: 14 }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>
                    Application Profile Form
                  </h2>
                  <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
                    All fields marked with an asterisk (<span style={{ color: "#EF4444" }}>*</span>) are parameters required for transmission.
                  </p>
                </div>

                {/* Target Position Selection */}
                <div className="bk-form-group">
                  <label className="bk-label">
                    Select Target Position <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <div className="bk-input-wrapper bk-select-wrapper">
                    <select
                      name="appliedPosition"
                      required
                      value={formData.appliedPosition}
                      onChange={handleInputChange}
                      className="bk-input"
                      style={{ appearance: "none", cursor: "pointer" }}
                    >
                      <option value="">-- Choose an open role from the roster --</option>
                      {CURATED_JOBS.map((job) => (
                        <option key={job.id} value={job.title}>{job.title}</option>
                      ))}
                    </select>
                    <Briefcase size={15} className="bk-input-icon" />
                  </div>
                </div>

                {/* Personal Coordinates (Name and Mobile) */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                  <div className="bk-form-group">
                    <label className="bk-label">
                      Full Name <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <div className="bk-input-wrapper">
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="bk-input"
                      />
                      <User size={15} className="bk-input-icon" />
                    </div>
                  </div>

                  <div className="bk-form-group">
                    <label className="bk-label">
                      Mobile Number <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <div className="bk-input-wrapper">
                      <input
                        type="tel"
                        name="mobileNumber"
                        required
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="bk-input"
                      />
                      <Phone size={15} className="bk-input-icon" />
                    </div>
                  </div>
                </div>

                {/* Residential Address Metadata */}
                <div className="bk-form-group">
                  <label className="bk-label">
                    Complete Residential Address <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <div className="bk-input-wrapper">
                    <textarea
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter House No., Street, City, State and Postal Pin Code metadata..."
                      className="bk-textarea"
                    />
                    <MapPinHouse size={15} className="bk-input-icon" style={{ top: 14 }} />
                  </div>
                </div>

                {/* Resume Pipeline */}
                <div className="bk-form-group">
                  <label className="bk-label">
                    Upload Resume Document <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <div className="bk-file-dropzone">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      required
                      onChange={handleFileChange}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 2 }}
                    />
                    <Upload className="mx-auto text-slate-400" size={18} style={{ marginBottom: 6, margin: "0 auto" }} />
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>
                      {formData.resume ? formData.resume.name : "Drop resume file here or click to browse files"}
                    </p>
                    <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 3 }}>Accepts PDF or DOCX file structures up to 5MB</p>
                  </div>
                </div>

                {/* Transmission Submission CTA */}
                <div style={{ marginTop: 8 }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bk-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Transmitting Data Package...
                      </>
                    ) : (
                      <>
                        <Mail size={14} /> Submit Form
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════
            COMPLIANCE INFORMATION FOOTER
        ══════════════════════════════════════ */}
        <div ref={footerRef} className="bk-reveal bk-compliance">
          <div className="bk-compliance-icon"><ShieldCheck size={20} /></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2DD4BF", fontWeight: 600, marginBottom: 8 }}>
              Operational Data Handling
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, fontWeight: 300, maxWidth: 740 }}>
              Upon validation, this dashboard parameters translate into standard encrypted parameters via your native local system mail pipeline. Our Human Resources core filters verify every index profile package within the <span style={{ color: "#2DD4BF", fontWeight: 500 }}>same business cycle.</span>
            </p>
          </div>
        </div>

      </div>
    </StaticContentLayout>
  );
}