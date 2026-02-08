'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { TaskModal } from './TaskModal';
import { TaskAssignModal } from './TaskAssignModal';

export const WeeklyCalendar: React.FC = () => {
  const { gameState, getSlotAssignment, removeSlotAssignment } = useGame();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; slotId: string } | null>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayProgress = gameState.userProgress.weeklyProgress[dateStr];
    
    if (!dayProgress) return [];
    
    return dayProgress.tasksCompleted.map(taskId => 
      gameState.tasks.find(t => t.id === taskId)
    ).filter(Boolean);
  };

  const handleSlotClick = (date: Date, slotId: string) => {
    setSelectedSlot({ date, slotId });
    setShowAssignModal(true);
  };

  const handleRemoveAssignment = (date: Date, slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSlotAssignment(date, slotId);
  };

  const task = selectedTask ? gameState.tasks.find(t => t.id === selectedTask) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-fantasy-midnight dark:text-fantasy-cream flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-primary-500" />
          Weekly View
        </h2>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPreviousWeek}
            className="p-2 bg-white/50 dark:bg-fantasy-midnight/50 rounded-lg border-2 border-fantasy-lavender/30 hover:border-primary-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-heading font-semibold transition-colors"
          >
            Today
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNextWeek}
            className="p-2 bg-white/50 dark:bg-fantasy-midnight/50 rounded-lg border-2 border-fantasy-lavender/30 hover:border-primary-400 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          const tasksForDay = getTasksForDate(day);
          const dayProgress = gameState.userProgress.weeklyProgress[format(day, 'yyyy-MM-dd')];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-br from-white/50 to-fantasy-cream/50 dark:from-fantasy-midnight/50 dark:to-fantasy-deep/50 rounded-2xl p-4 border-2 ${
                isToday 
                  ? 'border-primary-500 shadow-lg' 
                  : 'border-fantasy-lavender/30'
              } min-h-[300px]`}
            >
              {/* Day Header */}
              <div className="mb-3 pb-3 border-b-2 border-fantasy-lavender/20">
                <p className="font-body text-xs text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                  {format(day, 'EEEE')}
                </p>
                <p className={`font-heading text-2xl font-bold ${
                  isToday 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-fantasy-midnight dark:text-fantasy-cream'
                }`}>
                  {format(day, 'd')}
                </p>
                {dayProgress && (
                  <p className="font-body text-xs text-fantasy-midnight/60 dark:text-fantasy-cream/60 mt-1">
                    {dayProgress.completedTasks}/4 tasks • {dayProgress.xpEarned} XP
                  </p>
                )}
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                {gameState.schedule.filter(s => s.type === 'task').map(slot => {
                  const assignedTaskId = getSlotAssignment(day, slot.id);
                  const assignedTask = assignedTaskId ? gameState.tasks.find(t => t.id === assignedTaskId) : null;
                  
                  return (
                    <div key={slot.id} className="relative">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSlotClick(day, slot.id)}
                        className={`w-full text-left text-xs rounded-lg p-2 border transition-colors group ${
                          assignedTask
                            ? 'bg-fantasy-lavender/20 border-fantasy-lavender/40 hover:bg-fantasy-lavender/30'
                            : 'bg-primary-500/10 hover:bg-primary-500/20 border-primary-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-body text-fantasy-midnight/50 dark:text-fantasy-cream/50">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            {assignedTask ? (
                              <p className="font-heading text-sm font-semibold text-fantasy-midnight dark:text-fantasy-cream line-clamp-1">
                                {assignedTask.title}
                              </p>
                            ) : (
                              <p className="font-heading text-sm font-semibold text-fantasy-midnight dark:text-fantasy-cream">
                                {slot.label}
                              </p>
                            )}
                          </div>
                          {assignedTask ? (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => handleRemoveAssignment(day, slot.id, e)}
                              className="p-1 hover:bg-red-500/20 rounded transition-colors"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </motion.button>
                          ) : (
                            <Plus className="w-4 h-4 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </motion.button>
                    </div>
                  );
                })}
              </div>

              {/* Completed Tasks */}
              {tasksForDay.length > 0 && (
                <div className="mt-3 pt-3 border-t-2 border-fantasy-lavender/20 space-y-2">
                  <p className="font-body text-xs font-semibold text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                    Completed:
                  </p>
                  {tasksForDay.map((task) => task && (
                    <motion.button
                      key={task.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedTask(task.id);
                        setSelectedDate(day);
                      }}
                      className="w-full text-left p-2 bg-green-500/10 rounded-lg border border-green-500/30 hover:bg-green-500/20 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <p className="font-body text-xs text-fantasy-midnight dark:text-fantasy-cream line-clamp-1">
                          {task.title}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Task Assign Modal */}
      {showAssignModal && selectedSlot && (
        <TaskAssignModal
          date={selectedSlot.date}
          slotId={selectedSlot.slotId}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedSlot(null);
          }}
        />
      )}

      {/* Task Modal */}
      {task && selectedDate && (
        <TaskModal
          task={task}
          date={selectedDate}
          onClose={() => {
            setSelectedTask(null);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
};