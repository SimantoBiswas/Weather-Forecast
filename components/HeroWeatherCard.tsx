'use client';

import { motion } from 'framer-motion';
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Thermometer,
  MapPin,
} from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherInfo } from '@/lib/constants';
import type { CurrentWeather, GeoLocation } from '@/lib/types';
import {
  formatLongDate,
  formatTemp,
  formatVisibility,
  formatWindSpeed,
  windDirectionLabel,
} from '@/lib/utils';

interface HeroWeatherCardProps {
  location: GeoLocation;
  current: CurrentWeather;
}

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function HeroWeatherCard({ location, current }: HeroWeatherCardProps) {
  const weatherInfo = getWeatherInfo(current.weatherCode);

  const stats = [
    {
      label: 'Feels Like',
      value: formatTemp(current.apparentTemperature),
      icon: Thermometer,
      color: 'text-orange-300',
    },
    {
      label: 'Humidity',
      value: `${Math.round(current.humidity)}%`,
      icon: Droplets,
      color: 'text-sky-300',
    },
    {
      label: 'Wind',
      value: `${formatWindSpeed(current.windSpeed)} ${windDirectionLabel(current.windDirection)}`,
      icon: Wind,
      color: 'text-emerald-300',
    },
    {
      label: 'Pressure',
      value: `${Math.round(current.pressure)} hPa`,
      icon: Gauge,
      color: 'text-violet-300',
    },
    {
      label: 'Visibility',
      value: formatVisibility(current.visibility),
      icon: Eye,
      color: 'text-cyan-300',
    },
  ];

  return (
    <motion.section
      id="overview"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-panel glass-panel-hover relative rounded-4xl p-6 sm:p-10"
    >
      <div className="gradient-border absolute inset-0 rounded-4xl" />

      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: location + temperature */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="h-4 w-4 text-accent-violet" />
            <span>
              {location.name}
              {location.country ? `, ${location.country}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="drop-shadow-[0_0_30px_rgba(139,92,246,0.35)]"
            >
              <WeatherIcon
                condition={weatherInfo.condition}
                isDay={current.isDay}
                size={104}
              />
            </motion.div>
            <div>
              <div className="font-display text-6xl font-semibold tracking-tight sm:text-7xl">
                {formatTemp(current.temperature)}
              </div>
              <div className="mt-1 text-base font-medium text-slate-300 sm:text-lg">
                {weatherInfo.label}
              </div>
            </div>
          </div>

          <p className="max-w-sm text-sm text-slate-400">{formatLongDate(current.time)}</p>
        </div>

        {/* Right: stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[420px]">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4, scale: 1.03 }}
              className="glass-panel flex flex-col gap-2 rounded-2xl px-4 py-4 transition-shadow duration-300 hover:shadow-glow-sm"
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <div className="text-lg font-semibold text-white">{stat.value}</div>
              <div className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
