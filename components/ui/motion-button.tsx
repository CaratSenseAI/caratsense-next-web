"use client";
import React from 'react';
import { ArrowRight } from 'lucide-react';
import './motion-button.css';

export interface MotionButtonProps {
  label?: string;
  href?: string;
  onClick?: (e?: React.MouseEvent) => void;
  icon?: React.ReactNode;
  target?: string;
  rel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function MotionButton({
  label = 'Get Started',
  href,
  onClick,
  icon,
  target,
  rel,
  className = '',
  style,
}: MotionButtonProps) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      style={style}
      className={`motion-btn ${className}`}
    >
      <span className="motion-btn-arrow" aria-hidden="true">
        {icon ?? <ArrowRight size={15} strokeWidth={2.5} />}
      </span>
      <span className="motion-btn-text">{label}</span>
    </Tag>
  );
}
