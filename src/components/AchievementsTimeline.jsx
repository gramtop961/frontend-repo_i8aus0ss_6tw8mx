import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function AchievementsTimeline({ achievements }) {
  return (
    <section className="mx-auto mt-10 max-w-6xl px-6">
      <div className="mb-4 flex items-center gap-2 text-slate-700">
        <Star className="h-5 w-5 text-amber-500" aria-hidden />
        <h2 className="text-xl font-semibold tracking-tight">Achievements</h2>
      </div>

      {achievements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
          As you complete plans and habits, your milestones will appear here.
        </div>
      ) : (
        <ol className="relative ml-3 space-y-4 border-l border-slate-200">
          {achievements.map((a, idx) => (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              className="ml-4"
            >
              <div className="absolute -left-2 top-2 h-3 w-3 rounded-full bg-amber-400 ring-4 ring-amber-100" />
              <p className="text-sm text-slate-700">{a.text}</p>
              <p className="text-xs text-slate-500">{new Date(a.date).toLocaleString()}</p>
            </motion.li>
          ))}
        </ol>
      )}
    </section>
  );
}
