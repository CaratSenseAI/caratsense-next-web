"use client";
import React from 'react';
import { motion } from 'framer-motion';

const logoWow = '/assets/wild-over-words-2nH9CjLB.png';
const logoSamruddhi = '/assets/samruddhi-developers-BnbYfta7.png';
const logoTheCommun = '/assets/the-commun-DlX1DNVl.png';
const logoKcc = '/assets/kcc-CG4_qt9x.png';
const logoCakeOClock = '/assets/cake-o-clock-BhZNsj1F.png';
const logoBabey = '/assets/babey-infratech-G_RYaT83.png';
const logoEclat = '/assets/eclat-diamonds-HU4uVl9C.png';
const logoSuntek = '/assets/suntek-group-DsYY8RBE.png';
const logoBfc = '/assets/bfc-DQSx5pX7.png';
const logoIvoryRose = '/assets/ivory-rose-e28synTD.png';
const logoTdm = '/assets/tdm-fabrics-2iFDiXNl.png';
const logoLandspeaks = '/assets/landspeaks-Cl1yJ99n.png';
const logoBlup = '/assets/blup-BFdEJOc8.png';

export interface ClientItem {
  name: string;
  logo: string;
}

const CLIENTS: ClientItem[] = [
  { name: 'Wild Over Words',       logo: logoWow },
  { name: 'Suntek Group',          logo: logoSuntek },
  { name: 'Samruddhi Developers',  logo: logoSamruddhi },
  { name: 'KCC',                   logo: logoKcc },
  { name: 'The Commun',            logo: logoTheCommun },
  { name: 'Eclat Diamonds',        logo: logoEclat },
  { name: 'Cake O Clock',          logo: logoCakeOClock },
  { name: 'BFC',                   logo: logoBfc },
  { name: 'Babey Infratech',       logo: logoBabey },
  { name: 'Ivory Rose',            logo: logoIvoryRose },
  { name: 'TDM Fabrics',           logo: logoTdm },
  { name: 'Landspeaks',            logo: logoLandspeaks },
  { name: 'Blup',                  logo: logoBlup },
];

export interface ClienteleSectionProps {
  theme?: string;
}

export function ClienteleSection({ theme = 'dark' }: ClienteleSectionProps) {
  const isDark = theme === 'dark';

  const mutedColor     = isDark ? 'rgba(237,232,255,0.45)' : 'rgba(26,10,46,0.45)';
  const cardBg         = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.85)';
  const cardBorder     = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(26,10,46,0.08)';
  const cardShadow     = isDark ? '0 2px 12px rgba(0,0,0,0.35)' : '0 2px 16px rgba(26,10,46,0.07)';
  const fadeBg         = isDark ? '#07030e' : '#ffffff';

  return (
    <section style={{ padding: '72px 0 56px', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px', padding: '0 24px' }}>
        <p style={{
          fontSize: '0.65rem', fontWeight: 700, color: '#D4AF37',
          letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 12px',
        }}>
          Our Clients
        </p>
        <p style={{ fontSize: '1rem', color: mutedColor, margin: 0 }}>
          Trusted by growing businesses across India.
        </p>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '140px',
          background: `linear-gradient(to right, ${fadeBg}, transparent)`,
          zIndex: 2, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '140px',
          background: `linear-gradient(to left, ${fadeBg}, transparent)`,
          zIndex: 2, pointerEvents: 'none',
        }} />

        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            width: 'max-content',
            willChange: 'transform',
          }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {[...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
            <div
              key={i}
              title={client.name}
              style={{
                flexShrink: 0,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: '16px',
                boxShadow: cardShadow,
                padding: '14px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '88px',
                minWidth: '148px',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <img
                src={client.logo}
                alt={client.name}
                style={{
                  height: '52px',
                  width: 'auto',
                  maxWidth: '130px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ClienteleSection;
