'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { useTheme } from '@/hooks/useTheme';
import { getWeatherInfo } from '@/lib/constants';
import { WeatherBackground } from '@/components/WeatherBackground';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { ScrollProgress } from '@/components/ScrollProgress';
import { CustomCursor } from '@/components/CustomCursor';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { HeroWeatherCard } from '@/components/HeroWeatherCard';
import { HourlyForecast } from '@/components/HourlyForecast';
import { WeeklyForecast } from '@/components/WeeklyForecast';
import { AirQualityCard } from '@/components/AirQualityCard';
import { SunInfoCard } from '@/components/SunInfoCard';
import { Footer } from '@/components/Footer';
import { WeatherSkeleton } from '@/components/WeatherSkeleton';
import { ErrorState } from '@/components/ErrorState';

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const { weather, loading, error, selectLocation, recentSearches, refresh } = useWeather();

  const condition = weather ? getWeatherInfo(weather.current.weatherCode).condition : 'clear';
  const isDay = weather ? weather.current.isDay : true;

  return (
    <>
      <WeatherBackground condition={condition} isDay={isDay} />
      <ParticlesBackground />
      <ScrollProgress />
      <CustomCursor />

      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        {/* Hero intro */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6 py-8 text-center sm:py-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-slate-300 backdrop-blur-xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-violet" />
            Real-time data via Open-Meteo
          </motion.span>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Beautiful weather,
            <br />
            <span className="gradient-text">brilliantly clear.</span>
          </h1>

          <p className="max-w-xl text-sm text-slate-400 sm:text-base">
            Search any city for live conditions, hourly &amp; 7-day forecasts, air quality,
            UV index, and sunrise &amp; sunset — wrapped in a sleek, futuristic dashboard.
          </p>

          <SearchBar onSelect={selectLocation} recentSearches={recentSearches} />
        </motion.section>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <WeatherSkeleton />
            </motion.div>
          )}

          {!loading && error && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ErrorState message={error} onRetry={refresh} />
            </motion.div>
          )}

          {!loading && !error && weather && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <HeroWeatherCard location={weather.location} current={weather.current} />

              <HourlyForecast hours={weather.hourly} />

              <WeeklyForecast days={weather.daily} />

              <section id="environment" className="grid gap-4 sm:grid-cols-2">
                <AirQualityCard airQuality={weather.airQuality} />
                <SunInfoCard
                  sunrise={weather.daily[0].sunrise}
                  sunset={weather.daily[0].sunset}
                  currentTime={weather.current.time}
                  uvIndex={weather.current.uvIndex}
                />
              </section>

              <div className="flex justify-center">
                <motion.button
                  type="button"
                  onClick={refresh}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition-all hover:border-accent-cyan/40 hover:text-white hover:shadow-glow-cyan"
                >
                  <RefreshCw className="h-4 w-4" /> Refresh weather data
                </motion.button>
              </div>

              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
