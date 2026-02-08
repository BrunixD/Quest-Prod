'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { Flame, Target, TrendingUp, Calendar } from 'lucide-react';

export const StatsDashboard: React.FC = () => {
  const { gameState, getTodayProgress } = useGame();
  const todayProgress = getTodayProgress();
  const { streak } = gameState.userProgress;

  const stats = [
    {
      icon: <Flame className="w-6 h-6" />,
      label: 'Day Streak',
      value: streak,
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Tasks Today',
      value: `${todayProgress.completedTasks}/4`,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'XP Today',
      value: `+${todayProgress.xpEarned}`,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Weekly Tasks',
      value: gameState.weeklyRotation.selectedTasks.length,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} backdrop-blur-sm rounded-2xl p-6 border-2 border-fantasy-lavender/20 shadow-lg hover:shadow-xl transition-all`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
              {stat.icon}
            </div>
          </div>
          
          <div>
            <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60 mb-1">
              {stat.label}
            </p>
            <p className={`font-heading text-3xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>

          {stat.label === 'Day Streak' && streak > 0 && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-2"
            >
              <p className="font-body text-xs text-orange-600 dark:text-orange-400 font-semibold">
                🔥 Keep it going!
              </p>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
