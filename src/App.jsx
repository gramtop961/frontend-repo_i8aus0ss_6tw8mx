import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroCover from './components/HeroCover';
import Planner from './components/Planner';
import KanbanBoard from './components/KanbanBoard';
import HabitTracker from './components/HabitTracker';
import AchievementsTimeline from './components/AchievementsTimeline';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = React.useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [onboarded, setOnboarded] = useLocalStorage('onboarded', false);
  const [plans, setPlans] = useLocalStorage('plans', []); // {id,text,time,done,dateKey}
  const [kanban, setKanban] = useLocalStorage('kanban', []); // {id,title,status}
  const [habits, setHabits] = useLocalStorage('habits', []); // {id,name,checks:{date:true},streak}
  const [achievements, setAchievements] = useLocalStorage('achievements', []); // {id,text,date}

  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Planner handlers (scoped to today)
  const todaysPlans = React.useMemo(
    () => plans.filter((p) => p.dateKey === todayKey()),
    [plans]
  );

  const addPlan = ({ text, time }) => {
    const item = { id: uid(), text, time, done: false, dateKey: todayKey() };
    setPlans((prev) => [item, ...prev]);
  };

  const togglePlan = (id) => {
    setPlans((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, done: !p.done } : p));
      const item = next.find((p) => p.id === id);
      if (item && item.done) {
        setAchievements((a) => [
          { id: uid(), text: `Completed: ${item.text}`, date: new Date().toISOString() },
          ...a,
        ]);
      }
      return next;
    });
  };

  const deletePlan = (id) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  // Kanban handlers
  const createCard = (title) => {
    setKanban((prev) => [{ id: uid(), title, status: 'todo' }, ...prev]);
  };
  const moveCard = (id, status) => {
    setKanban((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };
  const deleteCard = (id) => {
    setKanban((prev) => prev.filter((c) => c.id !== id));
  };

  // Habits handlers
  const addHabit = (name) => {
    setHabits((prev) => [{ id: uid(), name, checks: {}, streak: 0 }, ...prev]);
  };
  const toggleHabitToday = (id, dateKey) => {
    setHabits((prev) => {
      return prev.map((h) => {
        if (h.id !== id) return h;
        const checked = !(h.checks?.[dateKey]);
        const checks = { ...(h.checks || {}), [dateKey]: checked };
        // simple streak update: if checked today, increment; if unchecked, decrement down to 0
        let streak = h.streak || 0;
        if (checked) streak = streak + 1; else streak = Math.max(0, streak - 1);
        if (checked) {
          setAchievements((a) => [
            { id: uid(), text: `Kept habit: ${h.name}`, date: new Date().toISOString() },
            ...a,
          ]);
        }
        return { ...h, checks, streak };
      });
    });
  };
  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const seedSample = () => {
    if (onboarded) return;
    const d = todayKey();
    setPlans([
      { id: uid(), text: 'Morning stretch', time: '07:30', done: false, dateKey: d },
      { id: uid(), text: 'Deep work block', time: '09:00', done: false, dateKey: d },
      { id: uid(), text: 'Walk outside', time: '15:30', done: false, dateKey: d },
    ]);
    setKanban([
      { id: uid(), title: 'Outline concept', status: 'todo' },
      { id: uid(), title: 'Write first draft', status: 'doing' },
      { id: uid(), title: 'Review notes', status: 'done' },
    ]);
    setHabits([
      { id: uid(), name: 'Hydrate', checks: {}, streak: 0 },
      { id: uid(), name: 'Read 10 pages', checks: {}, streak: 0 },
      { id: uid(), name: 'Evening reflection', checks: {}, streak: 0 },
    ]);
    setAchievements([]);
    setOnboarded(true);
  };

  const dismissOnboarding = () => setOnboarded(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <HeroCover onGetStarted={() => { dismissOnboarding(); scrollToPlanner(); }} />

      <main className="mx-auto -mt-8 max-w-6xl space-y-8 px-0 pb-20 sm:px-6">
        <Planner
          plans={todaysPlans}
          onAddPlan={addPlan}
          onTogglePlan={togglePlan}
          onDeletePlan={deletePlan}
        />

        <KanbanBoard
          items={kanban}
          onCreate={createCard}
          onMove={moveCard}
          onDelete={deleteCard}
        />

        <HabitTracker
          habits={habits}
          onToggleToday={toggleHabitToday}
          onAddHabit={addHabit}
          onDeleteHabit={deleteHabit}
        />

        <AchievementsTimeline achievements={achievements} />
      </main>

      <AnimatePresence>
        {!onboarded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Welcome"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
            >
              <h2 className="text-xl font-semibold tracking-tight text-slate-800">Welcome</h2>
              <p className="mt-2 text-sm text-slate-600">
                This space is designed to feel unhurried and clear. We’ll keep your data offline in your browser so you can return any time.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={seedSample}
                  className="rounded-xl bg-amber-400/90 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  Load sample data
                </button>
                <button
                  onClick={dismissOnboarding}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  Start blank
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">You can remove or change anything later.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mx-auto max-w-6xl px-6 pb-10 pt-6 text-center text-xs text-slate-500">
        Built for calm focus. Your data stays on this device.
      </footer>
    </div>
  );
}
