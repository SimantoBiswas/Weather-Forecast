'use client';

import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherInfo } from '@/lib/constants';
import type { DailyForecastItem } from '@/lib/types';
import { formatTemp, formatWeekday } from '@/lib/utils';

interface WeeklyForecastProps {
  days: DailyForecastItem[];
}

export function WeeklyForecast({ days }: WeeklyForecastProps) {
  // Find overall min/max for the temperature range bars
  const allTemps = days.flatMap((d) => [d.tempMin, d.tempMax]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = Math.max(globalMax - globalMin, 1);

  return (
    <motion.section
      id="forecast"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-4xl p-6 sm:p-8"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold sm:text-2xl">7-Day Forecast</h2>
        <span className="text-xs uppercase tracking-widest text-slate-500">Extended outlook</span>
      </div>

      <div className="flex flex-col gap-2">
        {days.slice(0, 7).map((day, i) => {
          const info = getWeatherInfo(day.weatherCode);
          const left = ((day.tempMin - globalMin) / range) * 100;
          const width = ((day.tempMax - day.tempMin) / range) * 100;

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="glass-panel flex flex-wrap items-center gap-4 rounded-2xl px-4 py-4 transition-shadow duration-300 hover:shadow-glow-sm sm:flex-nowrap"
            >
              {/* Day label */}
              <div className="w-20 shrink-0 font-medium text-white sm:text-sm">
                {formatWeekday(day.date, i)}
              </div>

              {/* Icon */}
              <div className="shrink-0">
                <WeatherIcon condition={info.condition} isDay size={32} />
              </div>

              {/* Precipitation chance */}
              <div className="flex shrink-0 items-center gap-1 text-xs text-sky-300">
                <Droplets className="h-3.5 w-3.5" />
                {Math.round(day.precipitationProbabilityMax)}%
              </div>

              {/* Temperature range bar */}
              <div className="order-last flex h-1.5 w-full min-w-[80px] flex-1 items-center overflow-hidden rounded-full bg-white/10 sm:order-none">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-blue via-accent-indigo to-accent-purple"
                  style={{ marginLeft: `${left}%`, width: `${Math.max(width, 6)}%` }}
                />
              </div>

              {/* Temperatures */}
              <div className="flex shrink-0 items-center gap-2 font-display text-sm font-semibold">
                <span className="text-white">{formatTemp(day.tempMax)}</span>
                <span className="text-slate-500">{formatTemp(day.tempMin)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
