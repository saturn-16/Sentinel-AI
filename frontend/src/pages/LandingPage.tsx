import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShieldAlert, Activity, ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight, Layers,
  ExternalLink, Code2, Zap, AlertTriangle, Shield, KeyRound, Cpu, Server, Network
} from 'lucide-react';
import CircularGallery from '../components/common/CircularGallery';
import Plasma from '../components/common/Plasma';
import ScrollFloat from '../components/common/ScrollFloat';
import TextPressure from '../components/common/TextPressure';
import Shuffle from '../components/common/Shuffle';

gsap.registerPlugin(ScrollTrigger);

const rotatingTaglines = [
  "Behavior Never Lies.",
  "Identity is the New Security Perimeter.",
  "Every Login Tells a Story. SentinelAI Reads It."
];

const heroHeadlines = [
  { line1: "BEHAVIORAL", line2: "DETECTION" },
  { line1: "IDENTITY", line2: "SECURITY" },
  { line1: "ANOMALY", line2: "INFERENCE" },
  { line1: "EXPLAINABLE", line2: "AI THREATS" },
  { line1: "REALTIME", line2: "SOC UEBA" }
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [headlineIdx, setHeadlineIdx] = useState(0);

  const pinnedSectionRef = useRef<HTMLDivElement>(null);
  const pinnedTitleRef = useRef<HTMLDivElement>(null);
  const pinnedItem1Ref = useRef<HTMLDivElement>(null);
  const pinnedItem2Ref = useRef<HTMLDivElement>(null);
  const pinnedItem3Ref = useRef<HTMLDivElement>(null);

  const pipelineSectionRef = useRef<HTMLDivElement>(null);
  const pipelineTitleRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIdx((prev) => (prev + 1) % rotatingTaglines.length);
      setHeadlineIdx((prev) => (prev + 1) % heroHeadlines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const section = pinnedSectionRef.current;
    const title = pinnedTitleRef.current;
    const item1 = pinnedItem1Ref.current;
    const item2 = pinnedItem2Ref.current;
    const item3 = pinnedItem3Ref.current;

    if (!section || !title || !item1 || !item2 || !item3) return;

    const ctx = gsap.context(() => {
      gsap.set([title, item1, item2, item3], { opacity: 0, y: 60 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          start: 'top top',
          end: '+=2400',
          scrub: 0.8
        }
      });

      tl.to(title, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
        .to(item1, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '+=0.4')
        .to(item2, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '+=0.4')
        .to(item3, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '+=0.4')
        .to({}, { duration: 0.5 });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = pipelineSectionRef.current;
    const steps = [step1Ref.current, step2Ref.current, step3Ref.current, step4Ref.current, step5Ref.current];

    if (!section || steps.some((s) => !s)) return;

    const ctx = gsap.context(() => {
      steps.forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 opacity-15 pointer-events-none">
        <Plasma
          color="#ef4444"
          speed={0.4}
          direction="forward"
          scale={1.1}
          opacity={0.3}
          mouseInteractive={true}
        />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-1.5 bg-red-600/10 text-red-600 rounded-md border border-red-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-black text-base tracking-tighter leading-none uppercase">SENTINELAI</span>
              <span className="text-[9px] text-red-600 font-mono tracking-widest uppercase">HONEYWELL SOC UEBA</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-slate-600">
            <a href="#features" className="hover:text-black transition-colors">FEATURES</a>
            <a href="#pipeline" className="hover:text-black transition-colors">PIPELINE</a>
            <a href="#architecture" className="hover:text-black transition-colors">ARCHITECTURE</a>
            <a href="https://github.com/saturn-16/Sentinel-AI" target="_blank" rel="noreferrer" className="hover:text-black transition-colors flex items-center gap-1">
              GITHUB <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-black hover:bg-red-600 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              LAUNCH DASHBOARD <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      <section className="relative pt-28 pb-16 px-8 min-h-[92vh] flex flex-col justify-between max-w-7xl mx-auto z-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono tracking-widest text-slate-500 uppercase border-b border-black/10 pb-4">
            <span>SENTINELAI — SWISS SOC</span>
            <span>INDEX</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono tracking-widest text-slate-400 uppercase pt-2">
            <span>RATIONAL SYSTEMS</span>
            <span>( 2026 — ENTERPRISE )</span>
          </div>

          <div className="pt-4 space-y-0 min-h-[200px] md:min-h-[320px]">
            <Shuffle
              key={`line1-${headlineIdx}`}
              text={heroHeadlines[headlineIdx].line1}
              duration={0.35}
              shuffleTimes={3}
              className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter text-black uppercase leading-none select-none block"
            />
            <Shuffle
              key={`line2-${headlineIdx}`}
              text={heroHeadlines[headlineIdx].line2}
              duration={0.35}
              shuffleTimes={3}
              className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter text-[#EF4444] uppercase leading-none select-none -mt-2 md:-mt-8 block"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-12">
          <div className="space-y-3">
            <div className="h-6">
              <motion.p
                key={taglineIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-mono text-xs text-red-600 font-bold tracking-widest uppercase"
              >
                "{rotatingTaglines[taglineIdx]}"
              </motion.p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 bg-red-600 hover:bg-black text-white font-mono font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                ACCESS SOC DASHBOARD <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border-l-2 border-black pl-6 space-y-2">
            <p className="font-mono text-xs text-slate-700 leading-relaxed uppercase tracking-wider">
              THE SENTINELAI ENTERPRISE UEBA PLATFORM CONTINUOUSLY ANALYZES AUTHENTICATION BEHAVIOR, DETECTS HIDDEN THREATS, AND EXPLAINS EVERY ANOMALY BEFORE IT BECOMES A SECURITY INCIDENT.
            </p>
          </div>
        </div>
      </section>

      <section ref={pinnedSectionRef} id="problem" className="min-h-screen py-24 px-8 bg-[#121212] text-white relative z-10 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto space-y-16 w-full">
          <div className="flex items-center justify-between text-xs font-mono tracking-widest text-neutral-400 uppercase border-b border-neutral-800 pb-4">
            <span>SENTINELAI — THREAT INTELLIGENCE</span>
            <span>MODERN ATTACKS DONT BREAK IN</span>
          </div>

          <div ref={pinnedTitleRef} className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              MODERN ATTACKS DON'T BREAK IN. <br />
              <span className="text-[#EF4444]">THEY LOG IN.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
            <div ref={pinnedItem1Ref} className="border-l border-neutral-800 pl-6 space-y-6">
              <div className="text-5xl md:text-7xl font-extrabold text-[#EF4444] font-mono tracking-tighter">
                ( 01 )
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                VALID CREDENTIAL ABUSE
              </h3>
              <p className="font-mono text-xs text-neutral-400 leading-relaxed uppercase tracking-wider">
                TRADITIONAL SECURITY TOOLS FOCUS ON KNOWN MALWARE HASHES AND STATIC IP BLOCKLISTS. MODERN ATTACKERS EXPLOIT VALID EMPLOYEE CREDENTIALS, STOLEN SESSIONS, AND MFA BYPASSES.
              </p>
            </div>

            <div ref={pinnedItem2Ref} className="border-l border-neutral-800 pl-6 space-y-6">
              <div className="text-5xl md:text-7xl font-extrabold text-[#EF4444] font-mono tracking-tighter">
                ( 02 )
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                GRID ALIGNMENT & SIEM NOISE
              </h3>
              <p className="font-mono text-xs text-neutral-400 leading-relaxed uppercase tracking-wider">
                ENTERPRISE SOCS GENERATE HUNDREDS OF THOUSANDS OF AUTHENTICATION EVENTS EVERY HOUR. SECURITY ANALYSTS SUFFER FROM SEVERE ALERT FATIGUE, MAKING MANUAL ANOMALY DETECTION IMPOSSIBLE.
              </p>
            </div>

            <div ref={pinnedItem3Ref} className="border-l border-neutral-800 pl-6 space-y-6">
              <div className="text-5xl md:text-7xl font-extrabold text-[#EF4444] font-mono tracking-tighter">
                ( 03 )
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                BEHAVIORAL INTELLIGENCE
              </h3>
              <p className="font-mono text-xs text-neutral-400 leading-relaxed uppercase tracking-wider">
                SENTINELAI CONTINUOUSLY LEARNS BASELINE WORK PATTERNS ACROSS 24 DIMENSIONS TO SURFACE TRUE IDENTITY THREATS WITH TRANSPARENT EXPLAINABLE RISK SCORES.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={pipelineSectionRef} id="pipeline" className="py-28 px-8 bg-[#FAFAFA] text-black relative z-10">
        <div className="max-w-7xl mx-auto space-y-10 w-full">
          <div className="flex items-center justify-between text-xs font-mono tracking-widest text-slate-500 uppercase border-b border-black/10 pb-4">
            <span>SENTINELAI — SWISS PIPELINE</span>
            <span>( PIPELINE — 05 STEPS )</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black whitespace-nowrap">
              DETECTION <span className="text-[#EF4444]">PIPELINE</span>
            </h2>
            <div className="border-b-2 border-black w-full" />
          </motion.div>

          <div className="space-y-8 pt-2">
            {[
              {
                ref: step1Ref,
                num: '01',
                title: 'SAML / SSO AUTHENTICATION',
                tag: 'EVENT INGESTION / 2026',
                desc: 'High-throughput stream engine capturing enterprise SAML 2.0, OAuth 2.0, and Kerberos authentication payloads across 9 corporate divisions in real-time.'
              },
              {
                ref: step2Ref,
                num: '02',
                title: '24-DIMENSIONAL FEATURE ENGINE',
                tag: 'VECTOR NORMALIZATION / 2026',
                desc: 'Transforms raw authentication logs into 24 continuous behavioral dimensions, measuring login velocity, geodistance entropy, device fingerprinting, and temporal variance.'
              },
              {
                ref: step3Ref,
                num: '03',
                title: 'ENSEMBLE ANOMALY INFERENCE',
                tag: 'ISOLATION FOREST & OC-SVM',
                desc: 'Dual unsupervised machine learning models compute decision function scores against historical workforce baselines without requiring pre-labeled attack data.'
              },
              {
                ref: step4Ref,
                num: '04',
                title: 'DYNAMIC RISK SCORE CALCULATION',
                tag: 'CONFIGURABLE POLICY ENGINE',
                desc: 'Calculates normalized 0-100 threat scores using PyYAML policy weighting, privilege multipliers, risk thresholds, and contextual escalation rules.'
              },
              {
                ref: step5Ref,
                num: '05',
                title: 'MITRE ATT&CK & SOC TRIAGE',
                tag: 'EXPLAINABLE AI REMEDIATION',
                desc: 'Maps flagged anomalies directly to MITRE ATT&CK tactics (TA0001-TA0010) and technique IDs (T1110, T1078) with automated analyst remediation protocols.'
              }
            ].map((step, idx) => (
              <div
                key={idx}
                ref={step.ref}
                className="border-b border-black/10 pb-6 space-y-3 group hover:border-black transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-baseline gap-6">
                    <span className="text-red-600 font-mono font-bold text-lg md:text-xl">
                      {step.num}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-black italic uppercase tracking-tight text-black group-hover:text-red-600 transition-colors">
                      {step.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
                    {step.tag}
                  </span>
                </div>

                <div className="pl-12 max-w-3xl">
                  <p className="font-mono text-xs text-slate-600 leading-relaxed uppercase tracking-wide">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 border-t border-black/10 bg-[#0F1623] text-white overflow-hidden relative z-10">
        <div className="space-y-8">
          <div className="text-center space-y-3 px-6">
            <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest">Built for Security Teams</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-100 tracking-tight uppercase">
              Built for Modern Security Operations
            </h3>
            <p className="text-xs font-mono text-slate-400 max-w-2xl mx-auto uppercase">
              Explore why SentinelAI empowers enterprise SOC teams with automated behavioral intelligence, explainable risk scoring, and real-time threat detection.
            </p>
          </div>

          <div style={{ height: '550px', position: 'relative' }} className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
            <CircularGallery
              bend={2}
              textColor="#ef4444"
              borderRadius={0.04}
              scrollEase={0.02}
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-black text-white relative z-10 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex items-center justify-between text-xs font-mono tracking-widest text-neutral-400 uppercase">
            <span>SENTINELAI — SWISS SOC</span>
            <span>INDEX</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-0">
              <h2 className="text-6xl sm:text-8xl md:text-[8.5rem] font-black tracking-tighter text-white uppercase leading-none select-none">
                AUTONOMOUS
              </h2>
              <div className="flex items-baseline">
                <h2 className="text-6xl sm:text-8xl md:text-[8.5rem] font-black tracking-tighter text-[#EF4444] uppercase leading-none select-none">
                  DEFENSE
                </h2>
                <span className="w-6 h-6 md:w-10 md:h-10 bg-white inline-block ml-2 mb-2" />
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="group relative w-32 h-32 md:w-44 md:h-44 rounded-full border-2 border-white/80 hover:border-red-600 hover:bg-red-600 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shrink-0"
              aria-label="Open SentinelAI Dashboard"
            >
              <ArrowUpRight className="w-12 h-12 md:w-16 md:h-16 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-neutral-800 pt-8 font-mono text-xs text-neutral-400 uppercase tracking-wider">
            <div>
              <div className="font-bold text-white mb-1">HONEYWELL SOC</div>
              <p>ENTERPRISE UEBA ENGINE / 24-DIMENSIONAL ANALYSIS</p>
            </div>
            <div>
              <div className="font-bold text-white mb-1">THREAT INTELLIGENCE</div>
              <p>REALTIME ANOMALY TRIAGE / MITRE ATT&CK</p>
            </div>
            <div>
              <div className="font-bold text-white mb-1">GITHUB REPOSITORY</div>
              <p>SATURN-16 / SENTINEL-AI</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-8 bg-black text-white border-t border-neutral-800 relative z-10 font-mono text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span className="font-bold tracking-widest uppercase">SENTINELAI ENTERPRISE SOC PLATFORM</span>
          </div>
          <div className="text-neutral-500 uppercase tracking-wider">
            © 2026 HONEYWELL HACKATHON. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};
