"use client";
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export interface PhysicsItem {
  id: string;
  text: string;
  width: number;
  height: number;
  cls: string;
}

export interface BodyPosition {
  x: number;
  y: number;
  angle: number;
}

const PhysicsOverlay: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null!);

  const items: PhysicsItem[] = useRef<PhysicsItem[]>([
    { id: 'item1', text: 'caratsense AI.', width: 400, height: 60, cls: 'physics-text bold' },
    { id: 'item2', text: 'WhatsApp automation', width: 460, height: 60, cls: 'physics-text silver' },
    { id: 'item3', text: 'tally integration', width: 400, height: 60, cls: 'physics-text' },
    { id: 'item4', text: 'demand forecasting', width: 430, height: 60, cls: 'physics-text silver' },
    { id: 'item5', text: 'zero owner-dependency', width: 500, height: 60, cls: 'physics-text' },
  ]).current;

  const [positions, setPositions] = useState<Record<string, BodyPosition>>({});

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint,
          Events = Matter.Events;

    const engine = Engine.create({
      gravity: { x: 0, y: 0, scale: 0 }
    });

    const world = engine.world;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent'
      }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const wallOptions = { 
      isStatic: true, 
      restitution: 0.8,
      render: { visible: false } 
    };

    const width = window.innerWidth;
    const height = window.innerHeight;
    const wallThickness = 100;

    Composite.add(world, [
      Bodies.rectangle(width / 2, -wallThickness/2, width, wallThickness, wallOptions),
      Bodies.rectangle(width / 2, height + wallThickness/2, width, wallThickness, wallOptions),
      Bodies.rectangle(width + wallThickness/2, height / 2, wallThickness, height, wallOptions),
      Bodies.rectangle(-wallThickness/2, height / 2, wallThickness, height, wallOptions)
    ]);

    const bodies: Matter.Body[] = [];
    const initialPositions: Record<string, BodyPosition> = {};

    items.forEach((item) => {
      const x = Math.max(200, Math.random() * (width - 200));
      const y = Math.max(100, Math.random() * (height - 100));
      
      const body = Bodies.rectangle(x, y, item.width, item.height, {
        restitution: 0.9,
        frictionAir: 0.02,
        friction: 0.1,
        render: { visible: false }
      });

      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

      body.label = item.id;
      bodies.push(body);
      initialPositions[item.id] = { x, y, angle: 0 };
    });

    Composite.add(world, bodies);
    setPositions(initialPositions);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Composite.add(world, mouseConstraint);

    render.mouse = mouse;

    let mousePos = { x: -1000, y: -1000 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Events.on(mouseConstraint, 'mousemove', (e: any) => {
      mousePos = e.mouse.position;
    });

    Events.on(engine, 'beforeUpdate', () => {
      const bodiesInWorld = Composite.allBodies(world).filter(b => !b.isStatic);
      
      bodiesInWorld.forEach(body => {
        if (body.speed < 0.2) {
          Matter.Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.0001,
            y: (Math.random() - 0.5) * 0.0001
          });
        }

        if (mousePos.x > 0 && mousePos.y > 0) {
          const dx = body.position.x - mousePos.x;
          const dy = body.position.y - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const forceMagnitude = 0.0005 * (200 - distance); 
            Matter.Body.applyForce(body, body.position, {
              x: (dx / distance) * forceMagnitude,
              y: (dy / distance) * forceMagnitude
            });
          }
        }
      });
    });

    Events.on(engine, 'afterUpdate', () => {
      const newPos: Record<string, BodyPosition> = {};
      bodies.forEach(body => {
        newPos[body.label] = {
          x: body.position.x,
          y: body.position.y,
          angle: body.angle
        };
      });
      setPositions(newPos);
    });

    const handleResize = () => {
      if (!render.canvas) return;
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, [items]);

  return (
    <>
      <div 
        ref={sceneRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 50
        }} 
      />

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}>
        {items.map(item => {
          const pos = positions[item.id];
          if (!pos) return null;

          return (
            <div
              key={item.id}
              className={item.cls}
              style={{
                transform: `translate(${pos.x - item.width / 2}px, ${pos.y - item.height / 2}px) rotate(${pos.angle}rad)`,
                width: item.width,
                height: item.height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                willChange: 'transform'
              }}
            >
              {item.text}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PhysicsOverlay;
