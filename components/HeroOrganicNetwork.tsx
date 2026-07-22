"use client";
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Billboard, useTexture, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Folder, FileText, FileSpreadsheet, Database, HardDrive, Table, LucideIcon } from 'lucide-react';
import { Typewriter } from './ui/typewriter';

const CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/';

const CUSTOM_ICONS: Record<string, LucideIcon> = {
  folder: Folder,
  file: FileText,
  spreadsheet: FileSpreadsheet,
  database: Database,
  drive: HardDrive,
  table: Table
};

const FLOAT_ICONS = [
  'microsoftexcel', 'googlesheets', 'snowflake', 'databricks',
  'folder', 'file', 'spreadsheet', 'folder', 'file',
  'microsoftexcel', 'folder', 'file', 'spreadsheet', 'folder',
  'googlesheets', 'snowflake', 'folder', 'file', 'drive',
  'microsoftexcel', 'databricks', 'folder', 'file', 'database',
  'spreadsheet', 'folder', 'file', 'microsoftexcel', 'googlesheets',
  'folder', 'file', 'snowflake', 'databricks'
];

const NODE_DETAILS: Record<string, string> = {
  chatbot: "Deploy intelligent chatbots on WhatsApp, your website, Instagram, or anywhere your customers already are. From answering FAQs to qualifying leads and booking appointments, our AI chatbots handle it 24/7, so your team doesn't have to.",
  dashboard: "Stop jumping between spreadsheets, apps, and reports. We build real-time dashboards that pull from all your data sources and show you exactly what's happening — sales, operations, inventory, finances — built exactly the way you need to see it.",
  crm: "A custom CRM built around how your sales team actually works. Track every lead, follow-up, and deal in one place. Get pipeline views, reminders, and reports that help your team close more clients.",
  erp: "We build ERP systems that tie together your finance, procurement, HR, and operations, and connect all the tools you're already using like Zoho, Tally, Shopify, and Slack. One system, zero silos, everything in sync.",
  inventory: "A smart inventory system built for your specific products and warehouses. Track stock levels in real time, get low-stock alerts, manage suppliers, and eliminate the guesswork that leads to overstocking or understocking.",
  aiml: "We build custom AI and machine learning models trained on your own business data. From predicting sales and customer churn to detecting anomalies — we turn your data into a tool that tells you what's coming before it happens.",
  automation: "We map your most repetitive, time-consuming processes and automate them end to end. Approvals, data entry, report generation, cross-team handoffs — we build automation that gives your team hours back every single day.",
  custom: "Not every business problem fits a standard module. If you have a specific challenge that needs a solution built from scratch — a niche tool, a complex integration, or something entirely new — tell us what you need and we'll engineer it.",
};

const HERO_PREFIX = "Turn your business\nchaos into\n";
const HERO_CYCLING_WORDS = [
  "Real decisions",
  "Operational clarity",
  "Measurable results",
  "Competitive edge",
  "Work that runs itself",
];
const PREFIX_SPEED = 55;

export interface PlanetData {
  id: string;
  label: string;
  mobileLabel: string;
  color: string;
  distance: number;
  speed: number;
  size: number;
  icon: string;
}

const PLANETS_DATA: PlanetData[] = [
  { id: 'chatbot', label: 'AI Chatbots', mobileLabel: 'Chatbots', color: '#25D366', distance: 5.0, speed: 0.15, size: 0.6, icon: 'openai' },
  { id: 'dashboard', label: 'Custom Dashboards', mobileLabel: 'Dashboards', color: '#a78bfa', distance: 7.0, speed: 0.12, size: 0.8, icon: 'grafana' },
  { id: 'crm', label: 'CRM', mobileLabel: 'CRM', color: '#60a5fa', distance: 9.0, speed: 0.1, size: 0.5, icon: 'hubspot' },
  { id: 'erp', label: 'ERP', mobileLabel: 'ERP', color: '#fb923c', distance: 11.0, speed: 0.08, size: 0.7, icon: 'sap' },
  { id: 'inventory', label: 'Inventory Manager', mobileLabel: 'Inventory', color: '#2dd4bf', distance: 13.0, speed: 0.06, size: 0.5, icon: 'shopify' },
  { id: 'aiml', label: 'AI & ML Models', mobileLabel: 'AI Models', color: '#f472b6', distance: 15.0, speed: 0.05, size: 0.6, icon: 'pytorch' },
  { id: 'automation', label: 'Workflow Automation', mobileLabel: 'Automation', color: '#fbbf24', distance: 17.0, speed: 0.04, size: 0.8, icon: 'zapier' },
  { id: 'custom', label: 'Custom Solutions', mobileLabel: 'Custom', color: '#cbd5e1', distance: 19.0, speed: 0.03, size: 0.5, icon: 'anthropic' },
];

