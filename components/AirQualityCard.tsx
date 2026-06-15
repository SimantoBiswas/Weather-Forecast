'use client';

import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import type { AirQuality } from '@/lib/types';
import { aqiLabel } from '@/lib/constants';

interface AirQualityCardProps {
  airQuality: AirQuality | null;
}

const POLLUTANTS = [
  { key: 'pm2_5', label: 'PM2.5', unit: 'µg/m³' },
  { key: 'pm10', label: 'PM10', unit: 'µg/m³' },
  { key: 'ozone', label: 'Ozone', unit: 'µg/m³' },
  { key: 'nitrogenDioxide', label: 'NO₂', unit: 'µg/m³' },
] as const;

export function AirQualityCard({ airQuality }: AirQualityCardProps) {
  const aqi = airQuality?.aqi ?? 0;
  const { label, color } = aqiLabel(aqi);

  // Gauge: semicircle from -90deg to 90deg, AQI 0-300+ scale
  const percentage = Math.min(aqi / 300, 1);
  const circumference = 2 * Math.PI * 70; // r = 70
  const halfCircumference = circumference / 2;
  const dashOffset = halfCircumference * (1 - percentage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="glass-panel flex flex-col gap-5 rounded-4xl p-6 transition-shadow duration-300 hover:shadow-glow-sm sm:p-8"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold sm:text-xl">Air Quality</h3>
        <Wind className="h-5 w-5 text-accent-cyan" />
      </div>

      <div className="relative mx-auto flex h-[120px] w-[180px] items-center justify-center">
        <svg viewBox="0 0 180 100" className="absolute inset-0">
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <motion.path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={halfCircumference}
            initial={{ strokeDashoffset: halfCircumference }}
            whileInView={{ strokeDashoffset: dashOffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="mt-8 flex flex-col items-center">
          <span className="font-display text-4xl font-bold text-white">{aqi || '–'}</span>
          <span className="text-xs uppercase tracking-wider text-slate-400">US AQI</span>
        </div>
      </div>

      <div className="text-center">
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{ color, backgroundColor: `${color}1A`, border: `1px solid ${color}40` }}
        >
          {label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
        {POLLUTANTS.map((p) => (
          <div key={p.key} className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-400">{p.label}</span>
            <span className="font-display text-sm font-semibold text-white">
              {airQuality ? Math.round(airQuality[p.key]) : '–'}
              <span className="ml-1 text-[10px] font-normal text-slate-500">{p.unit}</span>
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
