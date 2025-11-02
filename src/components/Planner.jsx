import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';

export default function Planner({ plans, onAddPlan, onTogglePlan, onDeletePlan }) {
  const [text, setText] = useState('');
  const [time, setTime] = useState('');

  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddPlan({ text: text.trim(), time: time || null });
    setText('');
    setTime('');
  };

  return (
    <section id="planner" className="mx-auto mt-8 max-w-6xl px-6">
      <div className="mb-4 flex items-center gap-2 text-slate-700">
        <CalendarIcon className="h-5 w-5 text-amber-500" aria-hidden />
        <h2 className="text-xl font-semibold tracking-tight">Today’s Planner</h2>
      </div>

      <form onSubmit={add} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:flex-row">
        <input
          aria-label="Plan title"
          className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
          placeholder="What would you like to focus on?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="time"
          aria-label="Time"
          className="w-full sm:w-40 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {plans.length === 0 ? (
            <motion.li
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500"
            >
              Add your first plan above. Keep it small and achievable.
            </motion.li>
          ) : (
            plans.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onTogglePlan(item.id)}
                    aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
                    className={`rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${item.done ? 'text-emerald-600' : 'text-slate-400'}`}
                  >
                    <CheckCircle2 className="h-6 w-6" />
                  </button>
                  <div>
                    <p className={`text-slate-800 ${item.done ? 'line-through opacity-60' : ''}`}>{item.text}</p>
                    {item.time && (
                      <p className="text-sm text-slate-500">{item.time}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeletePlan(item.id)}
                    className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    aria-label="Delete plan"
                  >
                    Delete
                  </button>
                </div>
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </ul>
    </section>
  );
}
