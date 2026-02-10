'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { Clock, Coffee, Utensils, Sparkles, CheckCircle2, XCircle, Trash2, Plus } from 'lucide-react';

export const ScheduleTimeline: React.FC = () => {
  const { gameState, completeTask, skipTask, getSlotAssignment, removeSlotAssignment, assignTaskToSlot, completeExtraTask, getTodayProgress } = useGame();
  const { schedule } = gameState;
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showExtraTasks, setShowExtraTasks] = useState(false);

  const getSlotIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Utensils className="w-5 h-5" />;
      case 'break': return <Coffee className="w-5 h-5" />;
      case 'free': return <Sparkles className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getSlotColor = (type: string, isCompleted?: boolean, isSkipped?: boolean) => {
    if (isCompleted) return 'from-green-500/20 to-green-600/20 border-green-400/50 opacity-70';
    if (isSkipped) return 'from-red-500/20 to-red-600/20 border-red-400/50 opacity-70';
    
    switch (type) {
      case 'meal': return 'from-velaris-500/20 to-rhysand-500/20 border-velaris-400/30';
      case 'break': return 'from-starlight-500/20 to-velaris-500/20 border-starlight-400/30';
      case 'free': return 'from-violet-500/20 to-purple-500/20 border-violet-400/30';
      default: return 'from-night-600/40 to-velaris-600/40 border-velaris-400/40';
    }
  };

  const availableTasks = gameState.tasks.filter(t => !t.completed);

  const handleAssignTask = (slotId: string, taskId: string) => {
    const today = new Date();
    assignTaskToSlot(taskId, slotId, today);
    setSelectedSlot(null);
  };

  const handleRemoveAssignment = (slotId: string) => {
    const today = new Date();
    removeSlotAssignment(today, slotId);
  };

  const getCompletedExtraTasks = () => {
    const todayProgress = getTodayProgress();
    return todayProgress.extraTasksCompleted || [];
  };

  const isSlotCompleted = (slotId: string) => {
    const todayProgress = getTodayProgress();
    return todayProgress?.slotsCompleted?.includes(slotId);
  };

  const isSlotSkipped = (slotId: string) => {
    const todayProgress = getTodayProgress();
    return todayProgress?.slotsSkipped?.includes(slotId);
  };

  const handleCompleteExtraTask = async (taskId: string) => {
    await completeExtraTask(taskId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
          <Clock className="w-6 h-6 text-velaris-400" />
          Today&apos;s Quest Schedule
        </h2>
      </div>

      {/* Fixed Schedule */}
      <div className="grid gap-3">
        {schedule.map((slot, index) => {
          const assignedTaskId = slot.type === 'task' ? getSlotAssignment(new Date(), slot.id) : null;
          const assignedTask = assignedTaskId ? gameState.tasks.find(t => t.id === assignedTaskId) : null;
          const isTaskSlot = slot.type === 'task';
          const isCompleted = isSlotCompleted(slot.id);
          const isSkipped = isSlotSkipped(slot.id);
          const isDisabled = isCompleted || isSkipped;

          return (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-r ${getSlotColor(slot.type, isCompleted, isSkipped)} border-2 rounded-xl p-4 backdrop-blur-sm transition-all ${!isDisabled && 'hover:shadow-lg hover:glow-purple'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="text-violet-200 flex-shrink-0">
                    {getSlotIcon(slot.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-lg font-semibold text-violet-100">
                        {slot.label}
                      </h3>
                      {assignedTask && (
                        <>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            assignedTask.difficulty === 'Hard' ? 'bg-red-500/30 text-red-200' :
                            assignedTask.difficulty === 'Medium' ? 'bg-yellow-500/30 text-yellow-200' :
                            'bg-green-500/30 text-green-200'
                          }`}>
                            {assignedTask.difficulty}
                          </span>
                          {isCompleted && (
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/40 text-green-200">
                              ✓ Completed
                            </span>
                          )}
                          {isSkipped && (
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/40 text-red-200">
                              ✕ Skipped
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <p className="font-body text-sm text-violet-300/70 mt-1">
                      {slot.startTime} - {slot.endTime}
                    </p>
                    {assignedTask && (
                      <p className="font-body text-sm text-violet-200 mt-1 font-semibold">
                        📋 {assignedTask.title}
                      </p>
                    )}
                  </div>
                </div>

                {isTaskSlot && (
                  <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:flex-shrink-0">
                    {assignedTask ? (
                      <>
                        {!isDisabled ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => completeTask(assignedTask.id, slot.id)}
                              className="flex-1 sm:flex-initial px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-heading font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="whitespace-nowrap">Complete</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => skipTask(assignedTask.id, slot.id)}
                              className="flex-1 sm:flex-initial px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-heading font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              <span className="whitespace-nowrap">Skip</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveAssignment(slot.id)}
                              className="px-3 py-2 glass-card hover:bg-velaris-500/20 rounded-lg transition-colors"
                              title="Remove task"
                            >
                              <Trash2 className="w-4 h-4 text-violet-200" />
                            </motion.button>
                          </>
                        ) : (
                          <div className="w-full sm:w-auto px-4 py-2 glass-card rounded-lg font-heading font-semibold text-violet-300/50 text-center">
                            {isCompleted ? 'Done' : 'Skipped'}
                          </div>
                        )}
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSlot(slot.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-velaris-500 hover:bg-velaris-600 text-white rounded-lg font-heading font-semibold transition-colors glow-purple"
                      >
                        Assign Task
                      </motion.button>
                    )}
                  </div>
                )}
              </div>

              <AnimatePresence>
                {selectedSlot === slot.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t-2 border-velaris-500/20"
                  >
                    <h4 className="font-heading font-semibold text-violet-200 mb-3">
                      Select a task:
                    </h4>
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
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
                                <h5 className="font-body text-xs font-bold text-violet-300/70 mb-2 flex items-center gap-1">
                                  <span>{categoryIcon}</span>
                                  {category}
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {categoryTasks.map(task => (
                                    <motion.button
                                      key={task.id}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleAssignTask(slot.id, task.id)}
                                      className="text-left p-3 glass-card rounded-lg border-2 border-velaris-400/20 hover:border-velaris-400/50 transition-all"
                                    >
                                      <div className="flex flex-col gap-1">
                                        <span className="font-body text-sm font-semibold text-violet-100 line-clamp-1">
                                          {task.title}
                                        </span>
                                        <div className="flex gap-1 flex-wrap">
                                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                                            task.difficulty === 'Hard' ? 'bg-red-500/30 text-red-200' :
                                            task.difficulty === 'Medium' ? 'bg-yellow-500/30 text-yellow-200' :
                                            'bg-green-500/30 text-green-200'
                                          }`}>
                                            {task.difficulty}
                                          </span>
                                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-velaris-500/30 text-velaris-200 font-bold">
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
                        <p className="text-center text-violet-300/60 py-4">
                          No tasks available. Go to Tasks to create some!
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSlot(null)}
                      className="mt-3 w-full px-4 py-2 glass-card rounded-lg font-body text-sm hover:bg-velaris-500/20 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Extra Tasks Section */}
      <div className="mt-8 glass-card-dark rounded-2xl p-6 border-2 border-violet-500/30 glow-purple">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl font-bold bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent flex items-center gap-2">
              <Plus className="w-6 h-6 text-yellow-400" />
              Bonus Tasks (Unlimited!)
            </h3>
            <p className="font-body text-sm text-violet-300/70 mt-1">
              Complete as many extra tasks as you want for bonus XP!
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowExtraTasks(!showExtraTasks)}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-night-900 rounded-lg font-heading font-semibold transition-colors"
          >
            {showExtraTasks ? 'Hide' : 'Show Tasks'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showExtraTasks && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              {(() => {
                const categories = Array.from(new Set(availableTasks.map(t => t.category)));
                return categories.map(category => {
                  const completedExtraTasks = getCompletedExtraTasks();
                  const categoryTasks = availableTasks.filter(t => t.category === category && !completedExtraTasks.includes(t.id));
                  if (categoryTasks.length === 0) return null;
                  
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
                      <h5 className="font-body text-sm font-bold text-violet-200 mb-2 flex items-center gap-1">
                        <span className="text-xl">{categoryIcon}</span>
                        {category}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {categoryTasks.map(task => (
                          <motion.div
                            key={task.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-3 glass-card rounded-lg border-2 border-velaris-400/20 flex items-center justify-between gap-3"
                          >
                            <div className="flex-1 min-w-0">
                              <span className="font-body text-sm font-semibold text-violet-100">
                                {task.title}
                              </span>
                              <div className="flex gap-1 mt-1">
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                                  task.difficulty === 'Hard' ? 'bg-red-500/30 text-red-200' :
                                  task.difficulty === 'Medium' ? 'bg-yellow-500/30 text-yellow-200' :
                                  'bg-green-500/30 text-green-200'
                                }`}>
                                  {task.difficulty}
                                </span>
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-velaris-500/30 text-velaris-200 font-bold">
                                  +{task.xpValue}
                                </span>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCompleteExtraTask(task.id)}
                              className="flex-shrink-0 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-heading font-semibold text-sm transition-colors"
                            >
                              Complete
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}

              {/* Completed Extra Tasks */}
              {(() => {
                const completedExtraTasks = getCompletedExtraTasks();
                return completedExtraTasks.length > 0 && (
                  <div className="mt-6 pt-6 border-t-2 border-velaris-500/20">
                    <h5 className="font-body text-sm font-bold text-green-300 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Completed Bonus Tasks Today ({completedExtraTasks.length})
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {completedExtraTasks.map(taskId => {
                        const task = gameState.tasks.find(t => t.id === taskId);
                        if (!task) return null;
                        
                        return (
                          <div
                            key={taskId}
                            className="p-3 bg-green-500/10 rounded-lg border-2 border-green-400/30 flex items-center gap-3"
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-body text-sm font-semibold text-violet-100">
                                {task.title}
                              </span>
                              <div className="flex gap-1 mt-1">
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/30 text-green-200 font-bold">
                                  +{task.xpValue} XP
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};