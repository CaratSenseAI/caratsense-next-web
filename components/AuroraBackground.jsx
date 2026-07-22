"use client";
import React from 'react';
import './AuroraBackground.css';

export function AuroraBackground({ children, showRadialGradient = true, style }) {
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
