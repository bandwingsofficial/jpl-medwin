'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaXTwitter } from 'react-icons/fa6';

const socialLinks = [
  { icon: FaFacebookF, href: '#', label: 'Facebook', bg: '#1877F2' },
  {
    icon: FaInstagram,
    href: '#',
    label: 'Instagram',
    gradient:
      'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
  },
  { icon: FaXTwitter, href: '#', label: 'X', bg: '#000000' },
  { icon: FaYoutube, href: '#', label: 'YouTube', bg: '#FF0000' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn', bg: '#0A66C2' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Careers', href: '/careers' },
  { label: 'Bulk Enquiry', href: '/bulk-contact' },
  { label: 'Payments', href: '/payments' },
];

const policyLinks = [
  { label: 'Return Policy', href: '/return-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Disclaimer', href: '/disclaimer' },
];

const businessServices = [
  'Trusted Supplier of Dental & Hospital Products',
  'Original & High-Quality Healthcare Products',
  'PAN India Supply Network',
  'Reliable Product Sourcing',
  'Customer-Centric Support',
  'Bulk & Institutional Supply',
];

export function Footer() {
  return (
   <footer
  style={{
    position: "relative",
    overflow: "hidden",
    background: "#ffffff",
    borderTop: "1px solid #E5E7EB",
    fontFamily: "'DM Sans', sans-serif",
    color: "#111827",
  }}
>
      <style
        dangerouslySetInnerHTML={{
          __html: `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

.ft-social{
width:42px;
height:42px;
border-radius:12px;
display:inline-flex;
align-items:center;
justify-content:center;
text-decoration:none;
position:relative;
overflow:hidden;
transition:all .35s ease;
box-shadow:0 6px 18px rgba(0,0,0,.08);
}

.ft-social::after{
content:'';
position:absolute;
inset:0;
background:linear-gradient(120deg,
transparent,
rgba(255,255,255,.45),
transparent);
transform:translateX(-140%);
transition:.6s;
}

.ft-social:hover{
transform:translateY(-6px);
box-shadow:0 14px 30px rgba(13,148,136,.18);
}

.ft-social:hover::after{
transform:translateX(140%);
}

/* ------------------------- */

.ft-link{
display:inline-flex;
align-items:center;
gap:2px;
font-size:15px;
font-weight:500;
text-decoration:none;
color:#4B5563;
position:relative;
transition:.3s;
}

.ft-link::after{
content:'';
position:absolute;
left:0;
bottom:-4px;
width:0;
height:2px;
background:#0D9488;
transition:.35s;
border-radius:20px;
}

.ft-link:hover{
color:#0D9488;
gap:7px;
}

.ft-link:hover::after{
width:100%;
}

.ft-link-arrow{
opacity:0;
transform:translateX(-5px);
transition:.3s;
color:#0D9488;
}

.ft-link:hover .ft-link-arrow{
opacity:1;
transform:translateX(0);
}

/* ------------------------- */

.ft-heading{
display:flex;
align-items:center;
gap:10px;
font-size:15px;
font-weight:700;
letter-spacing:.08em;
text-transform:uppercase;
margin-bottom:20px;
color:#111827;
}

.ft-heading::before{
content:'';
width:26px;
height:3px;
background:#0D9488;
border-radius:999px;
display:block;
}

/* ------------------------- */

.ft-contact-item{
display:flex;
align-items:flex-start;
gap:14px;
font-size:15px;
line-height:1.7;
color:#4B5563;
transition:.3s;
}

.ft-contact-item:hover{
color:#111827;
}

.ft-contact-icon{
width:40px;
height:40px;
border-radius:12px;
background:#ECFDF5;
color:#0D9488;
display:flex;
align-items:center;
justify-content:center;
flex-shrink:0;
border:1px solid #D1FAE5;
transition:.3s;
}

.ft-contact-item:hover .ft-contact-icon{
background:#0D9488;
color:#fff;
}

/* ------------------------- */

.ft-service-item{
display:flex;
align-items:center;
gap:10px;
font-size:15px;
color:#4B5563;
transition:.3s;
}

.ft-service-item:hover{
transform:translateX(5px);
color:#111827;
}

.ft-service-icon{
color:#0D9488;
}

/* ------------------------- */

.ft-rule{
height:1px;
background:#E5E7EB;
}

/* ------------------------- */

.ft-bottom{
background:#ffffff;
padding:22px 40px;
display:flex;
flex-direction:column;
align-items:center;
gap:12px;
text-align:center;
color:#6B7280;
border-top:1px solid #E5E7EB;
}

@media(min-width:640px){

.ft-bottom{

flex-direction:row;

justify-content:space-between;

text-align:left;

}

}

/* ------------------------- */

.ft-india-badge{
display:inline-flex;
align-items:center;
gap:8px;
padding:8px 14px;
border-radius:999px;
background:#F9FAFB;
border:1px solid #E5E7EB;
font-size:14px;
font-weight:600;
color:#374151;
}

/* ------------------------- */

.ft-social-row{
padding:35px 40px;
display:flex;
flex-direction:column;
align-items:center;
gap:20px;
border-bottom:1px solid #E5E7EB;
background:#fff;
text-align:center;
}

@media(min-width:768px){

.ft-social-row{

flex-direction:row;

justify-content:space-between;

height:110px;

text-align:left;

}

}

/* ------------------------- */

.ft-grid{
display:grid;
grid-template-columns:1fr;
gap:40px;
padding:60px 40px 50px;
max-width:1400px;
margin:auto;
}

@media(min-width:992px){

.ft-grid{

grid-template-columns:1.6fr .9fr .9fr 1.3fr;

gap:60px;

}

}

/* ------------------------- */

.ft-tag-container{
display:flex;
flex-wrap:wrap;
gap:10px;
margin-top:18px;
}

.ft-tag{
background:#ECFDF5;
border:1px solid #A7F3D0;
padding:7px 14px;
border-radius:999px;
font-size:12px;
font-weight:700;
color:#0D9488;
transition:.3s;
}

.ft-tag:hover{
background:#0D9488;
color:#fff;
}

/* ------------------------- */

.ft-city{
  margin:0;
  padding:0;
  overflow:hidden;
  background:transparent;
  border:none;
  line-height:0;
}

.ft-city img{
  display:block;
  width:100%;
  height:240px;              /* Increase image height */
  object-fit:cover;
  object-position:center bottom; /* Keep medical equipment visible */
  border:none;
        }

        .ft-social{
position:relative;
width:42px;
height:42px;

display:flex;
align-items:center;
justify-content:center;

border-radius:18px;

background:rgba(255,255,255,.75);

backdrop-filter:blur(16px);
-webkit-backdrop-filter:blur(16px);

border:1px solid rgba(255,255,255,.75);

box-shadow:
0 10px 30px rgba(15,23,42,.08),
inset 0 1px 0 rgba(255,255,255,.8);

transition:all .35s cubic-bezier(.22,1,.36,1);

overflow:hidden;
text-decoration:none;
}

.ft-social::before{

content:"";

position:absolute;

inset:-2px;

border-radius:20px;

padding:2px;

background:linear-gradient(
135deg,
rgba(255,255,255,.9),
rgba(13,148,136,.35)
);

-webkit-mask:
linear-gradient(#fff 0 0) content-box,
linear-gradient(#fff 0 0);

-webkit-mask-composite:xor;

mask-composite:exclude;

opacity:0;

transition:.35s;
}

.ft-social::after{

content:"";

position:absolute;

width:140%;

height:140%;

background:

radial-gradient(circle,
rgba(255,255,255,.55),
transparent 70%);

transform:scale(.3);

opacity:0;

transition:.35s;
}

.ft-social:hover{

transform:translateY(-8px) scale(1.08);

box-shadow:

0 18px 45px rgba(13,148,136,.20);

}

.ft-social:hover::before{

opacity:1;

}

.ft-social:hover::after{

opacity:1;

transform:scale(1);

}

.ft-social svg{

color:white;

transition:.35s;

z-index:2;

}

.ft-social:hover svg{

transform:scale(1.15);

}
`,
        }}
      />

{/* Top Bar */}
<div className="ft-social-row" style={{ position: "relative", zIndex: 2 }}>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      flexWrap: "wrap",
    }}
  >
    <Image
      src="/Logo/Jpl_Logo.png"
      alt="JPL Medwin"
      width={190}
      height={75}
      priority
      style={{
        objectFit: "contain",
      }}
    />

    <div>
      <p
        style={{
          marginTop: 6,
          marginBottom: 0,
          color: "#6B7280",
          fontSize: 14,
          maxWidth: 450,
        }}
      >
        Trusted supplier of Dental, Hospital & Healthcare products across India.
      </p>
    </div>
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
    }}
  >
    <p
      style={{
        margin: 0,
        color: "#374151",
        fontWeight: 600,
      }}
    >
      Follow Us
    </p>

    <div
      style={{
        display: "flex",
        gap: 10,
      }}
    >
      {socialLinks.map(({ icon: Icon, href, label, bg, gradient }, i) => (
  <a
    key={i}
    href={href}
    aria-label={label}
    className="ft-social"
    style={{
      background: gradient || bg,
    }}
  >
    <Icon size={17} />
  </a>
))}
    </div>
  </div>
