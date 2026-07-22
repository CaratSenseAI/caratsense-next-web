"use client";

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Dynamic client-only components for SSR safety
const HeroOrganicNetwork = dynamic(() => import('../components/HeroOrganicNetwork'), { ssr: false });
const FeatureCarousel = dynamic(() => import('../components/FeatureCarousel'), { ssr: false });
const AnimatedThemeToggler = dynamic(() => import('../components/AnimatedThemeToggler'), { ssr: false });
const ClienteleSection = dynamic(() => import('../components/ClienteleSection').then(m => m.ClienteleSection || m.default), { ssr: false });
const MotionButton = dynamic(() => import('../components/ui/motion-button'), { ssr: false });

const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.02 + 0.005,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.flicker += s.flickerSpeed;
        const alpha = s.alpha * (0.7 + 0.3 * Math.sin(s.flicker));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas starfield" />;
};

const ScrollToTopBtn = ({ theme }: { theme: string }) => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setShowTop(docH > 0 && window.scrollY / docH > 0.15);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fabBg = theme === 'light' ? '#0d0d0d' : '#f0f2f5';
  const fabColor = theme === 'light' ? '#f0f2f5' : '#0d0d0d';

  return (
    <button
      id="fab-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
      style={{
        position: 'fixed', bottom: 24, right: 24,
        width: 48, height: 48, borderRadius: '50%',
        background: fabBg, color: fabColor,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
        boxShadow: theme === 'light' ? '0 4px 24px rgba(0,0,0,0.22)' : '0 4px 24px rgba(0,0,0,0.55)',
        transition: 'all 0.25s cubic-bezier(0.2,0,0,1)',
        outline: 'none',
        opacity: showTop ? 1 : 0,
        pointerEvents: showTop ? 'auto' : 'none',
        transform: showTop ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
};

const NAV_SECTIONS = [
  {
    id: 'hero',
    label: 'Home',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'whatwebuild',
    label: 'Build',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: 'tools',
    label: 'Tools',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07" />
      </svg>
    ),
  },
  {
    id: 'startconversation',
    label: 'Contact',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.93 3.36 2 2 0 0 1 3.9 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

const Nav = ({ onMenuOpen, isDark, onThemeToggle }: { onMenuOpen: () => void; isDark: boolean; onThemeToggle: () => void }) => {
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const SECTION_IDS = NAV_SECTIONS.slice(1).map(s => s.id);
    const TRIGGER_OFFSET = 120;

    const handler = () => {
      if (navRef.current) {
        navRef.current.classList.toggle('scrolled', window.scrollY > 20);
      }

      let found = 'hero';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= TRIGGER_OFFSET) {
          found = id;
        }
      }
      setActiveSection(found);
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'hero') window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="nav" ref={navRef}>
      <a href="#" className="nav-logo">
        <img src="/logo-symbol.png" alt="CaratSense AI" className="nav-logo-img" />
        <span>CaratSense <span style={{
          background: 'linear-gradient(90deg, #a78bfa, #c4b5fd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 700,
        }}>AI</span></span>
      </a>

      <div className={`nav-pill${isDark ? ' nav-pill--dark' : ''}`}>
        {NAV_SECTIONS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-pill-btn${activeSection === id ? ' active' : ''}`}
            onClick={() => scrollTo(id)}
            title={label}
          >
            <Icon />
            <span className="nav-pill-label">{label}</span>
          </button>
        ))}
      </div>

      <div className="nav-actions" style={{ marginLeft: 'auto' }}>
        <AnimatedThemeToggler isDark={isDark} onToggle={onThemeToggle} />
        <span className="nav-connect-cta"><MotionButton label="Connect With Us" href="#startconversation" /></span>
        <button className="mobile-menu-toggle" onClick={onMenuOpen}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </nav>
  );
};

const HOW_WE_WORK_STEPS = [
  { num: '01', title: 'We Listen', desc: 'We map how your business runs today: the tools, the team, and where it slows down.' },
  { num: '02', title: 'We Map', desc: "We find every bottleneck that's quietly costing you time and money." },
  { num: '03', title: 'We Plan', desc: 'We design the exact solution, and you sign off before we build anything.' },
  { num: '04', title: 'We Build', desc: 'We develop and test in stages, with you in the loop the whole way.' },
  { num: '05', title: 'We Stay', desc: 'We launch, train your team, and stay on well after go-live.' },
];

const mkT = (isDark: boolean) => ({
  overlay:  isDark ? 'rgba(5,5,10,0.82)'       : 'rgba(26,10,46,0.45)',
  bg:       isDark ? '#080810'                  : '#ffffff',
  border:   isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(26,10,46,0.09)',
  btnBg:    isDark ? 'rgba(255,255,255,0.06)'  : 'rgba(26,10,46,0.06)',
  btnBord:  isDark ? 'rgba(255,255,255,0.1)'   : 'rgba(26,10,46,0.12)',
  fg:       isDark ? '#fff'                    : '#1A0A2E',
  muted:    isDark ? 'rgba(255,255,255,0.55)'  : 'rgba(26,10,46,0.55)',
  faint:    isDark ? 'rgba(255,255,255,0.22)'  : 'rgba(26,10,46,0.28)',
  cardBg:   isDark ? 'rgba(255,255,255,0.04)'  : 'rgba(26,10,46,0.03)',
  pillBg:   isDark ? 'rgba(255,255,255,0.05)'  : 'rgba(26,10,46,0.05)',
  pillBord: isDark ? 'rgba(255,255,255,0.1)'   : 'rgba(26,10,46,0.1)',
});

const SimpleModal = ({ isOpen, onClose, title, label, theme = 'light', children }: { isOpen: boolean; onClose: () => void; title: string; label?: string; theme?: string; children: React.ReactNode }) => {
  const t = mkT(theme === 'dark');
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9100, background: t.overlay, backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={onClose}>
      <div style={{ background: t.bg, maxWidth: '580px', width: '100%', borderRadius: '20px', padding: '48px 40px', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', border: `1px solid ${t.border}` }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 20, right: 20, background: t.btnBg, border: `1px solid ${t.btnBord}`, borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        {label && <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 12px' }}>{label}</p>}
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: t.fg, margin: '0 0 24px', letterSpacing: '-0.02em' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
};

const AboutModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; theme: string }) => {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: reduceMotion ? 0 : 0.12 } },
  };
  const stepVariants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="hww-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="hww-panel"
            role="dialog"
            aria-modal="true"
            aria-label="How we work"
            onClick={e => e.stopPropagation()}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="hww-close" onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <p className="hww-eyebrow">Our Process</p>
            <h2 className="hww-title">How We Work</h2>
            <p className="hww-sub">
              From the first conversation to final handover, here&apos;s exactly what working with CaratSense looks like.
            </p>

            <motion.ol className="hww-steps" variants={listVariants} initial="hidden" animate="show">
              {HOW_WE_WORK_STEPS.map((step) => (
                <motion.li className="hww-step" key={step.num} variants={stepVariants}>
                  <div className="hww-step-marker"><span className="hww-step-num">{step.num}</span></div>
                  <div className="hww-step-body">
                    <h3 className="hww-step-title">{step.title}</h3>
                    <p className="hww-step-desc">{step.desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>

            <p className="hww-note">
              Every build is custom, shaped around how your business actually works. No templates, no shortcuts.
            </p>
            <div className="hww-cta">
              <MotionButton label="Book a Free Discovery Call" href="#startconversation" onClick={onClose}
                icon={<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const links = ['What We Build', 'Tools'];

  return (
    <div className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}>
      <button className="mobile-menu-close" onClick={onClose}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div className="mobile-menu-links">
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '')}`} className="mobile-menu-link" onClick={onClose}>
            {l}
          </a>
        ))}
        <a href="#startconversation" className="btn btn-dark" style={{ marginTop: 20, justifyContent: 'center' }} onClick={onClose}>
          Start Conversation
        </a>
      </div>
    </div>
  );
};

