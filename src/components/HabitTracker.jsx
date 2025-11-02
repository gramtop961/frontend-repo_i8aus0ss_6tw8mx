import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

function formatDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export default function HabitTracker({ habits, onToggleToday, onAddHabit, onDeleteHabit }) {
  const todayKey = formatDateKey();
  const [name, setName] = React.useState('');

  const totalChecked = useMemo(() => {
    return habits.reduce((acc, h) => acc + (h.checks?.[todayKey] ? 1 : 0), 0);
  }, [habits, todayKey]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddHabit(name.trim());
    setName('');
  };

  return (
    <section className="mx-auto mt-10 max-w-6xl px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <Flame className="h-5 w-5 text-amber-500" aria-hidden />
          <h2 className="text-xl font-semibold tracking-tight">Habits</h2>
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{totalChecked} done today</span>
        </div>
        <form onSubmit={addHabit} className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add habit"
            aria-label="Add habit"
            className="w-48 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {habits.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
            Create a few small, repeatable habits. Tap them to mark today complete.
          </div>
        ) : (
          habits.map((h) => {
            const checked = Boolean(h.checks?.[todayKey]);
            const streak = h.streak || 0;
            return (
              <motion.button
                key={h.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggleToday(h.id, todayKey)}
                className={`flex items-center justify-between rounded-2xl border p-4 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                  checked ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
                }`}
                aria-pressed={checked}
                aria-label={`Toggle ${h.name} for today`}
              >
                <div>
                  <p className="font-medium text-slate-800">{h.name}</p>
                  <p className="text-xs text-slate-500">Streak: {streak} days</p>
                </div>
                <div className={`h-4 w-4 rounded-full ${checked ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              </motion.button>
            );
          })
        )}
      </div>
      {habits.length > 0 && (
        <div className="mt-3 text-right">
          <button
            onClick={() => {
              const id = prompt('Delete habit by name: enter exact name');
              const target = habits.find((h) => h.name === id);
              if (target) onDeleteHabit(target.id);
            }}
            className="text-xs text-slate-500 underline-offset-2 hover:underline"
          >
            Delete a habit
          </button>
        </div>
      )}
    </section>
  );
}
