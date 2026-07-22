"use client";
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Billboard, useTexture } from '@react-three/drei';
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

function ShootingStar({ id, onComplete, type }: { id: number; onComplete: (id: number) => void; type: string }) {
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
    <group
      onClick={(e) => { e.stopPropagation(); if (onSunClick) onSunClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <mesh>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshStandardMaterial
          color="#fdecc0"
          emissive="#fcd98a"
          emissiveIntensity={3.2}
          toneMapped={false}
        />
      </mesh>

      <Billboard follow={true}>
        <mesh position={[0, 0, 2.85]}>
          <planeGeometry args={[3.8, 3.8]} />
          <meshBasicMaterial
            map={texture}
            transparent={true}
            depthTest={true}
            depthWrite={false}
            color="#fffbeb"
          />
        </mesh>
      </Billboard>
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.04, radius + 0.04, 64]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} />
    </mesh>
  );
}

interface PlanetProps {
  data: PlanetData;
  isSelected: boolean;
  onClick: (id: string) => void;
  registerRef: (id: string, ref: THREE.Group | null) => void;
  visualProgressRef?: React.MutableRefObject<number>;
  isMobile: boolean;
  index: number;
}

function Planet({ data, isSelected, onClick, registerRef, visualProgressRef, isMobile, index }: PlanetProps) {
  const ref = useRef<THREE.Group>(null!);
  const labelRef = useRef<HTMLDivElement>(null!);
  const initialAngle = useMemo(() => (index / PLANETS_DATA.length) * Math.PI * 2, [index]);

  const angleRef = useRef(initialAngle);

  useFrame((_, delta) => {
    if (!ref.current) return;

    const currentSpeed = isSelected ? data.speed * 0.1 : data.speed;
    angleRef.current += delta * currentSpeed;

    ref.current.position.x = Math.cos(angleRef.current) * data.distance;
    ref.current.position.z = Math.sin(angleRef.current) * data.distance;
    ref.current.rotation.y += isSelected ? 0.01 : 0.005;

    if (labelRef.current && visualProgressRef) {
      const vp = visualProgressRef.current;
      labelRef.current.style.opacity = isSelected ? '0' : (vp > 0.4 ? '1' : '0');
    }
  });

  return (
    <group ref={(node) => { ref.current = node!; registerRef(data.id, node); }}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(data.id); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[data.size, 64, 64]} />
        <meshStandardMaterial
          color={data.color}
          roughness={0.3}
          metalness={0.7}
          emissive={data.color}
          emissiveIntensity={isSelected ? 0.6 : 0.2}
        />
      </mesh>

      <Html position={[0, data.size + 0.8, 0]} center style={{ pointerEvents: 'none' }}>
        <div ref={labelRef} style={{
          opacity: 0,
          transition: 'opacity 0.3s',
          color: 'rgba(255,255,255,0.9)',
          fontSize: isMobile ? '10px' : '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          background: 'rgba(0,0,0,0.6)',
          padding: isMobile ? '2px 6px' : '4px 10px',
          borderRadius: '6px',
          backdropFilter: 'blur(4px)',
          whiteSpace: 'nowrap',
          border: `1px solid ${data.color}44`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {isMobile ? data.mobileLabel : data.label}
        </div>
      </Html>
    </group>
  );
}

interface SolarSystemProps {
  selectedId: string | null;
  onSelectPlanet: (id: string) => void;
  visualProgressRef?: React.MutableRefObject<number>;
  isMobile: boolean;
  onSunClick?: () => void;
}

function SolarSystem({ selectedId, onSelectPlanet, visualProgressRef, isMobile, onSunClick }: SolarSystemProps) {
  const planetsRef = useRef<Record<string, THREE.Group | null>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const vp = visualProgressRef ? visualProgressRef.current : 0;
    const mobileScaleFactor = isMobile ? 0.7 : 1.0;
    const targetScale = vp < 0.4 ? 0 : Math.min(mobileScaleFactor, (vp - 0.4) / 0.3 * mobileScaleFactor);
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    const controls = controlsRef.current;
    if (!controls) return;

    if (selectedId && planetsRef.current[selectedId]) {
      const planet = planetsRef.current[selectedId];
      if (planet) {
        const targetPos = new THREE.Vector3();
        planet.getWorldPosition(targetPos);

        const orbitDir = targetPos.clone().normalize();
        if (orbitDir.length() < 0.1) orbitDir.set(1, 0, 0);

        const cameraDist = 5;
        const cameraHeight = 1.5;
        const desiredCameraPos = targetPos.clone().add(orbitDir.multiplyScalar(cameraDist));
        desiredCameraPos.y += cameraHeight;

        state.camera.position.lerp(desiredCameraPos, 0.05);
        controls.target.lerp(targetPos, 0.05);
      }
    } else {
      const defaultCameraPos = new THREE.Vector3(0, 20, 35);
      state.camera.position.lerp(defaultCameraPos, 0.03);
      controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.03);
    }
    controls.update();
  });

  return (
    <group ref={groupRef} position={isMobile ? [0, -5, 0] : [0, 0, 0]}>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        enableRotate={!isMobile}
        maxDistance={60}
        minDistance={5}
      />

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={300} color="#ffedd5" distance={150} />

      <MeteorSystem />

      <SunLogo onSunClick={onSunClick} />

      {PLANETS_DATA.map((planet, index) => (
        <group key={planet.id}>
          <OrbitRing radius={planet.distance} />
          <Planet
            data={planet}
            isSelected={selectedId === planet.id}
            onClick={onSelectPlanet}
            registerRef={(id, ref) => { planetsRef.current[id] = ref; }}
            visualProgressRef={visualProgressRef}
            isMobile={isMobile}
            index={index}
          />
        </group>
      ))}

      <Stars radius={100} depth={50} count={14000} factor={4.5} saturation={0} fade speed={1} />
    </group>
  );
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.95,
      delay: 0.15 + i * 0.15,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

