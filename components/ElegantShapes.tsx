"use client";
import React from 'react';
import { motion } from 'framer-motion';

export interface ElegantShapeProps {
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradientDark: string;
  gradientLight: string;
  theme?: string;
  style?: React.CSSProperties;
}

function ElegantShape({
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradientDark,
  gradientLight,
  theme = 'dark',
  style,
}: ElegantShapeProps) {
  const isDark = theme === 'dark';
  const gradient = isDark ? gradientDark : gradientLight;

  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      style={{ position: 'absolute', ...style }}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width, height, position: 'relative' }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            background: `linear-gradient(to right, ${gradient}, transparent)`,
            backdropFilter: 'blur(2px)',
            border: isDark
              ? '1.5px solid rgba(255,255,255,0.12)'
              : '1.5px solid rgba(124,34,212,0.18)',
            boxShadow: isDark
              ? '0 8px 32px 0 rgba(255,255,255,0.06)'
              : '0 8px 32px 0 rgba(124,34,212,0.08)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export interface ElegantShapesProps {
  theme?: string;
}

export function ElegantShapes({ theme = 'dark' }: ElegantShapesProps) {
  const shapes: Array<Omit<ElegantShapeProps, 'theme'>> = [
    {
      delay: 0.3, width: 580, height: 135, rotate: 12,
      gradientDark:  'rgba(99,102,241,0.18)',
      gradientLight: 'rgba(124,34,212,0.14)',
      style: { left: '-5%', top: '18%' },
    },
    {
      delay: 0.5, width: 480, height: 115, rotate: -15,
      gradientDark:  'rgba(244,63,94,0.15)',
      gradientLight: 'rgba(167,139,250,0.18)',
      style: { right: '0%', top: '72%' },
    },
    {
      delay: 0.4, width: 290, height: 78, rotate: -8,
      gradientDark:  'rgba(139,92,246,0.16)',
      gradientLight: 'rgba(196,181,253,0.20)',
      style: { left: '8%', bottom: '8%' },
    },
    {
      delay: 0.6, width: 200, height: 58, rotate: 20,
      gradientDark:  'rgba(245,158,11,0.14)',
      gradientLight: 'rgba(109,40,217,0.12)',
      style: { right: '18%', top: '12%' },
    },
    {
      delay: 0.7, width: 145, height: 38, rotate: -25,
      gradientDark:  'rgba(6,182,212,0.14)',
      gradientLight: 'rgba(124,34,212,0.10)',
      style: { left: '22%', top: '7%' },
    },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {shapes.map((s, i) => (
        <ElegantShape key={i} theme={theme} {...s} />
      ))}
    </div>
  );
}

export default ElegantShapes;