</div>

{/* Main Grid */}

<div className="ft-grid" style={{ position: "relative", zIndex: 2 }}>

  {/* Contact */}

  <div>

    <div className="ft-heading">
      Contact
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div className="ft-contact-item">

        <div className="ft-contact-icon">
          <MapPin size={18}/>
        </div>

        <div>

          <strong>Bangalore Office</strong>

          <p style={{marginTop:6}}>
            JPL Markwin Private Limited
            <br/>
            117/115A,
            Kamal Tower,
            Bommasandra Industrial Area,
            Bangalore - 560099
          </p>

        </div>

      </div>

      <div className="ft-contact-item">

        <div className="ft-contact-icon">
          <Phone size={18}/>
        </div>

        <div>

          <a href="tel:+919187969350">
            +91 91879 69350
          </a>

          <br/>

          <a href="tel:+919187405646">
            +91 91874 05646
          </a>

        </div>

      </div>

      <div className="ft-contact-item">

        <div className="ft-contact-icon">
          <Mail size={18}/>
        </div>

        <a href="mailto:connect@jplmedwin.com">
          connect@jplmedwin.com
        </a>

      </div>

    </div>

  </div>

  {/* Company */}

  <div>

    <div className="ft-heading">
      Company
    </div>

    <ul style={{listStyle:"none",padding:0,margin:0,display:"grid",gap:14}}>

      {companyLinks.map((item,i)=>(
        <li key={i}>
          <Link href={item.href} className="ft-link">
            <ArrowUpRight className="ft-link-arrow" size={14}/>
            {item.label}
          </Link>
        </li>
      ))}

    </ul>

  </div>

  {/* Policies */}

  <div>

    <div className="ft-heading">
      Policies
    </div>

    <ul style={{listStyle:"none",padding:0,margin:0,display:"grid",gap:14}}>

      {policyLinks.map((item,i)=>(
        <li key={i}>
          <Link href={item.href} className="ft-link">
            <ArrowUpRight className="ft-link-arrow" size={14}/>
            {item.label}
          </Link>
        </li>
      ))}

    </ul>

  </div>

  {/* Services */}

  <div>

    <div className="ft-heading">
      Why JPL Medwin
    </div>

    <ul style={{listStyle:"none",padding:0,margin:0,display:"grid",gap:16}}>

      {businessServices.map((service,i)=>(
        <li key={i} className="ft-service-item">

          <CheckCircle2
            size={18}
            className="ft-service-icon"
          />

          <span>{service}</span>

        </li>
      ))}

    </ul>

  </div>

</div>

{/* Illustration */}

<div
  className="ft-city"
  style={{
    marginTop:0,
  }}
>
  <div
  style={{
    width: "100%",
    height: "260px",
    overflow: "hidden",
  }}
>
  <Image
    src="/images/footer.jpeg"
    alt="Healthcare Illustration"
    width={1920}
    height={260}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
  />
</div>
</div>

<div style={{padding:"0 40px"}}>
  <div className="ft-rule"/>
</div>

{/* Copyright */}

<div className="ft-bottom">

  <p
    style={{
      margin:0,
      fontWeight:500,
      color:"#6B7280"
    }}
  >
    © 2026 JPL MEDWIN Private Limited. All Rights Reserved.
  </p>

  <div
    style={{
      display:"flex",
      gap:18,
      flexWrap:"wrap",
      alignItems:"center"
    }}
  >

    <Link href="/privacy-policy" className="ft-link">
      Privacy Policy
    </Link>

    <Link href="/terms-of-use" className="ft-link">
      Terms
    </Link>

    <Link href="/shipping-policy" className="ft-link">
      Shipping
    </Link>

    <Link href="/refund-policy" className="ft-link">
      Refund
    </Link>

  </div>

</div>
    </footer>
  );
}
