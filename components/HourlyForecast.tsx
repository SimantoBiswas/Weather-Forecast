'use client';

import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherInfo } from '@/lib/constants';
import type { HourlyForecastItem } from '@/lib/types';
import { formatHour, formatTemp } from '@/lib/utils';

interface HourlyForecastProps {
  hours: HourlyForecastItem[];
}

export function HourlyForecast({ hours }: HourlyForecastProps) {
  return (
    <motion.section
      id="hourly"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-4xl p-6 sm:p-8"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold sm:text-2xl">Hourly Forecast</h2>
        <span className="text-xs uppercase tracking-widest text-slate-500">Next 24 hours</span>
      </div>

      <div className="no-scrollbar -mx-2 flex gap-3 overflow-x-auto pb-2 pl-2 pr-2 snap-x snap-mandatory">
        {hours.map((hour, i) => {
          const info = getWeatherInfo(hour.weatherCode);
          return (
            <motion.div
              key={hour.time}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              whileHover={{ y: -6, scale: 1.04 }}
              className="glass-panel flex min-w-[92px] shrink-0 snap-start flex-col items-center gap-3 rounded-2xl px-4 py-5 transition-shadow duration-300 hover:shadow-glow-sm"
            >
              <span className="text-xs font-medium text-slate-400">
                {i === 0 ? 'Now' : formatHour(hour.time)}
              </span>
              <WeatherIcon condition={info.condition} isDay={hour.isDay} size={40} />
              <span className="font-display text-lg font-semibold text-white">
                {formatTemp(hour.temperature)}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-sky-300">
                <Droplets className="h-3 w-3" />
                {Math.round(hour.precipitationProbability)}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
