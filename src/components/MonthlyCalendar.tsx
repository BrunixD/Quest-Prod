'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';
import { DayScheduleModal } from './DayScheduleModal';

export const MonthlyCalendar: React.FC = () => {
  const { gameState } = useGame();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const getDayProgress = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return gameState.userProgress.weeklyProgress[dateStr];
  };

  const getCompletionRate = (date: Date) => {
    const progress = getDayProgress(date);
    if (!progress || progress.totalTasks === 0) return 0;
    return (progress.completedTasks / progress.totalTasks) * 100;
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
          <Calendar className="w-6 h-6 text-velaris-400" />
          Monthly View
        </h2>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 glass-card rounded-lg border-2 border-velaris-400/30 hover:border-velaris-400/50 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-violet-200" />
          </motion.button>

          <span className="font-heading text-lg font-semibold text-violet-200 min-w-[200px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 glass-card rounded-lg border-2 border-velaris-400/30 hover:border-velaris-400/50 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-violet-200" />
          </motion.button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-card-dark rounded-2xl p-4 border-2 border-velaris-500/30">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center py-2">
              <span className="font-heading text-sm font-semibold text-violet-300/70">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const progress = getDayProgress(day);
            const completionRate = getCompletionRate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isDayToday = isToday(day);
            const hasTasks = progress && progress.totalTasks > 0;

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                whileHover={isCurrentMonth ? { scale: 1.05 } : {}}
                onClick={() => isCurrentMonth && setSelectedDate(day)}
                className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                  !isCurrentMonth 
                    ? 'bg-transparent border-transparent opacity-30 cursor-default' 
                    : isDayToday
                      ? 'glass-card border-velaris-400 glow-purple cursor-pointer'
                      : 'glass-card border-velaris-400/20 hover:border-velaris-400/40 cursor-pointer'
                }`}
              >
                <div className="flex flex-col h-full">
                  {/* Day Number */}
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-heading text-sm font-semibold ${
                      isDayToday 
                        ? 'text-velaris-300' 
                        : isCurrentMonth 
                          ? 'text-violet-200' 
                          : 'text-violet-400/40'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {hasTasks && (
                      <div className={`w-2 h-2 rounded-full ${
                        completionRate === 100 ? 'bg-green-400' :
                        completionRate >= 50 ? 'bg-velaris-400' :
                        completionRate > 0 ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                    )}
                  </div>

                  {/* Mini Progress Bar */}
                  {hasTasks && isCurrentMonth && (
                    <div className="mt-auto">
                      <div className="h-1 bg-velaris-500/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            completionRate === 100 ? 'bg-green-400' :
                            completionRate >= 50 ? 'bg-velaris-400' :
                            'bg-yellow-400'
                          }`}
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-center text-violet-300/70 mt-1">
                        {progress.completedTasks}/{progress.totalTasks}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(() => {
          const monthProgress = Object.values(gameState.userProgress.weeklyProgress).filter(
            p => {
              const date = new Date(p.date);
              return isSameMonth(date, currentMonth);
            }
          );

          const totalDays = monthProgress.length;
          const totalCompleted = monthProgress.reduce((sum, p) => sum + p.completedTasks, 0);
          const totalTasks = monthProgress.reduce((sum, p) => sum + p.totalTasks, 0);
          const totalXP = monthProgress.reduce((sum, p) => sum + p.xpEarned, 0);
          const perfectDays = monthProgress.filter(p => p.completedTasks === p.totalTasks && p.totalTasks > 0).length;

          return (
            <>
              <div className="glass-card-dark rounded-xl p-4 border-2 border-velaris-400/20">
                <p className="font-body text-xs text-violet-300/70 uppercase tracking-wide mb-1">
                  Active Days
                </p>
                <p className="font-heading text-2xl font-bold text-violet-200">
                  {totalDays}
                </p>
              </div>

              <div className="glass-card-dark rounded-xl p-4 border-2 border-velaris-400/20">
                <p className="font-body text-xs text-violet-300/70 uppercase tracking-wide mb-1">
                  Tasks Done
                </p>
                <p className="font-heading text-2xl font-bold text-green-400">
                  {totalCompleted}/{totalTasks}
                </p>
              </div>

              <div className="glass-card-dark rounded-xl p-4 border-2 border-velaris-400/20">
                <p className="font-body text-xs text-violet-300/70 uppercase tracking-wide mb-1">
                  Total XP
                </p>
                <p className={`font-heading text-2xl font-bold ${
                  totalXP >= 0 ? 'text-velaris-300' : 'text-red-400'
                }`}>
                  {totalXP >= 0 ? '+' : ''}{totalXP}
                </p>
              </div>

              <div className="glass-card-dark rounded-xl p-4 border-2 border-velaris-400/20">
                <p className="font-body text-xs text-violet-300/70 uppercase tracking-wide mb-1">
                  Perfect Days
                </p>
                <p className="font-heading text-2xl font-bold text-yellow-400">
                  {perfectDays}
                </p>
              </div>
            </>
          );
        })()}
      </div>

      {/* Day Schedule Modal */}
      <AnimatePresence>
        {selectedDate && (
          <DayScheduleModal
            date={selectedDate}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};