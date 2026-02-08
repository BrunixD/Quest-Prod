'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { format } from 'date-fns';
import { X, Plus, Search } from 'lucide-react';

interface TaskAssignModalProps {
  date: Date;
  slotId: string;
  onClose: () => void;
}

export const TaskAssignModal: React.FC<TaskAssignModalProps> = ({ date, slotId, onClose }) => {
  const { gameState, addCustomTask, assignTaskToSlot } = useGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Creative / Art' as any,
    difficulty: 'Medium' as any,
    notes: '',
  });
  const modalRef = useRef<HTMLDivElement>(null);

  const slot = gameState.schedule.find(s => s.id === slotId);
  const availableTasks = gameState.tasks.filter(t => 
    !t.completed && 
    (searchTerm === '' || t.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [
    'Creative / Art',
    'Craft / Sewing',
    'Writing / Learning',
    'Content / Online',
    'Gaming / Fun',
    'Life Skills',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

   const handleAssignTask = (taskId: string) => {
    assignTaskToSlot(taskId, slotId, date);
    onClose();
  };

  const handleCreateAndAssign = () => {
    if (newTask.title.trim()) {
      const xpValue = newTask.difficulty === 'Hard' ? 20 : newTask.difficulty === 'Medium' ? 20 : 15;
      addCustomTask({
        ...newTask,
        xpValue,
      });
      // Note: You'd need to get the new task ID to assign it
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gradient-to-br from-white to-fantasy-cream dark:from-fantasy-midnight dark:to-fantasy-deep rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-4 border-fantasy-lavender/30 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-fantasy-midnight dark:text-fantasy-cream">
                Assign Task
              </h2>
              <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60 mt-1">
                {format(date, 'EEEE, MMMM d')} • {slot?.startTime} - {slot?.endTime}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-fantasy-midnight/10 dark:hover:bg-fantasy-cream/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {!showCreateForm ? (
            <>
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fantasy-midnight/40 dark:text-fantasy-cream/40" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-fantasy-lavender/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body focus:border-primary-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Create New Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateForm(true)}
                className="w-full mb-4 p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-heading font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create New Task
              </motion.button>

              {/* Task List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableTasks.length > 0 ? (
                  availableTasks.map((task) => (
                    <motion.button
                      key={task.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAssignTask(task.id)}
                      className="w-full text-left p-4 bg-white/50 dark:bg-fantasy-midnight/50 rounded-xl border-2 border-fantasy-lavender/30 hover:border-primary-400 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-body font-semibold text-fantasy-midnight dark:text-fantasy-cream mb-1">
                            {task.title}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-xs px-2 py-1 rounded-full bg-fantasy-lavender/20 text-fantasy-midnight dark:text-fantasy-cream">
                              {task.category}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.difficulty === 'Hard' ? 'bg-red-500/20 text-red-700 dark:text-red-300' :
                              task.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' :
                              'bg-green-500/20 text-green-700 dark:text-green-300'
                            }`}>
                              {task.difficulty}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-700 dark:text-primary-300 font-bold">
                              +{task.xpValue} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="font-body text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                      No tasks found. Create a new one!
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Create Task Form */}
              <div className="space-y-4">
                <div>
                  <label className="font-body text-sm font-semibold text-fantasy-midnight dark:text-fantasy-cream block mb-2">
                    Task Name
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-lavender/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body focus:border-primary-400 focus:outline-none"
                    placeholder="Enter task name..."
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm font-semibold text-fantasy-midnight dark:text-fantasy-cream block mb-2">
                      Category
                    </label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-lavender/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body focus:border-primary-400 focus:outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-body text-sm font-semibold text-fantasy-midnight dark:text-fantasy-cream block mb-2">
                      Difficulty
                    </label>
                    <select
                      value={newTask.difficulty}
                      onChange={(e) => setNewTask({ ...newTask, difficulty: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-lavender/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body focus:border-primary-400 focus:outline-none"
                    >
                      <option value="Easy">Easy (+15 XP)</option>
                      <option value="Medium">Medium (+20 XP)</option>
                      <option value="Hard">Hard (+20 XP)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-body text-sm font-semibold text-fantasy-midnight dark:text-fantasy-cream block mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newTask.notes}
                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-lavender/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body resize-none focus:border-primary-400 focus:outline-none"
                    rows={3}
                    placeholder="Add any notes..."
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateAndAssign}
                    className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-heading font-semibold transition-colors"
                  >
                    Create & Add to Tasks
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewTask({
                        title: '',
                        category: 'Creative / Art',
                        difficulty: 'Medium',
                        notes: '',
                      });
                    }}
                    className="px-4 py-3 bg-fantasy-midnight/10 dark:bg-fantasy-cream/10 rounded-lg font-heading font-semibold transition-colors"
                  >
                    Back
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};