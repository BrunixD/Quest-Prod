'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { Calendar, Plus, Trash2, CheckCircle } from 'lucide-react';
import { TaskModal } from './TaskModal';

export const WeeklyRotation: React.FC = () => {
  const { gameState, deleteTask } = useGame();
  const [showTaskModal, setShowTaskModal] = useState(false);

  const groupedTasks = gameState.tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof gameState.tasks>);

  const categoryIcons: Record<string, string> = {
    'Creative / Art': '🎨',
    'Craft / Sewing': '🧵',
    'Writing / Learning': '📚',
    'Content / Online': '💻',
    'Gaming / Fun': '🎮',
    'Life Skills': '🍳',
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
          <Calendar className="w-6 h-6 text-velaris-400" />
          Task Database
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTaskModal(true)}
          className="px-4 py-2 bg-velaris-500 hover:bg-velaris-600 text-white rounded-lg font-heading font-semibold flex items-center gap-2 transition-colors glow-purple"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </motion.button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([category, tasks]) => (
          <div key={category} className="glass-card-dark rounded-2xl p-6 border-2 border-velaris-500/30">
            <h3 className="font-heading text-xl font-bold text-violet-200 mb-4 flex items-center gap-2">
              <span className="text-2xl">{categoryIcons[category] || '📋'}</span>
              {category}
              <span className="text-sm font-body text-violet-400/60 ml-2">
                ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-lg p-4 border-2 border-velaris-400/20 hover:border-velaris-400/40 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-body font-semibold text-violet-100 mb-1">
                        {task.title}
                      </h4>
                      {task.notes && (
                        <p className="text-xs text-violet-300/60 line-clamp-2">
                          {task.notes}
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      task.difficulty === 'Hard' ? 'bg-red-500/30 text-red-200' :
                      task.difficulty === 'Medium' ? 'bg-yellow-500/30 text-yellow-200' :
                      'bg-green-500/30 text-green-200'
                    }`}>
                      {task.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-velaris-500/30 text-velaris-200 font-bold">
                      +{task.xpValue} XP
                    </span>
                    {task.completed && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/30 text-green-200 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Done
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedTasks).length === 0 && (
          <div className="glass-card-dark rounded-2xl p-12 border-2 border-velaris-500/30 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="font-heading text-xl font-bold text-violet-200 mb-2">
              No tasks yet
            </h3>
            <p className="text-violet-300/60 mb-6">
              Create your first task to get started on your quest!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTaskModal(true)}
              className="px-6 py-3 bg-velaris-500 hover:bg-velaris-600 text-white rounded-lg font-heading font-semibold inline-flex items-center gap-2 transition-colors glow-purple"
            >
              <Plus className="w-5 h-5" />
              Create First Task
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showTaskModal && (
          <TaskModal onClose={() => setShowTaskModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};