interface ShootingStarProps {
  id: number;
  onComplete: (id: number) => void;
  type: string;
}

function ShootingStar({ id, onComplete, type }: ShootingStarProps) {
  const ref = useRef<THREE.Group>(null!);
  const [data, setData] = useState<{ pos: [number, number, number]; vel: THREE.Vector3 } | null>(null);

  useEffect(() => {
    let pos: [number, number, number];
    let velArr: [number, number, number];
    const speed = 40 + Math.random() * 20;

    switch (type) {
      case 'background_fall':
        pos = [(Math.random() - 0.5) * 120, 50, -55];
        velArr = [(Math.random() - 0.5) * 15, -speed - 10, (Math.random() - 0.5) * 5];
        break;
      case 'back_to_front':
        pos = [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40, -70];
        velArr = [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, speed + 30];
        break;
      case 'right_to_left_cross':
        pos = [90, Math.random() * 40 - 20, -10];
        velArr = [-speed - 25, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5];
        break;
      case 'right_to_left_front':
        pos = [90, Math.random() * 30 - 15, 30];
        velArr = [-speed - 30, (Math.random() - 0.5) * 5, -5];
        break;
      default:
        pos = [0, 0, -1000];
        velArr = [0, 0, 0];
    }

    setData({ pos, vel: new THREE.Vector3(...velArr) });
  }, [type]);

  useFrame((_, delta) => {
    if (!ref.current || !data) return;
    ref.current.position.addScaledVector(data.vel, delta);

    const p = ref.current.position;
    if (Math.abs(p.x) > 150 || Math.abs(p.y) > 100 || p.z > 80 || p.y < -100) {
      onComplete(id);
    }
  });

  if (!data) return null;

  return (
    <group ref={ref} position={data.pos}>
      <mesh>
        <sphereGeometry args={[0.07, 6, 6]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.8} />
      </mesh>
      <Line
        points={[[0, 0, 0], [-data.vel.x * 0.08, -data.vel.y * 0.08, -data.vel.z * 0.08]]}
        color="white"
        lineWidth={0.5}
        transparent
        opacity={0.2}
      />
    </group>
  );
}

function MeteorSystem() {
  const [meteors, setMeteors] = useState<Array<{ id: number; type: string; delay: number }>>([]);

  const spawn = (type: string, count = 1) => {
    const newMeteors = Array.from({ length: count }, () => ({
      id: Math.random(),
      type,
      delay: Math.random() * 1000
    }));

    newMeteors.forEach(m => {
      setTimeout(() => {
        setMeteors(prev => [...prev, m]);
      }, m.delay);
    });
  };

  const removeMeteor = (id: number) => {
    setMeteors(prev => prev.filter(m => m.id !== id));
  };

  useEffect(() => {
    let active = true;
    const sequence = [
      { type: 'background_fall', delay: 1500 },
      { type: 'back_to_front', delay: 2000 },
      { type: 'right_to_left_cross', delay: 1800 },
      { type: 'background_fall', delay: 1200 },
      { type: 'right_to_left_front', delay: 2500 },
      { type: 'back_to_front', delay: 2000 },
      { type: 'shower', delay: 5000 }
    ];

    const run = async () => {
      let i = 0;
      while (active) {
        const event = sequence[i % sequence.length];
        if (event.type === 'shower') {
          spawn('right_to_left_cross', 6);
        } else {
          spawn(event.type, 1);
        }

        await new Promise(r => setTimeout(r, event.delay));
        i++;
      }
    };

    run();
    return () => { active = false; };
  }, []);

  return (
    <>
      {meteors.map(m => (
        <ShootingStar
          key={m.id}
          id={m.id}
          onComplete={removeMeteor}
          type={m.type}
        />
      ))}
    </>
  );
}

function SunLogo({ onSunClick }: { onSunClick?: () => void }) {
  const texture = useTexture('/backgroundless-logo.jpeg');
  return (
    <Billboard position={[0, 0, 0]}>
      <mesh
        onClick={onSunClick}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial map={texture} transparent opacity={1.0} depthWrite={false} />
      </mesh>
    </Billboard>
  );
}

interface OrbitRingProps {
  distance: number;
}

function OrbitRing({ distance }: OrbitRingProps) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      pts.push([Math.cos(theta) * distance, 0, Math.sin(theta) * distance]);
    }
    return pts;
  }, [distance]);

  return <Line points={points} color="#ffffff" transparent opacity={0.08} lineWidth={0.8} />;
}

