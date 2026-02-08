'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { Clock, Coffee, Utensils, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

export const ScheduleTimeline: React.FC = () => {
  const { gameState, completeTask, skipTask, assignTaskToSlot, getAssignedTasks } = useGame();
  const { schedule } = gameState;
  const assignedTasks = getAssignedTasks();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const getSlotIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Utensils className="w-5 h-5" />;
      case 'break': return <Coffee className="w-5 h-5" />;
      case 'free': return <Sparkles className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getSlotColor = (type: string) => {
    switch (type) {
      case 'meal': return 'from-fantasy-peach/30 to-fantasy-rose/30 border-fantasy-peach';
      case 'break': return 'from-fantasy-sage/30 to-fantasy-lavender/30 border-fantasy-sage';
      case 'free': return 'from-fantasy-gold/30 to-fantasy-peach/30 border-fantasy-gold';
      default: return 'from-primary-500/20 to-fantasy-lavender/30 border-primary-400';
    }
  };

  const weeklyTasks = gameState.tasks.filter(t => 
    gameState.weeklyRotation.selectedTasks.includes(t.id) && !t.completed
  );

  const handleAssignTask = (slotId: string, taskId: string) => {
    assignTaskToSlot(taskId, slotId);
    setSelectedSlot(null);
  };

  const handleCompleteTask = (slotId: string, taskId: string) => {
    completeTask(taskId, slotId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-2xl font-bold text-fantasy-midnight dark:text-fantasy-cream flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary-500" />
          Today's Quest Schedule
        </h2>
      </div>

      <div className="grid gap-3">
        {schedule.map((slot, index) => {
          const assignedTaskId = assignedTasks[slot.id];
          const assignedTask = gameState.tasks.find(t => t.id === assignedTaskId);
          const isTaskSlot = slot.type === 'task';

          return (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-r ${getSlotColor(slot.type)} border-2 rounded-xl p-4 backdrop-blur-sm transition-all hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-fantasy-midnight/80 dark:text-fantasy-cream/80">
                    {getSlotIcon(slot.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-lg font-semibold text-fantasy-midnight dark:text-fantasy-cream">
                        {slot.label}
                      </h3>
                      {assignedTask && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          assignedTask.difficulty === 'Hard' ? 'bg-red-500/20 text-red-700 dark:text-red-300' :
                          assignedTask.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' :
                          'bg-green-500/20 text-green-700 dark:text-green-300'
                        }`}>
                          {assignedTask.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                      {slot.startTime} - {slot.endTime}
                    </p>
                    {assignedTask && (
                      <p className="font-body text-sm text-fantasy-midnight dark:text-fantasy-cream mt-1 font-semibold">
                        📋 {assignedTask.title}
                      </p>
                    )}
                  </div>
                </div>

                {isTaskSlot && (
                  <div className="flex gap-2">
                    {assignedTask ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCompleteTask(slot.id, assignedTask.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-heading font-semibold flex items-center gap-2 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Complete
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => skipTask(assignedTask.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-heading font-semibold flex items-center gap-2 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Skip
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSlot(slot.id)}
                        className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-heading font-semibold transition-colors"
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
                    className="mt-4 pt-4 border-t-2 border-fantasy-midnight/10 dark:border-fantasy-cream/10"
                  >
                    <h4 className="font-heading font-semibold text-fantasy-midnight dark:text-fantasy-cream mb-2">
                      Select a task:
                    </h4>
                    <div className="grid gap-2 max-h-64 overflow-y-auto">
                      {weeklyTasks.length > 0 ? (
                        weeklyTasks.map(task => (
                          <motion.button
                            key={task.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAssignTask(slot.id, task.id)}
                            className="text-left p-3 bg-white/50 dark:bg-fantasy-midnight/50 rounded-lg border-2 border-fantasy-lavender/30 hover:border-primary-400 transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-body font-semibold text-fantasy-midnight dark:text-fantasy-cream">
                                {task.title}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-700 dark:text-primary-300 font-bold">
                                +{task.xpValue} XP
                              </span>
                            </div>
                            <span className="text-xs text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                              {task.category} • {task.difficulty}
                            </span>
                          </motion.button>
                        ))
                      ) : (
                        <p className="text-center text-fantasy-midnight/60 dark:text-fantasy-cream/60 py-4">
                          No tasks selected for this week. Go to Weekly Rotation to select tasks!
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSlot(null)}
                      className="mt-3 w-full px-4 py-2 bg-fantasy-midnight/10 dark:bg-fantasy-cream/10 rounded-lg font-body text-sm"
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
    </div>
  );
};
