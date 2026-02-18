'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { Portal } from './Portal';
import { X, Calendar, CheckCircle, XCircle, Clock, Plus, Trash2 } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';

interface DayScheduleModalProps {
  date: Date;
  onClose: () => void;
}

export const DayScheduleModal: React.FC<DayScheduleModalProps> = ({ date, onClose }) => {
  const { gameState, getSlotAssignment, assignTaskToSlot, removeSlotAssignment, completeTask, skipTask } = useGame();
  const dateStr = format(date, 'yyyy-MM-dd');
  const progress = gameState.userProgress.weeklyProgress[dateStr];
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const availableTasks = gameState.tasks.filter(t => !t.completed);
  const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;
  const isPastOrToday = isBefore(startOfDay(date), startOfDay(new Date())) || isToday;

  const handleAssignTask = (slotId: string, taskId: string) => {
    assignTaskToSlot(taskId, slotId, date);
    setSelectedSlot(null);
  };

  const handleRemoveAssignment = (slotId: string) => {
    removeSlotAssignment(date, slotId);
  };

  const handleCompleteTask = async (taskId: string, slotId: string) => {
    await completeTask(taskId, slotId, date); // Pass date parameter
  };

  const handleSkipTask = async (taskId: string, slotId: string) => {
    await skipTask(taskId, slotId, date); // Pass date parameter
  };

  const isSlotCompleted = (slotId: string) => {
    return progress?.slotsCompleted?.includes(slotId);
  };

  const isSlotSkipped = (slotId: string) => {
    return progress?.slotsSkipped?.includes(slotId);
  };

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card-dark rounded-2xl p-6 border-2 border-velaris-500/30 w-full max-w-3xl my-8 glow-purple"
        >
          {/* Header - Fixed */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-velaris-400" />
              <div>
                <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                  {format(date, 'EEEE, MMMM d, yyyy')}
                </h2>
                {progress && (
                  <p className="font-body text-sm text-violet-300/70">
                    {progress.completedTasks}/{progress.totalTasks} tasks completed • {progress.xpEarned >= 0 ? '+' : ''}{progress.xpEarned} XP
                  </p>
                )}
                {!isToday && isPastOrToday && (
                  <p className="font-body text-xs text-yellow-400 mt-1">
                    ⏰ Past day - you can still log completed/skipped tasks
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-velaris-500/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-violet-200" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="space-y-3 max-h-[calc(85vh-200px)] overflow-y-auto pr-2">
            {gameState.schedule.filter(slot => slot.type === 'task').map(slot => {
              const taskId = getSlotAssignment(date, slot.id);
              const task = taskId ? gameState.tasks.find(t => t.id === taskId) : null;
              const isCompleted = isSlotCompleted(slot.id);
              const isSkipped = isSlotSkipped(slot.id);
              const isDisabled = isCompleted || isSkipped;

              return (
                <div key={slot.id}>
                  <div
                    className={`glass-card rounded-lg p-4 border-2 transition-all ${
                      isCompleted 
                        ? 'border-green-400/30 bg-green-500/5' 
                        : isSkipped 
                          ? 'border-red-400/30 bg-red-500/5'
                          : 'border-velaris-400/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Clock className="w-5 h-5 text-violet-300/70 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-violet-200">
                            {slot.label}
                          </p>
                          <p className="font-body text-xs text-violet-300/70">
                            {slot.startTime} - {slot.endTime}
                          </p>
                          {task && (
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <p className="font-body text-sm text-violet-200">
                                📋 {task.title}
                              </p>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                                task.difficulty === 'Hard' ? 'bg-red-500/30 text-red-200' :
                                task.difficulty === 'Medium' ? 'bg-yellow-500/30 text-yellow-200' :
                                'bg-green-500/30 text-green-200'
                              }`}>
                                {task.difficulty}
                              </span>
                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-velaris-500/30 text-velaris-200 font-bold">
                                +{task.xpValue} XP
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {task ? (
                          <>
                            {isPastOrToday && !isDisabled && (
                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleCompleteTask(task.id, slot.id)}
                                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-heading font-semibold text-sm flex items-center gap-1 transition-colors whitespace-nowrap"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Complete
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSkipTask(task.id, slot.id)}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-heading font-semibold text-sm flex items-center gap-1 transition-colors whitespace-nowrap"
                                >
                                  <XCircle className="w-3 h-3" />
                                  Skip
                                </motion.button>
                              </div>
                            )}
                            {!isDisabled && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRemoveAssignment(slot.id)}
                                className="px-3 py-1.5 glass-card hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-1 justify-center"
                                title="Remove task"
                              >
                                <Trash2 className="w-3 h-3 text-red-400" />
                                <span className="text-xs text-red-400 font-semibold">Remove</span>
                              </motion.button>
                            )}
                            {isCompleted && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full whitespace-nowrap">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="font-heading text-sm font-semibold text-green-400">
                                  Completed
                                </span>
                              </div>
                            )}
                            {isSkipped && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full whitespace-nowrap">
                                <XCircle className="w-4 h-4 text-red-400" />
                                <span className="font-heading text-sm font-semibold text-red-400">
                                  Skipped
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedSlot(slot.id)}
                            className="px-3 py-1.5 bg-velaris-500 hover:bg-velaris-600 text-white rounded-lg font-heading font-semibold text-sm flex items-center gap-1 transition-colors whitespace-nowrap"
                          >
                            <Plus className="w-4 h-4" />
                            Assign Task
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Task Selection Dropdown */}
                    <AnimatePresence>
                      {selectedSlot === slot.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 pt-3 border-t-2 border-velaris-500/20"
                        >
                          <h5 className="font-heading font-semibold text-violet-200 mb-2 text-sm">
                            Select a task:
                          </h5>
                          <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                            {availableTasks.length > 0 ? (
                              (() => {
                                const categories = Array.from(new Set(availableTasks.map(t => t.category)));
                                return categories.map(category => {
                                  const categoryTasks = availableTasks.filter(t => t.category === category);
                                  const categoryIcon = {
                                    'Creative / Art': '🎨',
                                    'Craft / Sewing': '🧵',
                                    'Writing / Learning': '📚',
                                    'Content / Online': '💻',
                                    'Gaming / Fun': '🎮',
                                    'Life Skills': '🍳',
                                  }[category] || '📋';

                                  return (
                                    <div key={category}>
                                      <h6 className="font-body text-xs font-bold text-violet-300/70 mb-1 flex items-center gap-1">
                                        <span>{categoryIcon}</span>
                                        {category}
                                      </h6>
                                      <div className="grid grid-cols-2 gap-2">
                                        {categoryTasks.map(task => (
                                          <motion.button
                                            key={task.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAssignTask(slot.id, task.id)}
                                            className="text-left p-2 glass-card rounded-lg border-2 border-velaris-400/20 hover:border-velaris-400/50 transition-all"
                                          >
                                            <div className="flex flex-col gap-1">
                                              <span className="font-body text-xs font-semibold text-violet-100 line-clamp-1">
                                                {task.title}
                                              </span>
                                              <div className="flex gap-1 flex-wrap">
                                                <span className={`text-xs px-1 py-0.5 rounded-full font-bold ${
                                                  task.difficulty === 'Hard' ? 'bg-red-500/30 text-red-200' :
                                                  task.difficulty === 'Medium' ? 'bg-yellow-500/30 text-yellow-200' :
                                                  'bg-green-500/30 text-green-200'
                                                }`}>
                                                  {task.difficulty}
                                                </span>
                                                <span className="text-xs px-1 py-0.5 rounded-full bg-velaris-500/30 text-velaris-200 font-bold">
                                                  +{task.xpValue}
                                                </span>
                                              </div>
                                            </div>
                                          </motion.button>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                });
                              })()
                            ) : (
                              <p className="text-center text-violet-300/60 py-2 text-sm">
                                No tasks available
                              </p>
                            )}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedSlot(null)}
                            className="mt-2 w-full px-3 py-1.5 glass-card rounded-lg font-body text-sm hover:bg-velaris-500/20 transition-colors"
                          >
                            Cancel
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}

            {!progress && gameState.schedule.filter(slot => slot.type === 'task').every(slot => !getSlotAssignment(date, slot.id)) && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="font-heading text-lg font-semibold text-violet-200 mb-2">
                  Start by assigning tasks to this day!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
};