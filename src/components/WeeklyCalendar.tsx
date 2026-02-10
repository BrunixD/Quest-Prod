'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { DayScheduleModal } from './DayScheduleModal';

export const WeeklyCalendar: React.FC = () => {
  const { gameState } = useGame();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getDayProgress = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return gameState.userProgress.weeklyProgress[dateStr];
  };

  const getCompletionRate = (date: Date) => {
    const progress = getDayProgress(date);
    if (!progress || progress.totalTasks === 0) return 0;
    return (progress.completedTasks / progress.totalTasks) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
          <Calendar className="w-6 h-6 text-velaris-400" />
          Weekly View
        </h2>

        <div className="flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
            className="p-2 glass-card rounded-lg border-2 border-velaris-400/30 hover:border-velaris-400/50 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-violet-200" />
          </motion.button>

          <span className="font-heading text-base sm:text-lg font-semibold text-violet-200 min-w-[180px] sm:min-w-[200px] text-center">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            className="p-2 glass-card rounded-lg border-2 border-velaris-400/30 hover:border-velaris-400/50 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-violet-200" />
          </motion.button>
        </div>
      </div>

      {/* Week Days - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {weekDays.map((day, index) => {
          const progress = getDayProgress(day);
          const completionRate = getCompletionRate(day);
          const isToday = isSameDay(day, new Date());
          const hasTasks = progress && progress.totalTasks > 0;
          const slotsCompleted = progress?.slotsCompleted?.length || 0;
          const slotsSkipped = progress?.slotsSkipped?.length || 0;

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedDate(day)}
              className={`glass-card-dark rounded-xl p-4 border-2 cursor-pointer transition-all ${
                isToday 
                  ? 'border-velaris-400 glow-purple' 
                  : 'border-velaris-400/20 hover:border-velaris-400/40'
              }`}
            >
              {/* Day Header */}
              <div className="text-center mb-3">
                <p className="font-body text-xs text-violet-300/70 uppercase tracking-wide">
                  {format(day, 'EEE')}
                </p>
                <p className={`font-heading text-2xl font-bold ${
                  isToday ? 'text-velaris-300' : 'text-violet-200'
                }`}>
                  {format(day, 'd')}
                </p>
              </div>

              {/* Progress Ring */}
              {hasTasks ? (
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-velaris-500/20"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionRate / 100)}`}
                      className={`transition-all duration-500 ${
                        completionRate === 100 ? 'text-green-400' :
                        completionRate >= 50 ? 'text-velaris-400' :
                        'text-yellow-400'
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-sm font-bold text-violet-200">
                      {Math.round(completionRate)}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-velaris-500/10 flex items-center justify-center">
                  <span className="text-2xl text-violet-300/40">—</span>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-violet-300/70">Tasks</span>
                  <span className="font-semibold text-violet-200">
                    {progress?.completedTasks || 0}/{progress?.totalTasks || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-violet-300/70">XP</span>
                  <span className={`font-semibold ${
                    (progress?.xpEarned || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {(progress?.xpEarned || 0) >= 0 ? '+' : ''}{progress?.xpEarned || 0}
                  </span>
                </div>
              </div>

              {/* Icons */}
              {hasTasks && (
                <div className="flex gap-1 justify-center mt-3 flex-wrap">
                  {slotsCompleted > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-bold text-green-400">{slotsCompleted}</span>
                    </div>
                  )}
                  {slotsSkipped > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full">
                      <XCircle className="w-3 h-3 text-red-400" />
                      <span className="text-xs font-bold text-red-400">{slotsSkipped}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="glass-card-dark rounded-xl p-4 border-2 border-velaris-400/20">
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-violet-300/70">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-velaris-400"></div>
            <span className="text-violet-300/70">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-violet-300/70">Started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-violet-300/70">Skipped</span>
          </div>
        </div>
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