const useFadeIn = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-in');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

export default function Home() {
  useFadeIn();
  const [theme, setTheme] = useState('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCareersOpen, setIsCareersOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsPageLoading(false), 800);
    };
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  const SI = 'https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/';
  const TOOLS = [
    { icon: 'openai', name: 'OpenAI', color: '#10A37F' },
    { icon: 'anthropic', name: 'Anthropic', color: '#CC785C', src: "data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M17.3041%203.541h-3.6718l6.696%2016.918H24Zm-10.6082%200L0%2020.459h3.7442l1.3693-3.5527h7.0052l1.3693%203.5528h3.7442L10.5363%203.5409Zm-.3712%2010.2232%202.2914-5.9456%202.2914%205.9456Z%22/%3E%3C/svg%3E" },
    { icon: 'salesforce', name: 'Salesforce', color: '#00A1E0' },
    { icon: 'databricks', name: 'Databricks', color: '#FF3621' },
    { icon: 'snowflake', name: 'Snowflake', color: '#29B5E8' },
    { icon: 'amazonaws', name: 'AWS', color: '#FF9900' },
    { icon: 'googlecloud', name: 'Google Cloud', color: '#4285F4' },
    { icon: 'microsoftazure', name: 'Azure', color: '#0078D4' },
    { icon: 'postgresql', name: 'PostgreSQL', color: '#4169E1' },
    { icon: 'mongodb', name: 'MongoDB', color: '#47A248' },
    { icon: 'whatsapp', name: 'WhatsApp', color: '#25D366' },
    { icon: 'slack', name: 'Slack', color: '#4A154B', darkColor: '#E01E5A' },
    { icon: 'hubspot', name: 'HubSpot', color: '#FF7A59' },
    { icon: 'notion', name: 'Notion', color: '#000000', darkColor: '#FFFFFF' },
    { icon: 'react', name: 'React', color: '#61DAFB' },
    { icon: 'nextdotjs', name: 'Next.js', color: '#000000', darkColor: '#FFFFFF' },
  ];
  const INDUSTRIES = [
    'Retail', 'Manufacturing', 'Real Estate', 'F&B', 'Jewellery',
    'Hospitality', 'Aviation', 'Logistics', 'Healthcare', 'Finance',
    'Specialty Chemicals', 'Textile & Fashion', 'Building Materials',
    'FMCG', 'Legal Services', 'Education',
  ];

  return (
    <>
      <div className={`loader-overlay ${!isPageLoading ? 'fade-out' : ''}`}>
        {/* @ts-expect-error Custom element for dotlottie */}
        <dotlottie-wc
          src="https://lottie.host/9eda103f-d44d-426f-ada1-ca59acc009ce/fjs6qAMHJ1.lottie"
          style={{ width: '300px', height: '300px' }}
          autoplay
          loop
        />
      </div>

      <ScrollToTopBtn theme={theme} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div id="page-content" style={{ position: 'relative', zIndex: 1, opacity: isPageLoading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        <Nav onMenuOpen={() => setIsMenuOpen(true)} isDark={theme === 'dark'} onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
        
        <HeroOrganicNetwork onSunClick={() => setIsAboutOpen(true)} theme={theme} isLoaded={!isPageLoading} />
        
        <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} theme={theme} />

        <SimpleModal isOpen={isCareersOpen} onClose={() => setIsCareersOpen(false)} label="Join Us" title="Work with CaratSense" theme={theme}>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, fontSize: '1rem', margin: '0 0 20px' }}>
            We&apos;re a small team that builds fast and ships faster. We&apos;re always open to sharp engineers, designers, and operators who care about solving real business problems.
          </p>
          <a href="mailto:vk@caratsense.in" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#D4AF37', color: '#000', padding: '12px 24px', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            Get in Touch →
          </a>
        </SimpleModal>

        <SimpleModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} label="Legal" title="Privacy Policy" theme={theme}>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, fontSize: '1rem', margin: '0 0 16px' }}>
            We collect only the information necessary to respond to your inquiry. Your data is never sold or shared with third parties.
          </p>
          <a href="mailto:legal@caratsense.in" style={{ color: '#D4AF37', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>legal@caratsense.in</a>
        </SimpleModal>

        <SimpleModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} label="Legal" title="Terms of Service" theme={theme}>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, fontSize: '1rem', margin: '0 0 16px' }}>
            By using this website, you agree to CaratSense&apos;s standard terms of engagement. All client builds are covered under custom client agreements.
          </p>
          <a href="mailto:legal@caratsense.in" style={{ color: '#D4AF37', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>legal@caratsense.in</a>
        </SimpleModal>

        <SimpleModal isOpen={isBrandOpen} onClose={() => setIsBrandOpen(false)} label="Brand" title="Brand Guidelines" theme={theme}>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, fontSize: '1rem', margin: '0 0 20px' }}>
            CaratSense brand assets, logo files, and visual identity documentation are available on request.
          </p>
          <a href="mailto:brand@caratsense.in" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '12px 24px', borderRadius: '100px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            Request Brand Kit →
          </a>
        </SimpleModal>

        {/* ── WHAT WE BUILD (INTERACTIVE EXPLORER) ── */}
        <section className="section explorer-section" id="whatwebuild">
          <div className="section-inner">
            <div className="section-header fade-in" style={{ marginBottom: 40 }}>
              <h2 className="section-title">Real businesses. Real systems.</h2>
              <p className="section-desc">Every business below was running on memory, spreadsheets, or WhatsApp before we got there. Click through to see what changed.</p>
            </div>

            <div className="explorer-container fade-in">
              <FeatureCarousel />
            </div>
          </div>
        </section>

        {/* ── TOOLS & INDUSTRIES ── */}
        <section className="tools-section" id="tools">
          <div className="section-inner">
            <div className="section-header fade-in">
              <p className="section-label">Stack &amp; Reach</p>
              <h2 className="section-title">Tools &amp; Industries</h2>
              <p className="section-desc">The platforms we build on and the sectors we serve.</p>
            </div>
          </div>

          <div className="marquee-container ti-row">
            <div className="marquee-content marquee-content--tools marquee-content--rtl">
              {[...TOOLS, ...TOOLS].map((t, i) => (
                <div
                  key={i}
                  className="tool-sine-wrapper"
                  style={{ animationDelay: `${-(i % TOOLS.length)}s` }}
                >
                  <div className="tool-circle">
                    <span
                      className="tool-circle-img"
                      aria-label={t.name}
                      style={{
                        maskImage: `url(${t.src || `${SI}${t.icon}.svg`})`,
                        WebkitMaskImage: `url(${t.src || `${SI}${t.icon}.svg`})`,
                        backgroundColor: theme === 'dark' ? (t.darkColor || t.color) : t.color,
                      }}
                    />
                    <span className="tool-tooltip">{t.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="marquee-container" style={{ marginTop: '14px' }}>
            <div className="marquee-content marquee-content--tools">
              {[...INDUSTRIES, ...INDUSTRIES].map((name, i) => (
                <span key={i} className="industry-pill">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLIENTELE ── */}
        <ClienteleSection theme={theme} />

        {/* ── IMPACT ── */}
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap' }}>
            {[
              { stat: '20+', label: 'Clients Served' },
              { stat: '8+', label: 'Industries' },
              { stat: '100%', label: 'Custom Built' },
            ].map(({ stat, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {stat}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)', marginTop: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER CTA ── */}
        <div className="footer-cta" id="startconversation">
          <Starfield />
          <div className="footer-cta-inner">
            <p className="section-label" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
              Let&apos;s build what your business actually needs
            </p>
            <h2 className="footer-cta-title">Ready to fix what&apos;s slowing your business down?</h2>
            <p className="footer-cta-sub">
              Let&apos;s find it, fix it, and build around it — for good.
            </p>

            <div className="footer-cta-actions">
              <a
                href="https://api.whatsapp.com/send/?phone=919309137416&text=Hi%2C+I+want+to+build+custom+operational+software+for+my+business&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-dark"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                WhatsApp Us
              </a>
              <a href="mailto:vk@caratsense.in" className="btn btn-white">Email Us</a>
              <a href="tel:+919309137416" className="btn btn-outline-dark">Call Us</a>
            </div>
            <p style={{ marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.01em' }}>
              Typically respond within 2 hours · 100% confidential
            </p>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer>
          <div className="footer-inner">
            <div className="footer-top">
              <div>
                <div className="footer-brand-logo">
                  <img src="/logo-symbol.png" alt="CaratSense AI" style={{ height: '24px', width: 'auto', objectFit: 'contain' }} />
                  CaratSense AI
                </div>
                <p className="footer-brand-tagline">See Beyond.</p>
                <p className="footer-brand-desc">
                  CaratSense is a consultative AI and software studio that builds custom tech around your operations — not the other way around.
                </p>
                <div className="footer-socials">
                  {[
                    {
                      href: 'https://linkedin.com/company/caratsense',
                      label: 'LinkedIn',
                      icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                      )
                    },
                    {
                      href: 'https://instagram.com/caratsense',
                      label: 'Instagram',
                      icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      )
                    },
                    {
                      href: 'https://api.whatsapp.com/send/?phone=919309137416&text=Hi+CaratSense&type=phone_number&app_absent=0',
                      label: 'WhatsApp',
                      icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      )
                    },
                  ].map((s, i) => (
                    <a key={i} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                      <span className="fslink-inner">
                        <span className="fslink-top">{s.icon}<span className="fslink-text">{s.label}</span></span>
                        <span className="fslink-bot">{s.icon}<span className="fslink-text">{s.label}</span></span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <div className="footer-col-title">Company</div>
                <ul className="footer-links">
                  <li><a href="#whatwebuild" onClick={e => { e.preventDefault(); document.getElementById('whatwebuild')?.scrollIntoView({ behavior: 'smooth' }); }}>Case Studies</a></li>
                  <li><a href="#" onClick={e => { e.preventDefault(); setIsCareersOpen(true); }}>Careers</a></li>
                  <li><a href="#startconversation" onClick={e => { e.preventDefault(); document.getElementById('startconversation')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a></li>
                </ul>
              </div>

              <div>
                <div className="footer-col-title">Industries</div>
                <ul className="footer-links">
                  {['Jewellery', 'Textile', 'Real Estate', 'Manufacturing', 'Food & Beverage', 'Chemical'].map(l => (
                    <li key={l}>
                      <a href="#whatwebuild" onClick={e => { e.preventDefault(); document.getElementById('whatwebuild')?.scrollIntoView({ behavior: 'smooth' }); }}>{l}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="footer-col-title">Contact</div>
                <ul className="footer-links">
                  <li><a href="mailto:vk@caratsense.in">vk@caratsense.in</a></li>
                  <li><a href="tel:+919309137416">+91 93091 37416</a></li>
                  <li>
                    <a
                      href="https://api.whatsapp.com/send/?phone=919309137416&text=Hi+CaratSense&type=phone_number&app_absent=0"
                      target="_blank" rel="noopener noreferrer"
                    >
                      WhatsApp Chat
                    </a>
                  </li>
                  <li style={{ color: 'inherit', opacity: 0.5, pointerEvents: 'none' }}>Mumbai, Maharashtra, India</li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <span className="footer-copyright">© 2026 CaratSense. All rights reserved.</span>
              <div className="footer-legal">
                <a href="#" onClick={e => { e.preventDefault(); setIsPrivacyOpen(true); }}>Privacy Policy</a>
                <a href="#" onClick={e => { e.preventDefault(); setIsTermsOpen(true); }}>Terms</a>
                <a href="#" onClick={e => { e.preventDefault(); setIsBrandOpen(true); }}>Brand Guidelines</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