interface ParticleItem {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  burstStartTime?: number;
}

export interface HeroOrganicNetworkProps {
  onSunClick?: () => void;
  theme?: string;
  isLoaded?: boolean;
}

export function HeroOrganicNetwork({ onSunClick, theme = 'dark', isLoaded = false }: HeroOrganicNetworkProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPlanet = PLANETS_DATA.find(p => p.id === selectedId);

  const wrapperRef = useRef<HTMLDivElement>(null!);
  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);
  const particlesRef = useRef<ParticleItem[]>([]);
  const progressRef = useRef(0);
  const visualProgressRef = useRef(0);
  const heroTextRef = useRef<HTMLDivElement>(null!);
  const exploreTextRef = useRef<HTMLDivElement>(null!);
  const canvasWrapRef = useRef<HTMLDivElement>(null!);
  const selectedIdRef = useRef(selectedId);
  const themeRef = useRef(theme);
  const bgContainerRef = useRef<HTMLDivElement>(null!);
  const burstTriggeredRef = useRef(false);
  const isLoadedRef = useRef(isLoaded);

  const [prefixDisplay, setPrefixDisplay] = useState('');
  const prefixTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    themeRef.current = theme;
    if (theme === 'light') burstTriggeredRef.current = false;
  }, [theme]);

  useEffect(() => {
    isLoadedRef.current = isLoaded;
  }, [isLoaded]);

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
    const W = window.innerWidth, H = window.innerHeight;
    const iconCount = isMobile ? 12 : FLOAT_ICONS.length;
    const icons = FLOAT_ICONS.slice(0, iconCount);
    const cols = Math.ceil(Math.sqrt(icons.length));
    const rows = Math.ceil(icons.length / cols);
    const cellW = (W - (isMobile ? 60 : 160)) / cols;
    const cellH = (H - (isMobile ? 60 : 160)) / rows;

    const getZones = () => isMobile ? [
      { w: 320, h: 480, y: 0 }
    ] : [
      { w: 180, h: 50, y: -200 },
      { w: 720, h: 90, y: -120 },
      { w: 600, h: 90, y: -40 },
      { w: 500, h: 90, y: 40 },
      { w: 850, h: 160, y: 160 },
      { w: 320, h: 70, y: 280 }
    ];

    particlesRef.current = icons.map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      let hX = (isMobile ? 30 : 80) + col * cellW + cellW * 0.5 + (Math.random() - 0.5) * cellW * 0.3;
      const hY = (isMobile ? 30 : 80) + row * cellH + cellH * 0.5 + (Math.random() - 0.5) * cellH * 0.3;

      const zones = getZones();
      zones.forEach(z => {
        const dx = hX - W / 2;
        const dy = hY - (H / 2 + z.y);
        if (Math.abs(dx) < z.w / 2 && Math.abs(dy) < z.h / 2) {
          hX = W / 2 + (dx > 0 ? z.w / 2 + 40 : -(z.w / 2 + 40));
        }
      });

      return {
        homeX: hX,
        homeY: hY,
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      };
    });
  }, [isMobile]);

  useEffect(() => {
    const onScroll = () => {
      if (selectedIdRef.current) return;
      const w = wrapperRef.current;
      if (!w) return;
      const total = w.scrollHeight - window.innerHeight;
      const p = total > 0 ? clamp(-w.getBoundingClientRect().top / total, 0, 1) : 0;
      progressRef.current = p;
      if (bgContainerRef.current) {
        bgContainerRef.current.classList.toggle('hon-scrolled', p > 0.05);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!selectedIdRef.current) return;
      e.preventDefault();
      setSelectedId(null);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!selectedIdRef.current) return;
      e.preventDefault();
      setSelectedId(null);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const W = window.innerWidth;
      const H = window.innerHeight;
      const cx = W / 2;
      const cy = H / 2;
      const p = progressRef.current;

      const targetVisual = p > 0.1 ? 1 : (p < 0.05 ? 0 : visualProgressRef.current);
      visualProgressRef.current += (targetVisual - visualProgressRef.current) * 0.015;
      const vp = visualProgressRef.current;

      const convergeT = clamp(vp / 0.4, 0, 1);
      const easeConverge = easeInOutCubic(convergeT);

      if (!burstTriggeredRef.current && easeConverge > 0.88) {
        burstTriggeredRef.current = true;
        particlesRef.current.forEach((pt, i) => {
          pt.burstStartTime = performance.now() + i * 30;
        });
      }

      particlesRef.current.forEach((pt, i) => {
        pt.vx += (Math.random() - 0.5) * 0.05;
        pt.vy += (Math.random() - 0.5) * 0.05;

        particlesRef.current.forEach((other, j) => {
          if (i === j) return;
          const dx = pt.homeX - other.homeX;
          const dy = pt.homeY - other.homeY;
          const distSq = dx * dx + dy * dy;
          const minDist = 100;
          if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq) || 1;
            const force = (minDist - dist) * 0.002;
            pt.vx += (dx / dist) * force;
            pt.vy += (dy / dist) * force;
          }
        });

        const zones = isMobile ? [
          { w: 340, h: 500, y: 0 }
        ] : [
          { w: 200, h: 60, y: -200 },
          { w: 750, h: 100, y: -120 },
          { w: 620, h: 100, y: -40 },
          { w: 520, h: 100, y: 40 },
          { w: 880, h: 180, y: 160 },
          { w: 350, h: 90, y: 280 }
        ];

        zones.forEach(z => {
          const zcx = cx;
          const zcy = cy + z.y;
          const dx = pt.homeX - zcx;
          const dy = pt.homeY - zcy;
          if (Math.abs(dx) < z.w / 2 && Math.abs(dy) < z.h / 2) {
            const pushForce = 0.15;
            pt.vx += dx > 0 ? pushForce : -pushForce;
            pt.vy += dy > 0 ? pushForce : -pushForce;
          }
        });

        pt.vx = clamp(pt.vx * 0.97, -1.2, 1.2);
        pt.vy = clamp(pt.vy * 0.97, -1.2, 1.2);
        pt.homeX = clamp(pt.homeX + pt.vx, 40, W - 40);
        pt.homeY = clamp(pt.homeY + pt.vy, 40, H - 40);

        pt.x = lerp(pt.homeX, cx, easeConverge);
        pt.y = lerp(pt.homeY, cy, easeConverge);

        const el = iconRefs.current[i];
        if (el) {
          let burstScale = 1;
          if (pt.burstStartTime !== undefined) {
            const elapsed = performance.now() - pt.burstStartTime;
            if (elapsed > 0 && elapsed < 480) {
              burstScale = 1 + Math.sin((elapsed / 480) * Math.PI) * 1.15;
            }
          }
          el.style.transform = `translate(${pt.x}px,${pt.y}px) translate(-50%,-50%) scale(${burstScale.toFixed(3)})`;
          el.style.opacity = Math.max(0, 0.85 - (easeConverge * 0.85)).toFixed(3);
        }
      });

      if (heroTextRef.current) {
        const heroOp = isLoadedRef.current ? clamp(1 - (vp / 0.2), 0, 1) : 1;
        heroTextRef.current.style.opacity = heroOp.toFixed(3);
        heroTextRef.current.style.pointerEvents = heroOp > 0.5 ? 'auto' : 'none';
        if (canvasWrapRef.current) {
          const canvasOp = isLoadedRef.current ? clamp(1 - heroOp, 0, 1) : 0;
          canvasWrapRef.current.style.opacity = canvasOp.toFixed(3);
        }
      }

      if (exploreTextRef.current) {
        exploreTextRef.current.style.opacity = (vp > 0.7 && !selectedIdRef.current) ? '1' : '0';
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  const iconCount = isMobile ? 12 : FLOAT_ICONS.length;
  const icons = FLOAT_ICONS.slice(0, iconCount);

  return (
    <div ref={wrapperRef} className="hon-wrapper" style={{ height: '250vh' }}>
      <div ref={bgContainerRef} className="hon-sticky" style={{ height: '100vh', position: 'sticky', top: 0, overflow: 'hidden' }}>

        {/* Floating Icons */}
        {icons.map((iconKey, i) => {
          const CustomComp = CUSTOM_ICONS[iconKey];
          return (
            <div
              key={i}
              ref={el => { iconRefs.current[i] = el; }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                willChange: 'transform, opacity',
                opacity: 0.85,
                zIndex: 1
              }}
            >
              {CustomComp ? (
                <CustomComp size={24} color="#ffffff" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.7))' }} />
              ) : (
                <img
                  src={`${CDN}${iconKey}.svg`}
                  alt=""
                  style={{
                    width: 24,
                    height: 24,
                    filter: 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.7))'
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Phase 0: Hero Copy */}
        <div ref={heroTextRef} className="hon-hero-text" style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center', zIndex: 10
        }}>
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
            {(() => {
              const p1 = "Turn your business";
              const p2 = "chaos into";
              const p2Start = p1.length + 1;
              const l = prefixDisplay.length;
              const prefixDone = l >= HERO_PREFIX.length;

              const p1Shown  = prefixDisplay.slice(0, Math.min(l, p1.length));
              const nl1Shown = l > p1.length;
              const p2Shown  = nl1Shown
                ? p2.slice(0, Math.min(l - p2Start, p2.length))
                : '';
              const nl2Shown = l >= p2Start + p2.length + 1;

              const cursor = (isLoaded && !prefixDone)
                ? <span className="typewriter-cursor" aria-hidden="true">|</span>
                : null;

              return (
                <>
                  {p1Shown}
                  {!nl1Shown && cursor}

                  {nl1Shown && (
                    <>
                      <br />
                      <em style={{ color: '#fbbf24', fontStyle: 'normal' }}>
                        {p2Shown}
                        {!nl2Shown && cursor}
                      </em>
                    </>
                  )}

                  {nl2Shown && (
                    <>
                      <br />
                      <Typewriter
                        words={HERO_CYCLING_WORDS}
                        speed={65}
                        deleteSpeed={35}
                        delayBetweenWords={1800}
                        cursorChar="|"
                      />
                    </>
                  )}
                </>
              );
            })()}
          </h1>

          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate={prefixDisplay.length >= HERO_PREFIX.length ? 'visible' : 'hidden'}
          >
            <p className="hero-subtitle" style={{ color: theme === 'dark' ? '#aaa' : 'rgba(91,63,138,0.9)', fontSize: isMobile ? '1rem' : '1.2rem', marginBottom: '30px' }}>
              We uncover the bottlenecks slowing your business down and build custom AI &amp; ML,
              automation, and software systems that eliminate them.
            </p>
          </motion.div>
          <div className="scroll-indicator" style={{ marginTop: '40px' }}><div className="scroll-line" style={{ width: '2px', height: '40px', background: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)', margin: '0 auto' }} /></div>
        </div>

        {/* 3D Canvas — hidden during hero text phase, fades in as user scrolls */}
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
            <h1 style={{ fontSize: isMobile ? '2.5rem' : '4rem', color: '#fff', margin: 0, lineHeight: 1.1, fontFamily: 'Inter, sans-serif' }}>
              Built for <br /><span style={{ color: '#fbbf24' }}>every part of your business.</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '28px', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              Click any planet to explore
            </p>
          </div>

          {/* Planet Story UI */}
          <div style={{
            position: 'absolute', bottom: '10vh', left: '5vw',
            opacity: selectedId ? 1 : 0, transition: 'opacity 0.5s', transform: selectedId ? 'translateY(0)' : 'translateY(20px)',
            maxWidth: '500px', background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(16px)',
            padding: '40px', borderRadius: '24px', border: `1px solid ${selectedPlanet?.color || '#fff'}44`,
            pointerEvents: selectedId ? 'auto' : 'none',
            boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 40px ${selectedPlanet?.color || '#fff'}11`
          }}>
            {selectedPlanet && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '6px', height: '40px', borderRadius: '3px',
                    background: selectedPlanet.color,
                    flexShrink: 0
                  }} />
                  <h2 style={{ color: selectedPlanet.color, fontSize: isMobile ? '1.5rem' : '2.5rem', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                    {isMobile ? selectedPlanet.mobileLabel : selectedPlanet.label}
                  </h2>
                </div>

                <p style={{ color: '#fff', fontSize: '1.2rem', lineHeight: 1.6, margin: '0 0 32px 0', fontFamily: 'Inter, sans-serif' }}>
                  {selectedId && NODE_DETAILS[selectedId]}
                </p>

                <button
                  onClick={() => setSelectedId(null)}
                  style={{
                    background: 'none', border: `1px solid ${selectedPlanet.color}`,
                    color: '#fff', padding: '12px 24px', borderRadius: '30px', fontSize: '1rem', cursor: 'pointer',
                    transition: 'all 0.2s', fontWeight: 'bold', fontFamily: 'Inter, sans-serif'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = selectedPlanet.color; e.currentTarget.style.color = '#000'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#fff'; }}
                >
                  ← Back to Solar System
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroOrganicNetwork;
