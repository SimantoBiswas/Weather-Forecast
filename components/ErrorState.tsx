'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel flex flex-col items-center gap-4 rounded-4xl p-10 text-center"
    >
      <motion.div
        animate={{ rotate: [0, -6, 6, -6, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400"
      >
        <AlertTriangle className="h-7 w-7" />
      </motion.div>
      <div>
        <h3 className="font-display text-lg font-semibold text-white">
          Something went wrong
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-400">{message}</p>
      </div>
      <motion.button
        type="button"
        onClick={onRetry}
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.03 }}
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-accent-violet/40 hover:shadow-glow-sm"
      >
        <RefreshCw className="h-4 w-4" /> Try again
      </motion.button>
    </motion.div>
  );
}
