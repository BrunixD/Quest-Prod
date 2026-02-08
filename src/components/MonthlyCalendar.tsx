'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { TaskModal } from './TaskModal';
import { DayScheduleModal } from './DayScheduleModal';
import { TaskAssignModal } from './TaskAssignModal';

export const MonthlyCalendar: React.FC = () => {
  const { gameState, getSlotAssignment } = useGame();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDaySchedule, setShowDaySchedule] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; slotId: string } | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayProgress = gameState.userProgress.weeklyProgress[dateStr];
    
    if (!dayProgress) return [];
    
    return dayProgress.tasksCompleted.map(taskId => 
      gameState.tasks.find(t => t.id === taskId)
    ).filter(Boolean);
  };

  const getAssignedTasksForDate = (date: Date) => {
    const taskSlots = gameState.schedule.filter(s => s.type === 'task');
    return taskSlots.map(slot => {
      const taskId = getSlotAssignment(date, slot.id);
      return taskId ? gameState.tasks.find(t => t.id === taskId) : null;
    }).filter(Boolean);
  };

  const handleDayClick = (date: Date, e: React.MouseEvent) => {
    // Check if clicking on a task dot
    if ((e.target as HTMLElement).closest('.task-dot')) {
      return; // Don't open day schedule if clicking on task
    }
    setSelectedDate(date);
    setShowDaySchedule(true);
  };

  const task = selectedTask ? gameState.tasks.find(t => t.id === selectedTask) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-fantasy-midnight dark:text-fantasy-cream flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-primary-500" />
          {format(currentMonth, 'MMMM yyyy')}
        </h2>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPreviousMonth}
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
            onClick={goToNextMonth}
            className="p-2 bg-white/50 dark:bg-fantasy-midnight/50 rounded-lg border-2 border-fantasy-lavender/30 hover:border-primary-400 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center font-heading text-sm font-semibold text-fantasy-midnight/60 dark:text-fantasy-cream/60 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const completedTasks = getTasksForDate(day);
          const assignedTasks = getAssignedTasksForDate(day);
          const dayProgress = gameState.userProgress.weeklyProgress[format(day, 'yyyy-MM-dd')];
          const allTasks = [...completedTasks, ...assignedTasks];

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={(e) => handleDayClick(day, e)}
              className={`relative aspect-square p-2 rounded-xl border-2 transition-all ${
                isTodayDate
                  ? 'bg-primary-500/20 border-primary-500 shadow-lg'
                  : isCurrentMonth
                  ? 'bg-white/50 dark:bg-fantasy-midnight/50 border-fantasy-lavender/30 hover:border-primary-400'
                  : 'bg-fantasy-midnight/5 dark:bg-fantasy-deep/30 border-fantasy-midnight/10 dark:border-fantasy-cream/10 opacity-50'
              }`}
            >
              {/* Date Number */}
              <div className={`font-heading text-lg font-bold ${
                isTodayDate
                  ? 'text-primary-600 dark:text-primary-400'
                  : isCurrentMonth
                  ? 'text-fantasy-midnight dark:text-fantasy-cream'
                  : 'text-fantasy-midnight/30 dark:text-fantasy-cream/30'
              }`}>
                {format(day, 'd')}
              </div>

              {/* Task Dots - Clickable */}
              {allTasks.length > 0 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {allTasks.slice(0, 4).map((task, i) => task && (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.5 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task.id);
                        setSelectedDate(day);
                      }}
                      className={`task-dot w-1.5 h-1.5 rounded-full ${
                        completedTasks.includes(task) ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      title={task.title}
                    />
                  ))}
                </div>
              )}

              {/* XP Badge */}
              {dayProgress && dayProgress.xpEarned > 0 && (
                <div className="absolute top-1 right-1 bg-fantasy-gold/80 text-fantasy-midnight text-xs font-bold rounded-full px-1.5 py-0.5">
                  {dayProgress.xpEarned}
                </div>
              )}
            </motion.button>
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
      {task && selectedDate && !showDaySchedule && (
        <TaskModal
          task={task}
          date={selectedDate}
          onClose={() => {
            setSelectedTask(null);
            setSelectedDate(null);
          }}
        />
      )}

      {/* Day Schedule Modal */}
      {showDaySchedule && selectedDate && (
        <DayScheduleModal
          date={selectedDate}
          onClose={() => {
            setShowDaySchedule(false);
            setSelectedDate(null);
          }}
          onTaskClick={(taskId) => {
            setShowDaySchedule(false);
            setSelectedTask(taskId);
          }}
        />
      )}
    </div>
  );
};