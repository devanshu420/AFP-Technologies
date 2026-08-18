'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Factory,
  CheckCircle2,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AboutSection() {
  const [contactInfo, setContactInfo] = useState({
    salesPhoneNumber: '+91 98765 43210',
    inquiryEmail: 'contact@afptechnologies.com',
  });

  // Dynamic Contact & Phone Fetch for WhatsApp
  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/contact`, {
          cache: 'no-store',
        });
        const json = await res.json();
        if (res.ok && json.data) {
          setContactInfo({
            salesPhoneNumber:
              json.data.salesPhoneNumber || '+91 98765 43210',
            inquiryEmail:
              json.data.inquiryEmail || 'contact@afptechnologies.com',
          });
        }
      } catch (err) {
        console.error('Failed to load contact in about section:', err);
      }
    }
    fetchContact();
  }, []);

  // Clean WhatsApp Number
  const rawCleanPhone = contactInfo.salesPhoneNumber.replace(/\D/g, '');
  const whatsappNumber =
    rawCleanPhone.length === 10 ? `91${rawCleanPhone}` : rawCleanPhone;

  const whatsappMessage = encodeURIComponent(
    'Hello Founder / Leadership Team @ AFP Technologies, I would like to consult regarding industrial food processing & machinery setups.'
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section
      id="about"
      className="about section relative overflow-hidden py-16 sm:py-24 bg-[#050c18] border-t border-b border-slate-800/80 text-slate-100"
    >
      {/* Ambient Tech Glow */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Kicker & Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            ENGINEERING EXCELLENCE & LEADERSHIP
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Built by engineers. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
              Driven by industrial performance.
            </span>
          </h2>
        </div>

        {/* 2-Column Grid: Founder Profile (Left) + Vision & Direct Connect (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Founder Photo & Credential Card */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative w-full max-w-md group">
              {/* Outer Decorative Frame */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 opacity-30 blur-sm group-hover:opacity-60 transition duration-500" />
              
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-3">
                {/* Founder Photo */}
                <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-slate-950">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                    alt="Founder & Managing Director - AFP Technologies"
                    className="w-full h-full object-cover object-top filter contrast-[1.05] brightness-95 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Experience Badge */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-sm sm:text-base">
                        Er. Alok Sharma
                      </h4>
                      <p className="text-sky-400 text-xs font-semibold">
                        Founder &amp; Chief Technology Officer
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase tracking-wider block text-[10px]">Exp.</span>
                      <span className="text-emerald-400 font-extrabold text-xs sm:text-sm">20+ Years</span>
                    </div>
                  </div>
                </div>

                {/* Founder Personal Quote */}
                <p className="text-xs text-slate-400 italic px-3 py-3 border-t border-slate-800/80 mt-2 leading-relaxed">
                  &ldquo;Our mission at AFP Technologies is to manufacture high-yield, zero-breakdown machinery that turns local agro-produce into world-class packaged foods.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Mission, Machinery Domain, Key Metrics & Action Buttons */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-slate-100 mb-3 leading-snug">
                Powering Modern Food Processing, Snack Lines &amp; Automated Manufacturing Plants.
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Founded with a core commitment to precision engineering, <strong>AFP Technologies</strong> manufactures complete automatic potato chips processing lines, continuous fryers, extruded snacks (Kurkure/Namkeen), and industrial vegetable processing systems across India and global markets.
              </p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                From initial factory layout planning and custom fabrication to trial testing and on-site operator commissioning, our engineering team works hand-in-hand with commercial plant owners.
              </p>
            </div>

            {/* Core Capability Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">Food-Grade SS-304/316</h5>
                  <p className="text-[11px] text-slate-400">Strict hygiene &amp; corrosion-resistant alloy fabrication.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">PLC &amp; Automation Controls</h5>
                  <p className="text-[11px] text-slate-400">Accurate temperature, speed &amp; yield monitoring.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">High Thermal Efficiency</h5>
                  <p className="text-[11px] text-slate-400">Optimized fuel/power consumption in continuous fryers.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">Turnkey Plant Delivery</h5>
                  <p className="text-[11px] text-slate-400">End-to-end installation, trial run &amp; warranty support.</p>
                </div>
              </div>
            </div>

            {/* ── Action Buttons: WhatsApp Direct Connect + Get In Touch CTA ── */}
           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4 border-t border-slate-800">
  
  {/* 1. Direct WhatsApp Connect Button */}
  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba57] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
  >
    {/* Clean, perfectly centered official WhatsApp Glyph SVG */}
    <svg 
      width="26" 
      height="26" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className="shrink-0"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
    <span>Direct WhatsApp Consultation</span>
  </a>

  {/* 2. Get In Touch / RFQ Button */}
  <Link
    href="/contact"
    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-950/50 transition-all cursor-pointer"
  >
    <span>Get In Touch with Plant Engineers</span>
    <ArrowRight size={15} />
  </Link>
</div>

            {/* Direct Phone Assistance Mention */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <PhoneCall size={14} className="text-sky-400 shrink-0" />
              <span>
                Need immediate engineering advice? Call our desk at{' '}
                <a
                  href={`tel:${contactInfo.salesPhoneNumber.replace(/\s+/g, '')}`}
                  className="text-sky-400 font-semibold hover:underline"
                >
                  {contactInfo.salesPhoneNumber}
                </a>
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}