'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { X } from 'lucide-react';
import { TaskCategory } from '@/types';
import { Portal } from './Portal';

interface TaskModalProps {
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ onClose }) => {
  const { addCustomTask } = useGame();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Creative / Art');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [xpValue, setXpValue] = useState(15);
  const [notes, setNotes] = useState('');

  const categories = [
    'Creative / Art',
    'Craft / Sewing',
    'Writing / Learning',
    'Content / Online',
    'Gaming / Fun',
    'Life Skills',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    await addCustomTask({
      title: title.trim(),
      category,
      difficulty,
      xpValue,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card-dark rounded-2xl p-6 border-2 border-velaris-500/30 max-w-md w-full glow-purple"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
              Create New Task
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-velaris-500/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-violet-200" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block font-body text-sm font-semibold text-violet-200 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 glass-card rounded-lg border-2 border-velaris-400/30 bg-night-900/50 text-violet-100 font-body focus:border-velaris-400 focus:outline-none"
                placeholder="e.g., Paint watercolor landscape"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-body text-sm font-semibold text-violet-200 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-4 py-2 glass-card rounded-lg border-2 border-velaris-400/30 bg-night-900/50 text-violet-100 font-body focus:border-velaris-400 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-night-900 text-violet-100">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block font-body text-sm font-semibold text-violet-200 mb-2">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      setDifficulty(diff);
                      setXpValue(diff === 'Easy' ? 15 : diff === 'Medium' ? 20 : 25);
                    }}
                    className={`px-4 py-2 rounded-lg font-heading font-semibold text-sm transition-all ${
                      difficulty === diff
                        ? diff === 'Hard' ? 'bg-red-500/30 text-red-200 border-2 border-red-400' :
                          diff === 'Medium' ? 'bg-yellow-500/30 text-yellow-200 border-2 border-yellow-400' :
                          'bg-green-500/30 text-green-200 border-2 border-green-400'
                        : 'glass-card border-2 border-velaris-400/20 text-violet-300/60'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* XP Value */}
            <div>
              <label className="block font-body text-sm font-semibold text-violet-200 mb-2">
                XP Value
              </label>
              <input
                type="number"
                value={xpValue}
                onChange={(e) => setXpValue(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 glass-card rounded-lg border-2 border-velaris-400/30 bg-night-900/50 text-violet-100 font-body focus:border-velaris-400 focus:outline-none"
                min="1"
                max="100"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block font-body text-sm font-semibold text-violet-200 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 glass-card rounded-lg border-2 border-velaris-400/30 bg-night-900/50 text-violet-100 font-body focus:border-velaris-400 focus:outline-none resize-none"
                rows={3}
                placeholder="Any additional details..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 glass-card rounded-lg font-heading font-semibold text-violet-200 hover:bg-velaris-500/20 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 px-4 py-2 bg-velaris-500 hover:bg-velaris-600 text-white rounded-lg font-heading font-semibold transition-colors glow-purple"
              >
                Create Task
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </Portal>
  );
};