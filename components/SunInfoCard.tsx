'use client';

import { motion } from 'framer-motion';
import { Sunrise, Sunset, Gauge } from 'lucide-react';
import { uvLabel } from '@/lib/constants';
import { formatClock } from '@/lib/utils';

interface SunInfoCardProps {
  sunrise: string;
  sunset: string;
  currentTime: string;
  uvIndex: number;
}

export function SunInfoCard({ sunrise, sunset, currentTime, uvIndex }: SunInfoCardProps) {
  const sunriseMs = new Date(sunrise).getTime();
  const sunsetMs = new Date(sunset).getTime();
  const nowMs = new Date(currentTime).getTime();

  const dayLength = Math.max(sunsetMs - sunriseMs, 1);
  const progress = Math.min(Math.max((nowMs - sunriseMs) / dayLength, 0), 1);

  // Arc path: half circle, sun travels along it based on progress
  const angle = Math.PI * (1 - progress); // PI -> 0
  const radius = 70;
  const cx = 90;
  const cy = 90;
  const sunX = cx - radius * Math.cos(angle);
  const sunY = cy - radius * Math.sin(angle);

  const { label: uvLabelText, color: uvColor } = uvLabel(uvIndex);
  const uvPercentage = Math.min(uvIndex / 11, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      whileHover={{ y: -4 }}
      className="glass-panel flex flex-col gap-6 rounded-4xl p-6 transition-shadow duration-300 hover:shadow-glow-sm sm:p-8"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold sm:text-xl">Sun &amp; UV</h3>
      </div>

      <div className="relative mx-auto h-[110px] w-[180px]">
        <svg viewBox="0 0 180 100" className="absolute inset-0 h-full w-full">
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
            strokeDasharray="4 6"
          />
          <line x1="20" y1="90" x2="160" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        </svg>
        <motion.div
          className="absolute h-4 w-4 rounded-full bg-amber-300"
          style={{
            left: sunX,
            top: sunY,
            boxShadow: '0 0 18px rgba(252,211,77,0.9)',
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute bottom-0 left-0 flex items-center gap-1.5 text-xs text-slate-400">
          <Sunrise className="h-4 w-4 text-orange-300" />
          {formatClock(sunrise)}
        </div>
        <div className="absolute bottom-0 right-0 flex items-center gap-1.5 text-xs text-slate-400">
          {formatClock(sunset)}
          <Sunset className="h-4 w-4 text-violet-300" />
        </div>
      </div>

      <div className="border-t border-white/5 pt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Gauge className="h-4 w-4 text-accent-violet" /> UV Index
          </span>
          <span className="font-display text-lg font-semibold text-white">
            {uvIndex.toFixed(1)}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: uvColor, boxShadow: `0 0 12px ${uvColor}` }}
            initial={{ width: 0 }}
            whileInView={{ width: `${uvPercentage * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="mt-1.5 text-right text-xs font-medium" style={{ color: uvColor }}>
          {uvLabelText}
        </div>
      </div>
    </motion.div>
  );
}
