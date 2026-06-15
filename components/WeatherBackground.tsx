'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BACKGROUND_THEMES } from '@/lib/constants';
import type { WeatherCondition } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  isDay: boolean;
}

/**
 * Full-viewport animated background. The gradient direction/colors swap
 * based on the active weather condition and time of day, with soft
 * aurora-style blobs drifting slowly behind the content.
 */
export function WeatherBackground({ condition, isDay }: WeatherBackgroundProps) {
  const theme = BACKGROUND_THEMES[condition] ?? BACKGROUND_THEMES.clear;
  const gradient = isDay ? theme.day : theme.night;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-base-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${condition}-${isDay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className={cn('absolute inset-0 bg-gradient-to-br', gradient)}
        />
      </AnimatePresence>

      {/* Aurora-style ambient blobs */}
      <div className="absolute inset-0 bg-aurora-gradient opacity-80" />

      <motion.div
        className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-accent-indigo/30 blur-[100px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-0 top-0 h-96 w-96 rounded-full bg-accent-purple/25 blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-accent-cyan/15 blur-[110px]"
        animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle grid overlay for a futuristic dashboard feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-950/80" />
    </div>
  );
}
