import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { CASE_STUDIES_FULL_DATA } from "../../../data/caseStudiesFullData";

// Metadata mapping for hero cover image & color accent
const CASE_STUDY_META: Record<string, { image: string; color: string; industry: string; problem: string; solution: string }> = {
  "01": {
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1200",
    color: "#fb923c",
    industry: "Food & Beverage",
    problem: "Orders on WhatsApp. Kitchen tracking from memory. No system.",
    solution: "4x the order volume, same team.",
  },
  "02": {
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200",
    color: "#f472b6",
    industry: "Textile",
    problem: "Odd lots ageing in the warehouse, with no record of who wanted what.",
    solution: "Right fabric, right buyer, within hours.",
  },
  "03": {
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200",
    color: "#D4AF37",
    industry: "Jewellery",
    problem: "Sixteen tools, sixteen problems, all held together by hand.",
    solution: "One screen. Sixteen problems solved.",
  },
  "04": {
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200",
    color: "#60a5fa",
    industry: "PropTech",
    problem: "Enquiries dying in DMs. Same flat promised twice.",
    solution: "No more lead leakage, no more double-bookings.",
  },
  "05": {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200",
    color: "#a78bfa",
    industry: "D2C Fashion",
    problem: "Selling everywhere, remembering no one. Every buyer a stranger.",
    solution: "Now every repeat buyer is recognised across every channel.",
  },
  "06": {
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=1200",
    color: "#34d399",
    industry: "Specialty Chemicals",
    problem: "Off-spec batch ships Monday. Customer flags it Friday.",
    solution: "Now it's caught at the plant, not at the customer.",
  },
  "07": {
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200",
    color: "#fbbf24",
    industry: "Jewellery Pricing",
    problem: "A photo comes in. Ten minutes to reply, and two people quote it differently.",
    solution: "Seconds instead of hours, with the same logic every time.",
  },
  "08": {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
    color: "#f87171",
    industry: "Real Estate",
    problem: "Buyers calling constantly. Payment milestones slipping.",
    solution: "Updates go out automatically, and trust gets sold alongside the flat.",
  },
  "09": {
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200",
    color: "#94a3b8",
    industry: "Construction",
    problem: "Decisions waiting on phone calls. No single view of cash or progress.",
    solution: "One ERP, and a manager who always knows where things stand.",
  },
};

export interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return [
    { id: "01" }, { id: "02" }, { id: "03" },
    { id: "04" }, { id: "05" }, { id: "06" },
    { id: "07" }, { id: "08" }, { id: "09" },
  ];
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { id } = await params;
  const story = CASE_STUDIES_FULL_DATA[id];
  const meta = CASE_STUDY_META[id];

  if (!story || !meta) {
    notFound();
  }

  const accentColor = meta.color || "#D4AF37";

  return (
    <div style={{ background: "#07030e", color: "#fff", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      {/* Top Header Navigation */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(7,3,14,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.8)",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.2s ease",
            }}
          >
            <ArrowLeft size={16} />
            Back to Main Site
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accentColor,
                background: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
                padding: "6px 14px",
                borderRadius: "999px",
                border: `1px solid color-mix(in srgb, ${accentColor} 30%, transparent)`,
              }}
            >
              {meta.industry}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.45)",
            marginBottom: "24px",
          }}
        >
          <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
            Home
          </Link>
          <ChevronRight size={14} />
          <span>Case Studies</span>
          <ChevronRight size={14} />
          <span style={{ color: accentColor }}>{meta.industry}</span>
        </div>

        {/* Article Header */}
        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            marginBottom: "20px",
          }}
        >
          {story.title}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "32px",
          }}
        >
          <span style={{ color: accentColor, fontWeight: 700 }}>CaratSense AI Studio</span>
          <span>•</span>
          <span>4 min read</span>
        </div>

        {/* Hero Cover Image */}
        <div
          style={{
            width: "100%",
            height: "380px",
            borderRadius: "20px",
            overflow: "hidden",
            position: "relative",
            marginBottom: "40px",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          <img src={meta.image} alt={story.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, transparent 40%, rgba(7,3,14,0.95) 100%)",
            }}
          />
        </div>

        {/* Problem vs Solution Callout Box */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            padding: "24px 28px",
            marginBottom: "48px",
            display: "grid",
            gap: "16px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              The Problem
            </span>
            <p style={{ margin: 0, fontSize: "1rem", color: "rgba(237,232,255,0.7)" }}>{meta.problem}</p>
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.08)" }} />

          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: accentColor,
                display: "block",
                marginBottom: "4px",
              }}
            >
              What Changed
            </span>
            <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#ffffff" }}>{meta.solution}</p>
          </div>
        </div>

        {/* Full Article Content */}
        <article style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(237,232,255,0.88)" }}>
          {story.sections.map((section, idx) => {
            if (section.type === "heading") {
              return (
                <h2
                  key={idx}
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#fbbf24",
                    marginTop: "48px",
                    marginBottom: "20px",
                    lineHeight: 1.3,
                  }}
                >
                  {section.text}
                </h2>
              );
            }

            if (section.type === "paragraph") {
              return (
                <p key={idx} style={{ marginBottom: "24px" }}>
                  {section.text}
                </p>
              );
            }

            if (section.type === "quote") {
              return (
                <blockquote
                  key={idx}
                  style={{
                    margin: "36px 0",
                    padding: "20px 28px",
                    background: "rgba(254, 243, 199, 0.04)",
                    borderLeft: `4px solid ${accentColor}`,
                    borderRadius: "0 14px 14px 0",
                    fontStyle: "italic",
                    fontSize: "1.15rem",
                    color: "#fef08a",
                    lineHeight: 1.6,
                  }}
                >
                  {`"${section.text}"`}
                </blockquote>
              );
            }

            if (section.type === "image" && section.src) {
              return (
                <figure key={idx} style={{ margin: "40px 0" }}>
                  <img
                    src={section.src}
                    alt=""
                    style={{
                      width: "100%",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      boxShadow: "0 20px 45px rgba(0,0,0,0.5)",
                      display: "block",
                    }}
                  />
                  {section.caption && (
                    <figcaption
                      style={{
                        marginTop: "12px",
                        fontSize: "0.88rem",
                        color: "rgba(255,255,255,0.5)",
                        textAlign: "center",
                      }}
                    >
                      {section.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }

            return null;
          })}
        </article>

        {/* CTA Banner at Bottom */}
        <section
          style={{
            marginTop: "80px",
            padding: "48px 36px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(26,10,46,0.9) 0%, rgba(13,11,20,0.95) 100%)",
            border: `1px solid color-mix(in srgb, ${accentColor} 30%, transparent)`,
            textAlign: "center",
            boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: accentColor,
              marginBottom: "12px",
            }}
          >
            Have a similar challenge?
          </p>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: "16px" }}>
            Let&apos;s build the system your business needs.
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "500px",
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            We analyze your operational bottlenecks and build custom software, AI, and ERP platforms to solve them.
          </p>

          <Link
            href="/#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: accentColor,
              color: "#000",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "14px 32px",
              borderRadius: "999px",
              textDecoration: "none",
              boxShadow: `0 10px 30px color-mix(in srgb, ${accentColor} 40%, transparent)`,
            }}
          >
            Get in Touch
            <CheckCircle2 size={18} />
          </Link>
        </section>
      </main>
    </div>
  );
}
