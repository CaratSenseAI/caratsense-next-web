"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Layers,
  Gem,
  Home,
  ShoppingBag,
  Factory,
  Calculator,
  Building2,
  HardHat,
} from "lucide-react";
import PreviewWindow from "./PreviewWindow";

const FEATURES = [
  {
    id: "01",
    label: "Home Bakery",
    icon: UtensilsCrossed,
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1200",
    description: "A one-person bakery was taking orders over WhatsApp and running the kitchen from memory. The system we built let it grow without falling apart.",
    link: "https://medium.com/@caratsenseAI/running-a-home-bakery-like-a-logistics-company-33f3790205c6",
    caseStudy: {
      industry: "Food & Beverage",
      color: "#fb923c",
      problem: "Orders on WhatsApp. Kitchen tracking from memory. No system.",
      solution: "4x the order volume, same team.",
    },
  },
  {
    id: "02",
    label: "Textile",
    icon: Layers,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200",
    description: "A surplus-fabric business had slow-moving stock tracked on paper. We built the system that puts the right lot in front of the right buyer.",
    link: "https://medium.com/@caratsenseAI/turning-dead-stock-into-matched-demand-986c75665803",
    caseStudy: {
      industry: "Textile",
      color: "#f472b6",
      problem: "Odd lots ageing in the warehouse, with no record of who wanted what.",
      solution: "Right fabric, right buyer, within hours.",
    },
  },
  {
    id: "03",
    label: "Jewellery",
    icon: Gem,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200",
    description: "A diamond retailer was running every part of the business in a different tool. We rebuilt it as one operation in the order the owner actually thinks about it.",
    link: "https://medium.com/@caratsenseAI/sixteen-problems-one-screen-af2259cecdd0",
    caseStudy: {
      industry: "Jewellery",
      color: "#D4AF37",
      problem: "Sixteen tools, sixteen problems, all held together by hand.",
      solution: "One screen. Sixteen problems solved.",
    },
  },
  {
    id: "04",
    label: "PropTech",
    icon: Home,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200",
    description: "A fast-growing PG and flat-brokering operation ran entirely on DMs and spreadsheets. We gave it a backbone.",
    link: "https://medium.com/@caratsenseAI/student-housing-off-whatsapp-5ec93a88a9f5",
    caseStudy: {
      industry: "PropTech",
      color: "#60a5fa",
      problem: "Enquiries dying in DMs. Same flat promised twice.",
      solution: "No more lead leakage, no more double-bookings.",
    },
  },
  {
    id: "05",
    label: "D2C Fashion",
    icon: ShoppingBag,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200",
    description: "A fashion label sold across Instagram, WhatsApp and a marketplace but kept no real record of its own customers. We fixed the memory.",
    link: "https://medium.com/@caratsenseAI/selling-everywhere-remembering-nothing-2ae72610d19c",
    caseStudy: {
      industry: "D2C Fashion",
      color: "#a78bfa",
      problem: "Selling everywhere, remembering no one. Every buyer a stranger.",
      solution: "Now every repeat buyer is recognised across every channel.",
    },
  },
  {
    id: "06",
    label: "Manufacturing",
    icon: Factory,
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=1200",
    description: "A specialty-chemicals maker tracked batch quality in registers across plants. We made it visible while it's still happening.",
    link: "https://medium.com/@caratsenseAI/multiple-plants-thousands-of-batches-no-single-view-4cb373eaef6a",
    caseStudy: {
      industry: "Specialty Chemicals",
      color: "#34d399",
      problem: "Off-spec batch ships Monday. Customer flags it Friday.",
      solution: "Now it's caught at the plant, not at the customer.",
    },
  },
  {
    id: "07",
    label: "Pricing Engine",
    icon: Calculator,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200",
    description: "Jewellers were quoting by hand off the gold rate and gut feel. We built a tool that turns a photo of a piece into an instant indicative quote.",
    link: "https://medium.com/@caratsenseAI/the-quote-that-used-to-require-an-expert-0eb80997ac59",
    caseStudy: {
      industry: "Jewellery Pricing",
      color: "#fbbf24",
      problem: "A photo comes in. Ten minutes to reply, and two people quote it differently.",
      solution: "Seconds instead of hours, with the same logic every time.",
    },
  },
  {
    id: "08",
    label: "Real Estate",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
    description: "A developer was running site progress and buyer updates across calls, WhatsApp and spreadsheets. We put it all on one track.",
    link: "https://medium.com/@caratsenseAI/now-selling-trust-not-just-flats-df8bf0b46fac",
    caseStudy: {
      industry: "Real Estate",
      color: "#f87171",
      problem: "Buyers calling constantly. Payment milestones slipping.",
      solution: "Updates go out automatically, and trust gets sold alongside the flat.",
    },
  },
  {
    id: "09",
    label: "Construction",
    icon: HardHat,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200",
    description: "A construction firm ran projects, procurement and finances on spreadsheets and phone calls. We built the ERP that holds it all together.",
    link: "https://medium.com/@caratsenseAI/the-manager-who-knows-78b6979ddaf5",
    caseStudy: {
      industry: "Construction",
      color: "#94a3b8",
      problem: "Decisions waiting on phone calls. No single view of cash or progress.",
      solution: "One ERP, and a manager who always knows where things stand.",
    },
  },
];

