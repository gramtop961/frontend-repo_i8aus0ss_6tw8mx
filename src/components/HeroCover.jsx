import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function HeroCover({ onGetStarted }) {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden rounded-b-3xl bg-black/90">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/qMOKV671Z1CM9yS7/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Soft vignette and gradient overlays (do not block interactions) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(253,224,71,0.10),transparent_60%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl text-left"
        >
          <h1 className="font-semibold tracking-tight text-white/90" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
            <span className="text-3xl sm:text-4xl md:text-5xl leading-tight">
              A calm space to plan, focus, and celebrate progress
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/70">
            Set gentle goals, organize your day, and build habits at your own pace. Everything is saved offline so you can return anytime.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <motion.button
              onClick={onGetStarted}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              className="rounded-full bg-amber-400/90 px-5 py-2.5 text-sm font-medium text-slate-900 shadow-sm shadow-amber-500/20 backdrop-blur hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              aria-label="Get started"
            >
              Get started
            </motion.button>
            <a href="#planner" className="rounded-full px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
              Explore planner
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
