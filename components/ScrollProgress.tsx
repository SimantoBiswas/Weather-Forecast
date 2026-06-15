'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * A thin gradient progress bar fixed to the top of the viewport that fills
 * as the user scrolls down the page.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left bg-glow-line"
      style={{ scaleX }}
    />
  );
}
