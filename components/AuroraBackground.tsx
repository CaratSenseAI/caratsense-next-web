"use client";
import React from 'react';
import './AuroraBackground.css';

export interface AuroraBackgroundProps {
  children?: React.ReactNode;
  showRadialGradient?: boolean;
  style?: React.CSSProperties;
}

export function AuroraBackground({ children, showRadialGradient = true, style }: AuroraBackgroundProps) {
  return (
    <div className="aurora-root" style={style}>
      <div className="aurora-layer-wrap">
        <div
          className={`aurora-layer${showRadialGradient ? ' aurora-layer--masked' : ''}`}
        />
      </div>
      {children}
    </div>
  );
}

export default AuroraBackground;
