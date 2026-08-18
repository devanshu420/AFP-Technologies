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
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba57] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                {/* WhatsApp SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.014.376-.101c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.926l-1.564 5.717 5.867-1.539c1.703.931 3.659 1.478 5.741 1.478 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
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