interface PlanetProps {
  data: PlanetData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isMobile: boolean;
}

function Planet({ data, isSelected, onSelect, isMobile }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    angleRef.current += data.speed * delta;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * data.distance;
      groupRef.current.position.z = Math.sin(angleRef.current) * data.distance;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.5 * delta;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect(data.id); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshStandardMaterial
          color={data.color}
          roughness={0.4}
          metalness={0.2}
          emissive={data.color}
          emissiveIntensity={isSelected ? 0.8 : 0.2}
        />
      </mesh>
      <Html position={[0, data.size + 0.4, 0]} center distanceFactor={25}>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(data.id); }}
          className={`planet-tag ${isSelected ? 'active' : ''}`}
          style={{
            borderColor: data.color,
            color: isSelected ? '#fff' : 'rgba(255,255,255,0.9)',
            background: isSelected ? data.color : 'rgba(10, 5, 21, 0.75)',
            boxShadow: isSelected ? `0 0 15px ${data.color}` : 'none'
          }}
        >
          {isMobile ? data.mobileLabel : data.label}
        </button>
      </Html>
    </group>
  );
}

interface SolarSystemProps {
  selectedId: string | null;
  onSelectPlanet: (id: string) => void;
  visualProgressRef: React.MutableRefObject<number>;
  isMobile: boolean;
  onSunClick?: () => void;
}

function SolarSystem({ selectedId, onSelectPlanet, visualProgressRef, isMobile, onSunClick }: SolarSystemProps) {
  const systemRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!systemRef.current) return;
    const progress = visualProgressRef.current;
    if (progress < 0.6) {
      const p = progress / 0.6;
      systemRef.current.rotation.x = (1 - p) * 1.2;
      systemRef.current.position.y = (1 - p) * 10;
    } else {
      systemRef.current.rotation.x = 0;
      systemRef.current.position.y = 0;
    }
  });

  return (
    <group ref={systemRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffffff" distance={50} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <MeteorSystem />
      <SunLogo onSunClick={onSunClick} />
      {PLANETS_DATA.map(planet => (
        <React.Fragment key={planet.id}>
          <OrbitRing distance={planet.distance} />
          <Planet
            data={planet}
            isSelected={selectedId === planet.id}
            onSelect={onSelectPlanet}
            isMobile={isMobile}
          />
        </React.Fragment>
      ))}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minPolarAngle={Math.PI / 6}
      />
    </group>
  );
}

export interface HeroOrganicNetworkProps {
  onSunClick?: () => void;
  theme?: string;
  isLoaded?: boolean;
}

