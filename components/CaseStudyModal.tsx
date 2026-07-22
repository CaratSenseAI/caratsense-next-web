"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface StudyItem {
  industry: string;
  slug: string;
  tagline: string;
  challenge: string;
  solution: string;
  impact: string;
  color: string;
}

export interface CaseStudyModalProps {
  study: StudyItem | null;
  onClose: () => void;
}

export default function CaseStudyModal({ study, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    if (study) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [study]);

  return (
    <AnimatePresence>
      {study && (
        <div className="cs-modal-overlay" onClick={onClose}>
          <motion.div
            className="cs-modal-panel"
            style={{ borderColor: `${study.color}40` }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <button className="cs-modal-close" onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="cs-modal-content">
              <span
                className="cs-industry-tag"
                style={{ color: study.color, borderColor: `${study.color}45`, background: `${study.color}16` }}
              >
                {study.industry}
              </span>

              <h2 className="cs-modal-title">{study.slug}</h2>
              <p className="cs-modal-tagline">{study.tagline}</p>

              <div className="cs-modal-rule" style={{ borderColor: `${study.color}28` }} />

              <div className="cs-section">
                <h3 className="cs-section-heading">The Challenge</h3>
                <p className="cs-section-body">{study.challenge}</p>
              </div>

              <div className="cs-section">
                <h3 className="cs-section-heading">How We Solved It</h3>
                <p className="cs-section-body">{study.solution}</p>
              </div>

              <div className="cs-section">
                <h3 className="cs-section-heading">The Impact</h3>
                <p className="cs-section-body">{study.impact}</p>
              </div>

              <div className="cs-modal-rule" style={{ borderColor: `${study.color}28` }} />

              <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-start' }}>
                <a
                  href="#startconversation"
                  className="cs-cta-btn"
                  onClick={() => {
                    onClose();
                    setTimeout(() => document.getElementById('startconversation')?.scrollIntoView({ behavior: 'smooth' }), 320);
                  }}
                >
                  Book a Free Discovery Call
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