const AUTO_PLAY_INTERVAL = 3000;
const ITEM_HEIGHT = 70;

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [preview, setPreview] = useState(null);

  const currentIndex = ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
    else if (diff < 0) setStep((s) => s + (FEATURES.length + diff));
    setTimerKey((k) => k + 1);
  };

  useEffect(() => {
    if (isPaused || preview) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused, timerKey, preview]);

  const getCardStatus = (index) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;
    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;
    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  const openPreview = (feature) => {
    if (!feature.link) return;
    setPreview(feature);
  };

  return (
    <>
      <div className="fc-container">
        <div className="fc-main-frame">

          <div className="fc-sidebar">
            <div className="fc-sidebar-fade-top" />
            <div className="fc-sidebar-fade-bottom" />
            <div className="fc-sidebar-track">
              {FEATURES.map((feature, index) => {
                const isActive = index === currentIndex;
                const distance = index - currentIndex;
                const wrappedDistance = wrap(
                  -(FEATURES.length / 2),
                  FEATURES.length / 2,
                  distance
                );
                return (
                  <motion.div
                    key={feature.id}
                    style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                    animate={{
                      y: wrappedDistance * ITEM_HEIGHT,
                      opacity: 1 - Math.abs(wrappedDistance) * 0.35,
                      scale: isActive ? 1 : 0.85,
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fc-chip-wrapper"
                  >
                    <button
                      onClick={() => handleChipClick(index)}
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                      className={`fc-chip ${isActive ? "active" : ""}`}
                    >
                      <div className="fc-chip-icon">
                        <feature.icon size={18} strokeWidth={2} />
                      </div>
                      <span className="fc-chip-label">{feature.label}</span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="fc-content">
            <div className="fc-card-stack">
              {FEATURES.map((feature, index) => {
                const status = getCardStatus(index);
                const isActive = status === "active";
                const isPrev = status === "prev";
                const isNext = status === "next";

                return (
                  <motion.div
                    key={feature.id}
                    initial={false}
                    animate={{
                      x: isActive ? 0 : isPrev ? -120 : isNext ? 120 : 0,
                      scale: isActive ? 1 : isPrev || isNext ? 0.82 : 0.7,
                      opacity: isActive ? 1 : isPrev || isNext ? 0.35 : 0,
                      rotate: isPrev ? -4 : isNext ? 4 : 0,
                      zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                    transition={{ type: "spring", stiffness: 240, damping: 24 }}
                    className="fc-card"
                    onClick={() => isActive && openPreview(feature)}
                    style={{ cursor: isActive && feature.link ? "pointer" : "default" }}
                  >
                    <img
                      src={feature.image}
                      alt={feature.label}
                      className={`fc-card-img ${isActive ? "active" : ""}`}
                    />

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="fc-card-overlay"
                        >
                          <p className="fc-card-desc">{feature.description}</p>

                          {feature.caseStudy && (
                            <div style={{
                              marginTop: '14px',
                              paddingTop: '14px',
                              borderTop: '1px solid rgba(255,255,255,0.12)',
                            }}>
                              <span style={{
                                fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em',
                                textTransform: 'uppercase', color: feature.caseStudy.color,
                                display: 'block', marginBottom: '6px',
                              }}>
                                {feature.caseStudy.industry}
                              </span>
                              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', margin: '0 0 4px', lineHeight: 1.45 }}>
                                {feature.caseStudy.problem}
                              </p>
                              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.4 }}>
                                {feature.caseStudy.solution}
                              </p>
                            </div>
                          )}

                          {feature.link && (
                            <div className="fc-card-hint">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              </svg>
                              Click to preview
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {preview && (
        <PreviewWindow
          url={preview.link}
          title={preview.label}
          image={preview.image}
          description={preview.description}
          meta={preview.caseStudy}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}

export default FeatureCarousel;
