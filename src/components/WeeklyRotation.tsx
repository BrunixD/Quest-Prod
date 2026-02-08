'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { Calendar, Plus, X, Trash2 } from 'lucide-react';

export const WeeklyRotation: React.FC = () => {
  const { gameState, addCustomTask, deleteTask } = useGame();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Creative / Art' as any,
    difficulty: 'Medium' as any,
    notes: '',
  });

  const categories = [
    'Creative / Art',
    'Craft / Sewing',
    'Writing / Learning',
    'Content / Online',
    'Gaming / Fun',
    'Life Skills',
  ];

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const xpValue = newTask.difficulty === 'Hard' ? 20 : newTask.difficulty === 'Medium' ? 20 : 15;
      addCustomTask({
        ...newTask,
        xpValue,
      });
      setNewTask({
        title: '',
        category: 'Creative / Art',
        difficulty: 'Medium',
        notes: '',
      });
      setShowAddTask(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Creative / Art': '🎨',
      'Craft / Sewing': '🧵',
      'Writing / Learning': '📚',
      'Content / Online': '💻',
      'Gaming / Fun': '🎮',
      'Life Skills': '🍳',
    };
    return icons[category] || '📋';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-fantasy-midnight dark:text-fantasy-cream flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary-500" />
          Task Database
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddTask(!showAddTask)}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-heading font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Task
        </motion.button>
      </div>

      <div className="bg-fantasy-lavender/10 rounded-lg p-4 border-2 border-fantasy-lavender/30">
        <p className="font-body text-sm text-fantasy-midnight/70 dark:text-fantasy-cream/70">
          Manage all your tasks here. Create, edit, or delete tasks. Use the calendars to assign them to specific time slots.
        </p>
        <p className="font-body text-xs text-fantasy-midnight/50 dark:text-fantasy-cream/50 mt-1">
          Total tasks: {gameState.tasks.length}
        </p>
      </div>

      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-fantasy-peach/20 to-fantasy-lavender/20 rounded-2xl p-6 border-2 border-fantasy-lavender/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-fantasy-midnight dark:text-fantasy-cream">
                Create New Task
              </h3>
              <button
                onClick={() => setShowAddTask(false)}
                className="text-fantasy-midnight/60 hover:text-fantasy-midnight dark:text-fantasy-cream/60 dark:hover:text-fantasy-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-body text-sm font-semibold text-fantasy-midnight dark:text-fantasy-cream block mb-2">
                  Task Name
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-lavender/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body"
                  placeholder="Enter task name..."
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
                    className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-lavender/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body"
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
                    className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-lavender/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body"
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
                  className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-lavender/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body resize-none"
                  rows={3}
                  placeholder="Add any notes..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddTask}
                className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-heading font-semibold transition-colors"
              >
                Add Task
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {categories.map(category => {
          const categoryTasks = gameState.tasks.filter(t => t.category === category);
          if (categoryTasks.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <h3 className="font-heading text-lg font-semibold text-fantasy-midnight dark:text-fantasy-cream flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                {category}
              </h3>
              
              <div className="grid gap-2">
                {categoryTasks.map((task, index) => {
                  const isCompleted = task.completed;

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isCompleted
                          ? 'bg-green-500/10 border-green-500/30 opacity-50'
                          : 'bg-white/30 dark:bg-fantasy-midnight/30 border-fantasy-lavender/20'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-body font-semibold text-fantasy-midnight dark:text-fantasy-cream">
                            {task.title}
                          </h4>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.difficulty === 'Hard' ? 'bg-red-500/20 text-red-700 dark:text-red-300' :
                              task.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' :
                              'bg-green-500/20 text-green-700 dark:text-green-300'
                            } font-bold`}>
                              {task.difficulty}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-700 dark:text-primary-300 font-bold">
                              +{task.xpValue} XP
                            </span>
                          </div>
                          {task.notes && (
                            <p className="text-xs text-fantasy-midnight/60 dark:text-fantasy-cream/60 mt-1">
                              {task.notes}
                            </p>
                          )}
                          {isCompleted && task.completedAt && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              ✓ Completed on {new Date(task.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};