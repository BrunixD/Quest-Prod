'use client';

import React, { useState, useRef, useEffect } from 'react';import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { Task } from '@/types';
import { format } from 'date-fns';
import { X, Edit2, Trash2, Check, Calendar } from 'lucide-react';

interface TaskModalProps {
  task: Task;
  date: Date;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, date, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const { gameState, deleteTask } = useGame();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task? This will remove it from all schedules.')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gradient-to-br from-white to-fantasy-cream dark:from-fantasy-midnight dark:to-fantasy-deep rounded-3xl p-6 max-w-lg w-full border-4 border-fantasy-lavender/30 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                <span className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                  {format(date, 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
              
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="w-full font-heading text-2xl font-bold text-fantasy-midnight dark:text-fantasy-cream bg-transparent border-b-2 border-primary-500 focus:outline-none"
                />
              ) : (
                <h2 className="font-heading text-2xl font-bold text-fantasy-midnight dark:text-fantasy-cream">
                  {task.title}
                </h2>
              )}
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

          {/* Content */}
          <div className="space-y-4 mb-6">
            {/* Category */}
            <div>
              <label className="font-body text-sm font-semibold text-fantasy-midnight/60 dark:text-fantasy-cream/60 block mb-2">
                Category
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {task.category === 'Creative / Art' && '🎨'}
                  {task.category === 'Craft / Sewing' && '🧵'}
                  {task.category === 'Writing / Learning' && '📚'}
                  {task.category === 'Content / Online' && '💻'}
                  {task.category === 'Gaming / Fun' && '🎮'}
                  {task.category === 'Life Skills' && '🍳'}
                </span>
                <span className="font-body text-fantasy-midnight dark:text-fantasy-cream">
                  {task.category}
                </span>
              </div>
            </div>

            {/* Difficulty & XP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm font-semibold text-fantasy-midnight/60 dark:text-fantasy-cream/60 block mb-2">
                  Difficulty
                </label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                  task.difficulty === 'Hard' ? 'bg-red-500/20 text-red-700 dark:text-red-300' :
                  task.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' :
                  'bg-green-500/20 text-green-700 dark:text-green-300'
                }`}>
                  {task.difficulty}
                </span>
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-fantasy-midnight/60 dark:text-fantasy-cream/60 block mb-2">
                  XP Value
                </label>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-primary-500/20 text-primary-700 dark:text-primary-300">
                  +{task.xpValue} XP
                </span>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="font-body text-sm font-semibold text-fantasy-midnight/60 dark:text-fantasy-cream/60 block mb-2">
                Status
              </label>
              <div className="flex items-center gap-2">
                {task.completed ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-body text-green-600 dark:text-green-400 font-semibold">
                      Completed
                    </span>
                    {task.completedAt && (() => {
                        try {
                            return (
                            <span className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                                on {format(new Date(task.completedAt), 'MMM d, yyyy')}
                            </span>
                            );
                        } catch {
                            return null;
                        }
                    })()}
                  </>
                ) : (
                  <>
                    <span className="w-5 h-5 rounded-full border-2 border-fantasy-midnight/30 dark:border-fantasy-cream/30" />
                    <span className="font-body text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                      Not completed
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            {task.notes && (
              <div>
                <label className="font-body text-sm font-semibold text-fantasy-midnight/60 dark:text-fantasy-cream/60 block mb-2">
                  Notes
                </label>
                {isEditing ? (
                  <textarea
                    value={editedTask.notes || ''}
                    onChange={(e) => setEditedTask({ ...editedTask, notes: e.target.value })}
                    className="w-full p-3 rounded-lg border-2 border-fantasy-lavender/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="font-body text-fantasy-midnight dark:text-fantasy-cream bg-fantasy-lavender/10 rounded-lg p-3">
                    {task.notes}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-heading font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTask(task);
                  }}
                  className="px-4 py-3 bg-fantasy-midnight/10 dark:bg-fantasy-cream/10 rounded-lg font-heading font-semibold transition-colors"
                >
                  Cancel
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="flex-1 px-4 py-3 bg-fantasy-sage hover:bg-fantasy-sage/80 text-white rounded-lg font-heading font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-heading font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};