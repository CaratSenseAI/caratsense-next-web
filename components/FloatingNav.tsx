"use client";
import React, { useState, useEffect } from 'react';
import './FloatingNav.css';

const GemMark = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <polygon points="16,2 28,10 28,22 16,30 4,22 4,10" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
    <polygon points="16,2 28,10 16,14 4,10" fill="rgba(212,175,55,0.2)" stroke="#D4AF37" strokeWidth="0.75" />
    <polygon points="16,14 28,10 28,22 16,30" fill="rgba(212,175,55,0.08)" stroke="#D4AF37" strokeWidth="0.75" />
    <polygon points="16,14 4,10 4,22 16,30" fill="rgba(212,175,55,0.12)" stroke="#D4AF37" strokeWidth="0.75" />
    <line x1="16" y1="2" x2="16" y2="14" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2,2" />
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BuildIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ReviewsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const TalkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    <path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export interface NavSection {
  id: string;
  label: string;
  Icon: React.ComponentType;
}

const SECTIONS: NavSection[] = [
  { id: 'hero',             label: 'Home',     Icon: HomeIcon    },
  { id: 'whatwebuild',      label: 'Build',    Icon: BuildIcon   },
  { id: 'testimonials',     label: 'Reviews',  Icon: ReviewsIcon },
  { id: 'startconversation',label: 'Talk',     Icon: TalkIcon    },
];

export interface FloatingNavProps {
  theme?: string;
}

export default function FloatingNav({ theme = 'dark' }: FloatingNavProps) {
  const [active, setActive] = useState('hero');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const targets = SECTIONS.slice(1).map(s => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);

    const observers = targets.map((el, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(SECTIONS[i + 1].id); },
        { threshold: 0.35, rootMargin: '-5% 0px -45% 0px' }
      );
      obs.observe(el);
      return obs;
    });

    const onScroll = () => { if (window.scrollY < 300) setActive('hero'); };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observers.forEach(o => o.disconnect());
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className={`fn ${visible ? 'fn--in' : ''} ${theme === 'dark' ? 'fn--dark' : ''}`}
      aria-label="Section navigation"
    >
      <div className="fn-pill">
        {/* Left pair */}
        {SECTIONS.slice(0, 2).map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`fn-btn${active === id ? ' fn-btn--active' : ''}`}
            onClick={() => scrollTo(id)}
            aria-label={label}
            title={label}
          >
            <Icon />
            <span className="fn-label">{label}</span>
          </button>
        ))}

        {/* Central gem divider */}
        <div className="fn-gem" aria-hidden="true">
          <GemMark />
        </div>

        {/* Right pair */}
        {SECTIONS.slice(2).map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`fn-btn${active === id ? ' fn-btn--active' : ''}`}
            onClick={() => scrollTo(id)}
            aria-label={label}
            title={label}
          >
            <Icon />
            <span className="fn-label">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
