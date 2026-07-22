"use client";
import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export interface ParallaxImage {
  src: string;
  alt?: string;
}

export interface ZoomParallaxProps {
  images: ParallaxImage[];
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function ZoomParallax({ images, title, children, containerRef }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: container,
    container: containerRef,
    offset: ['start start', 'end end'],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  return (
    <div className="zp-wrapper">
      <div ref={container} className="zp-container">
        <div className="zp-sticky">
          <motion.div 
            className="zp-overlay"
            style={{ opacity: titleOpacity, scale: titleScale, zIndex: 100 }}
          >
            {title && <h1 className="section-title" style={{ fontSize: '3rem', fontWeight: 'bold' }}>{title}</h1>}
            <div className="zp-mouse-hint">
              <div className="mouse-icon">
                <div className="mouse-wheel" />
              </div>
              <span>Scroll to Explore</span>
            </div>
          </motion.div>

          {images.map(({ src, alt }, index) => {
            const scale = scales[index % scales.length];

            return (
              <motion.div
                key={index}
                style={{ scale }}
                className={`zp-item zp-item-${index}`}
              >
                <div className="zp-image-wrapper">
                  <img
                    src={src || '/placeholder.svg'}
                    alt={alt || `Parallax image ${index + 1}`}
                    className="zp-image"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <motion.div 
        className="zp-revealed-content"
        style={{ 
          opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1]),
          y: useTransform(scrollYProgress, [0.8, 1], [50, 0])
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default ZoomParallax;
