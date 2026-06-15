'use client';

import { motion } from 'framer-motion';

export function WeatherSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Hero skeleton */}
      <div className="glass-panel rounded-4xl p-6 sm:p-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-40 rounded-full" />
            <div className="flex items-center gap-6">
              <div className="skeleton h-24 w-24 rounded-full" />
              <div className="flex flex-col gap-2">
                <div className="skeleton h-16 w-40 rounded-2xl" />
                <div className="skeleton h-5 w-28 rounded-full" />
              </div>
            </div>
            <div className="skeleton h-4 w-56 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[420px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Hourly skeleton */}
      <div className="glass-panel rounded-4xl p-6 sm:p-8">
        <div className="skeleton mb-5 h-6 w-48 rounded-full" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-36 min-w-[92px] rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Weekly skeleton */}
      <div className="glass-panel rounded-4xl p-6 sm:p-8">
        <div className="skeleton mb-5 h-6 w-48 rounded-full" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Air quality + sun info skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="skeleton h-80 rounded-4xl" />
        <div className="skeleton h-80 rounded-4xl" />
      </div>
    </motion.div>
  );
}
