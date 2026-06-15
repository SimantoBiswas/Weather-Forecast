'use client';

import { motion } from 'framer-motion';
import { Sparkles, Github, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel mt-4 rounded-4xl p-6 sm:p-8"
    >
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent-indigo to-accent-purple shadow-glow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-white">AuroraWeather</p>
            <p className="text-xs text-slate-400">Premium real-time forecasts, reimagined.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-accent-cyan"
          >
            Powered by Open-Meteo <ExternalLink className="h-3 w-3" />
          </a>
          <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:inline" />
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Github className="h-3.5 w-3.5" /> Source
          </a>
          <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:inline" />
          <span>&copy; {new Date().getFullYear()} AuroraWeather. All rights reserved.</span>
        </div>
      </div>
    </motion.footer>
  );
}
