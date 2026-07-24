"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ArrowDown, BookOpen, ArrowLeft } from 'lucide-react';
import { CASE_STUDIES_FULL_DATA } from '../data/caseStudiesFullData';
import './PreviewWindow.css';

export interface PreviewWindowMeta {
  color?: string;
  industry?: string;
  problem?: string;
  solution?: string;
}

export interface PreviewWindowProps {
  id?: string;
  url?: string;
  title: string;
  image: string;
  description?: string;
  meta?: PreviewWindowMeta;
  onClose: () => void;
}

export default function PreviewWindow({ id, title, image, description, meta, onClose }: PreviewWindowProps) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const accent = meta?.color || 'var(--accent-primary)';
  const [mounted, setMounted] = useState(false);
  const [showFullStory, setShowFullStory] = useState(false);

  const fullStory = id ? CASE_STUDIES_FULL_DATA[id] : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock background scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="pw-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <motion.div
          className={`pw-card ${showFullStory ? 'pw-card--full-story' : ''}`}
          style={{ '--cs-accent': accent } as React.CSSProperties}
          initial={reduce ? false : { scale: 0.94, opacity: 0, y: 22 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { scale: 0.96, opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} case study`}
        >
          <button ref={closeRef} className="pw-close" onClick={onClose} aria-label="Close preview">
            <X size={18} strokeWidth={2.2} />
          </button>

          {!showFullStory ? (
            /* Summary Overview View */
            <>
              <div className="pw-hero">
                <img src={image} alt={title} className="pw-hero-img" />
                <div className="pw-hero-scrim" />
              </div>

              <div className="pw-content">
                <div className="pw-tagrow">
                  {meta?.industry && <span className="pw-industry">{meta.industry}</span>}
                  <span className="pw-kicker">Case study</span>
                </div>

                <h2 className="pw-title">{title}</h2>
                {description && <p className="pw-desc">{description}</p>}

                {meta && (meta.problem || meta.solution) && (
                  <div className="pw-transform">
                    {meta.problem && (
                      <div className="pw-step pw-step--before">
                        <span className="pw-step-label">The problem</span>
                        <p className="pw-step-text">{meta.problem}</p>
                      </div>
                    )}

                    {meta.problem && meta.solution && (
                      <div className="pw-step-arrow" aria-hidden="true">
                        <ArrowDown size={15} strokeWidth={2.6} />
                      </div>
                    )}

                    {meta.solution && (
                      <div className="pw-step pw-step--after">
                        <span className="pw-step-label">What changed</span>
                        <p className="pw-step-text">{meta.solution}</p>
                      </div>
                    )}
                  </div>
                )}

                <a
                  href={`/case-studies/${id || '01'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pw-cta"
                >
                  Read the full story
                  <BookOpen size={16} strokeWidth={2.4} />
                </a>
              </div>
            </>
          ) : (
            /* In-Website Full Story Reader */
            <div className="pw-reader-container">
              <div className="pw-reader-header">
                <button
                  type="button"
                  className="pw-back-btn"
                  onClick={() => setShowFullStory(false)}
                >
                  <ArrowLeft size={16} />
                  <span>Summary</span>
                </button>
                {meta?.industry && <span className="pw-industry">{meta.industry}</span>}
              </div>

              <div className="pw-reader-body">
                <div className="pw-reader-hero">
                  <img src={image} alt={title} className="pw-reader-hero-img" />
                  <div className="pw-reader-scrim" />
                </div>

                <div className="pw-article-content">
                  <div className="pw-article-meta">
                    <span className="pw-article-byline">CaratSense AI Case Study</span>
                    <span className="pw-article-dot">•</span>
                    <span className="pw-article-readtime">4 min read</span>
                  </div>

                  <h1 className="pw-article-main-title">
                    {fullStory ? fullStory.title : title}
                  </h1>

                  <div className="pw-article-divider" />

                  {fullStory ? (
                    fullStory.sections.map((section, idx) => {
                      if (section.type === 'heading') {
                        return (
                          <h2 key={idx} className="pw-article-h2">
                            {section.text}
                          </h2>
                        );
                      }
                      if (section.type === 'paragraph') {
                        return (
                          <p key={idx} className="pw-article-p">
                            {section.text}
                          </p>
                        );
                      }
                      if (section.type === 'quote') {
                        return (
                          <blockquote key={idx} className="pw-article-quote">
                            {`"${section.text}"`}
                          </blockquote>
                        );
                      }
                      if (section.type === 'image' && section.src) {
                        return (
                          <figure key={idx} className="pw-article-figure">
                            <img src={section.src} alt="" className="pw-article-img" />
                            {section.caption && (
                              <figcaption className="pw-article-figcaption">{section.caption}</figcaption>
                            )}
                          </figure>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <p className="pw-article-p">{description}</p>
                  )}

                  <div className="pw-article-footer">
                    <button
                      type="button"
                      className="pw-cta"
                      onClick={() => setShowFullStory(false)}
                    >
                      <ArrowLeft size={16} /> Back to summary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
