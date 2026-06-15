'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  size: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
  opacity: number;
}

/**
 * Renders a field of slowly drifting, glowing particles for ambient depth.
 * Pure CSS/Framer Motion — no canvas needed, keeping it lightweight and
 * accessible (decorative, aria-hidden).
 *
 * Particle positions are randomised, so they are generated client-side only
 * (after mount) to avoid server/client hydration mismatches.
 */
export function ParticlesBackground({ count = 28 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 18 + 14,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.5 + 0.15,
      }))
    );
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            boxShadow: '0 0 8px rgba(139,92,246,0.6)',
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            opacity: [p.opacity, p.opacity * 1.6, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
