'use client';

import { motion } from 'framer-motion';
import type { WeatherCondition } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WeatherIconProps {
  condition: WeatherCondition;
  isDay?: boolean;
  className?: string;
  size?: number;
}

/**
 * Renders an animated SVG icon matching the given weather condition.
 * Each condition has bespoke Framer Motion choreography (rotating sun,
 * drifting clouds, falling rain/snow, flashing lightning, etc.).
 */
export function WeatherIcon({
  condition,
  isDay = true,
  className,
  size = 64,
}: WeatherIconProps) {
  const wrapperClass = cn('inline-block', className);

  switch (condition) {
    case 'clear':
    case 'mainly-clear':
      return isDay ? (
        <SunIcon size={size} className={wrapperClass} partial={condition === 'mainly-clear'} />
      ) : (
        <MoonIcon size={size} className={wrapperClass} />
      );
    case 'cloudy':
      return <CloudIcon size={size} className={wrapperClass} />;
    case 'fog':
      return <FogIcon size={size} className={wrapperClass} />;
    case 'drizzle':
    case 'rain':
      return <RainIcon size={size} className={wrapperClass} heavy={condition === 'rain'} />;
    case 'snow':
      return <SnowIcon size={size} className={wrapperClass} />;
    case 'thunderstorm':
      return <ThunderIcon size={size} className={wrapperClass} />;
    default:
      return <SunIcon size={size} className={wrapperClass} />;
  }
}

function SunIcon({
  size,
  className,
  partial,
}: {
  size: number;
  className?: string;
  partial?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE9A8" />
          <stop offset="100%" stopColor="#FFB347" />
        </radialGradient>
      </defs>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        style={{ originX: '50px', originY: '50px' }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x="47"
            y="4"
            width="6"
            height="14"
            rx="3"
            fill="#FFC75F"
            transform={`rotate(${i * 45} 50 50)`}
            opacity={0.85}
          />
        ))}
      </motion.g>
      <motion.circle
        cx="50"
        cy="50"
        r="22"
        fill="url(#sunGlow)"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '50px', originY: '50px' }}
      />
      {partial && <circle cx="64" cy="40" r="18" fill="#0a0d1f" opacity={0.35} />}
    </svg>
  );
}

function MoonIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E6E9FF" />
          <stop offset="100%" stopColor="#A5B4FC" />
        </radialGradient>
      </defs>
      <motion.path
        d="M62 18a32 32 0 1 0 20 38 26 26 0 0 1-20-38z"
        fill="url(#moonGlow)"
        animate={{ rotate: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '50px', originY: '50px' }}
      />
      {[[34, 32, 2.2], [44, 46, 1.4], [30, 56, 1.8], [62, 64, 1.2]].map(([cx, cy, r], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="#fff"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
    </svg>
  );
}

function CloudIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6ECFF" />
          <stop offset="100%" stopColor="#A9B7E8" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="34"
        cy="38"
        r="14"
        fill="#FFE9A8"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.g
        animate={{ x: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="46" cy="62" rx="28" ry="16" fill="url(#cloudGrad)" />
        <circle cx="34" cy="54" r="14" fill="url(#cloudGrad)" />
        <circle cx="58" cy="50" r="18" fill="url(#cloudGrad)" />
      </motion.g>
    </svg>
  );
}

function FogIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="40" r="16" fill="#FFE9A8" opacity={0.5} />
      {[34, 46, 58, 70].map((y, i) => (
        <motion.rect
          key={y}
          x="18"
          y={y}
          width="64"
          height="6"
          rx="3"
          fill="#C7D2FE"
          opacity={0.6}
          animate={{ x: [18 - (i % 2) * 6, 18 + (i % 2) * 6, 18 - (i % 2) * 6] }}
          transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

function RainIcon({
  size,
  className,
  heavy,
}: {
  size: number;
  className?: string;
  heavy?: boolean;
}) {
  const drops = heavy ? 6 : 4;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rainCloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CBD5F5" />
          <stop offset="100%" stopColor="#8E9BCB" />
        </linearGradient>
      </defs>
      <ellipse cx="46" cy="40" rx="28" ry="16" fill="url(#rainCloud)" />
      <circle cx="34" cy="32" r="14" fill="url(#rainCloud)" />
      <circle cx="58" cy="30" r="18" fill="url(#rainCloud)" />
      {Array.from({ length: drops }).map((_, i) => (
        <motion.line
          key={i}
          x1={26 + i * (48 / drops)}
          y1="58"
          x2={22 + i * (48 / drops)}
          y2="70"
          stroke="#7DD3FC"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ y1: [54, 90], y2: [66, 102], opacity: [1, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeIn',
            delay: i * 0.18,
          }}
        />
      ))}
    </svg>
  );
}

function SnowIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="snowCloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#A9B7E8" />
        </linearGradient>
      </defs>
      <ellipse cx="46" cy="36" rx="28" ry="16" fill="url(#snowCloud)" />
      <circle cx="34" cy="28" r="14" fill="url(#snowCloud)" />
      <circle cx="58" cy="26" r="18" fill="url(#snowCloud)" />
      {[[30, 60], [50, 70], [68, 58], [40, 84]].map(([x, y], i) => (
        <motion.text
          key={i}
          x={x}
          y={y}
          fontSize="12"
          fill="#F0F9FF"
          textAnchor="middle"
          animate={{ y: [y - 6, y + 18], opacity: [1, 0], rotate: [0, 90] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeIn', delay: i * 0.5 }}
        >
          ❄
        </motion.text>
      ))}
    </svg>
  );
}

function ThunderIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="stormCloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A1A8C7" />
          <stop offset="100%" stopColor="#5B6394" />
        </linearGradient>
      </defs>
      <ellipse cx="46" cy="36" rx="28" ry="16" fill="url(#stormCloud)" />
      <circle cx="34" cy="28" r="14" fill="url(#stormCloud)" />
      <circle cx="58" cy="26" r="18" fill="url(#stormCloud)" />
      <motion.path
        d="M52 44 L40 66 L50 66 L42 88 L64 58 L52 58 Z"
        fill="#FACC15"
        animate={{ opacity: [0.3, 1, 0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}