export function HeroOrganicNetwork({ onSunClick, theme = 'dark', isLoaded = false }: HeroOrganicNetworkProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefixDisplay, setPrefixDisplay] = useState('');

  const wrapperRef = useRef<HTMLDivElement>(null!);
  const bgContainerRef = useRef<HTMLDivElement>(null!);
  const canvasWrapRef = useRef<HTMLDivElement>(null!);
  const exploreTextRef = useRef<HTMLDivElement>(null!);
  const visualProgressRef = useRef(0);
  const prefixTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    let len = 0;
    const typeChar = () => {
      if (len < HERO_PREFIX.length) {
        len++;
        setPrefixDisplay(HERO_PREFIX.slice(0, len));
        prefixTimerRef.current = setTimeout(typeChar, PREFIX_SPEED);
      }
    };
    prefixTimerRef.current = setTimeout(typeChar, 400);
    return () => {
      if (prefixTimerRef.current) clearTimeout(prefixTimerRef.current);
    };
  }, [isLoaded]);

  useEffect(() => {
    const onScroll = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      const rawProgress = Math.max(0, Math.min(1, -rect.top / totalScrollable));

      visualProgressRef.current = rawProgress;

      if (bgContainerRef.current) {
        if (rawProgress > 0.05) {
          bgContainerRef.current.classList.add('hon-scrolled');
        } else {
          bgContainerRef.current.classList.remove('hon-scrolled');
        }
      }

      if (canvasWrapRef.current) {
        canvasWrapRef.current.style.opacity = String(Math.min(1, rawProgress * 2));
      }
      if (exploreTextRef.current) {
        exploreTextRef.current.style.opacity = String(Math.max(0, (rawProgress - 0.5) * 2));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const p1 = "Turn your business";
  const p2 = "chaos into";
  const p2Start = p1.length + 1;
  const l = prefixDisplay.length;
  const prefixDone = l >= HERO_PREFIX.length;

  return (
    <div ref={wrapperRef} className="hon-wrapper" style={{ height: '250vh', position: 'relative' }}>
      <div ref={bgContainerRef} className="hon-sticky" style={{ height: '100vh', position: 'sticky', top: 0, overflow: 'hidden' }}>
        {/* Floating Icons Background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.15 }}>
          {FLOAT_ICONS.map((iconKey, idx) => {
            const CustomComp = CUSTOM_ICONS[iconKey];
            const left = `${(idx * 7) % 95}%`;
            const top = `${(idx * 11) % 90}%`;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  transform: `scale(${(idx % 3) * 0.3 + 0.6})`,
                  animation: `float-anim ${10 + (idx % 5) * 3}s infinite ease-in-out`
                }}
              >
                {CustomComp ? (
                  <CustomComp size={24} color="#fff" />
                ) : (
                  <img src={`${CDN}${iconKey}.svg`} alt="" style={{ width: 24, height: 24, filter: 'invert(1)' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Hero Text Phase */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 20px',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        >
          <h1
            className="hero-title"
            style={{
              fontSize: isMobile ? '2.5rem' : '4rem',
              color: theme === 'dark' ? '#fff' : '#1A0A2E',
              margin: '20px 0',
              lineHeight: 1.1,
              minHeight: isMobile ? '8.5rem' : '13.5rem',
            }}
          >
            <span>{prefixDisplay.slice(0, Math.min(l, p1.length))}</span>
            {l > p1.length && <br />}
            <span>{prefixDisplay.slice(p1.length, Math.min(l, p2Start + p2.length))}</span>
            {l > p2Start + p2.length && <br />}
            {prefixDone ? (
              <span style={{ color: '#D4AF37' }}>
                <Typewriter words={HERO_CYCLING_WORDS} speed={80} delayBetweenWords={2200} />
              </span>
            ) : (
              l > p2Start + p2.length && <span style={{ opacity: 0 }}>.</span>
            )}
          </h1>

          <motion.div
            initial="hidden"
            animate={prefixDone ? 'visible' : 'hidden'}
          >
            <p className="hero-subtitle" style={{ color: theme === 'dark' ? '#aaa' : 'rgba(91,63,138,0.9)', fontSize: isMobile ? '1rem' : '1.2rem', marginBottom: '30px' }}>
              We uncover the bottlenecks slowing your business down and build custom AI &amp; ML,
              automation, and software systems that eliminate them.
            </p>
          </motion.div>
          <div className="scroll-indicator" style={{ marginTop: '40px' }}>
            <div className="scroll-line" style={{ width: '2px', height: '40px', background: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)', margin: '0 auto' }} />
          </div>
        </div>

        {/* 3D Canvas */}
        <div ref={canvasWrapRef} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: isMobile ? '85vh' : '100%', zIndex: 0,
          touchAction: 'pan-y', opacity: 0, transition: 'opacity 0.1s',
        }}>
          <Canvas camera={{ position: [0, 20, 35], fov: 45 }} style={{ touchAction: 'pan-y' }}>
            <React.Suspense fallback={null}>
              <SolarSystem selectedId={selectedId} onSelectPlanet={setSelectedId} visualProgressRef={visualProgressRef} isMobile={isMobile} onSunClick={onSunClick} />
            </React.Suspense>
          </Canvas>
        </div>

        {/* Foreground UI Overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          pointerEvents: 'none', display: 'flex', flexDirection: 'column', padding: '40px', zIndex: 3
        }}>
          <div ref={exploreTextRef} style={{
            opacity: 0, transition: 'opacity 0.5s',
            maxWidth: '600px', marginTop: '10vh', marginLeft: '5vw'
          }}>
            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', color: '#fff', fontWeight: 700, margin: '0 0 10px' }}>
              Built for <br />
              <span style={{ color: '#D4AF37' }}>every part of your business.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
              ① CLICK ANY PLANET TO EXPLORE
            </p>
          </div>
        </div>

        {/* Detail Modal when planet selected */}
        {selectedId && NODE_DETAILS[selectedId] && (
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '550px',
              background: 'rgba(10, 5, 21, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              padding: '24px',
              zIndex: 10,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                MODULE EXPLORER
              </span>
              <button
                onClick={() => setSelectedId(null)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}
              >
                ✕
              </button>
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: '0 0 8px' }}>
              {PLANETS_DATA.find(p => p.id === selectedId)?.label}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              {NODE_DETAILS[selectedId]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroOrganicNetwork;
