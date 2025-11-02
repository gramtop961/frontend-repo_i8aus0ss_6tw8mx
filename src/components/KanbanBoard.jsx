import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, PlusCircle } from 'lucide-react';

const COLUMNS = [
  { key: 'todo', label: 'Up Next' },
  { key: 'doing', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

export default function KanbanBoard({ items, onCreate, onMove, onDelete }) {
  const [newTitle, setNewTitle] = useState('');
  const grouped = useMemo(() => {
    return COLUMNS.reduce((acc, col) => {
      acc[col.key] = items.filter((i) => i.status === col.key);
      return acc;
    }, {});
  }, [items]);

  const add = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreate(newTitle.trim());
    setNewTitle('');
  };

  return (
    <section className="mx-auto mt-10 max-w-6xl px-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-slate-700">Kanban</h2>
        <form onSubmit={add} className="flex items-center gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New card title"
            aria-label="New card title"
            className="w-48 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400/90 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <PlusCircle className="h-4 w-4" /> Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <div key={col.key} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-medium text-slate-600">{col.label}</p>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{grouped[col.key].length}</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {grouped[col.key].map((card) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-slate-700">{card.title}</p>
                      <button
                        onClick={() => onDelete(card.id)}
                        className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                        aria-label="Delete card"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="mt-2">
                      <label className="sr-only" htmlFor={`move-${card.id}`}>Move card</label>
                      <div className="relative inline-block w-full">
                        <select
                          id={`move-${card.id}`}
                          value={card.status}
                          onChange={(e) => onMove(card.id, e.target.value)}
                          className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-xs text-slate-700 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.key} value={c.key}>{c.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
