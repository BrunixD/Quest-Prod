'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { format } from 'date-fns';
import { X, Clock, Coffee, Utensils, Sparkles, Trash2 } from 'lucide-react';

interface DayScheduleModalProps {
  date: Date;
  onClose: () => void;
  onTaskClick: (taskId: string) => void;
}

export const DayScheduleModal: React.FC<DayScheduleModalProps> = ({ date, onClose, onTaskClick }) => {
  const { gameState, getSlotAssignment, removeSlotAssignment } = useGame();
  const modalRef = useRef<HTMLDivElement>(null);
  
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayProgress = gameState.userProgress.weeklyProgress[dateStr];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getSlotIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Utensils className="w-5 h-5" />;
      case 'break': return <Coffee className="w-5 h-5" />;
      case 'free': return <Sparkles className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getTaskForDate = (taskId: string) => {
    return gameState.tasks.find(t => t.id === taskId);
  };

  const completedTasks = dayProgress?.tasksCompleted
    .map((taskId: string) => getTaskForDate(taskId))
    .filter(Boolean) || [];

  const handleRemoveAssignment = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSlotAssignment(date, slotId);
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
          <div className="flex items-start justify-between mb-6 sticky top-0 bg-gradient-to-br from-white to-fantasy-cream dark:from-fantasy-midnight dark:to-fantasy-deep pb-4 z-10">
            <div>
              <h2 className="font-heading text-2xl font-bold text-fantasy-midnight dark:text-fantasy-cream">
                {format(date, 'EEEE, MMMM d')}
              </h2>
              {dayProgress && (
                <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60 mt-1">
                  {dayProgress.completedTasks}/4 tasks • {dayProgress.xpEarned} XP earned
                </p>
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

          {/* Schedule */}
          <div className="space-y-3">
            {gameState.schedule.map((slot, index) => {
              const assignedTaskId = slot.type === 'task' ? getSlotAssignment(date, slot.id) : null;
              const assignedTask = assignedTaskId ? gameState.tasks.find(t => t.id === assignedTaskId) : null;
              
              return (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    slot.type === 'task'
                      ? assignedTask
                        ? 'bg-fantasy-lavender/20 border-fantasy-lavender/40'
                        : 'bg-primary-500/10 border-primary-400/30'
                      : slot.type === 'meal'
                      ? 'bg-fantasy-peach/20 border-fantasy-peach/30'
                      : slot.type === 'break'
                      ? 'bg-fantasy-sage/20 border-fantasy-sage/30'
                      : 'bg-fantasy-gold/20 border-fantasy-gold/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-fantasy-midnight/80 dark:text-fantasy-cream/80">
                        {getSlotIcon(slot.type)}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-heading text-lg font-semibold text-fantasy-midnight dark:text-fantasy-cream">
                          {slot.label}
                        </h3>
                        <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                          {slot.startTime} - {slot.endTime}
                        </p>
                        {assignedTask && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-fantasy-midnight/50 font-semibold text-fantasy-midnight dark:text-fantasy-cream">
                              📋 {assignedTask.title}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-700 dark:text-primary-300 font-bold">
                              +{assignedTask.xpValue} XP
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {slot.type === 'task' && (
                      <div className="flex gap-2">
                        {assignedTask ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleRemoveAssignment(slot.id, e)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                            title="Remove task"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </motion.button>
                        ) : (
                          <div className="text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-fantasy-midnight/50 font-bold text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                            1 hour
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="mt-6 pt-6 border-t-2 border-fantasy-lavender/20">
              <h3 className="font-heading text-lg font-semibold text-fantasy-midnight dark:text-fantasy-cream mb-4">
                Completed Tasks
              </h3>
              
              <div className="space-y-2">
                {completedTasks.map((task) => task && (
                  <motion.button
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onTaskClick(task.id)}
                    className="w-full text-left p-4 bg-green-500/10 rounded-xl border-2 border-green-500/30 hover:bg-green-500/20 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-body font-semibold text-fantasy-midnight dark:text-fantasy-cream">
                            {task.title}
                          </h4>
                          <p className="text-xs text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                            {task.category} • {task.difficulty}
                          </p>
                        </div>
                      </div>
                      
                      <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-700 dark:text-primary-300 font-bold">
                        +{task.xpValue} XP
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {!dayProgress && (
            <div className="mt-6 text-center py-8">
              <p className="font-body text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                No activity recorded for this day
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};