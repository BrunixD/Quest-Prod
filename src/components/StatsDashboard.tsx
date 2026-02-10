'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { TrendingUp, Award, CheckCircle, Flame } from 'lucide-react';
import { format } from 'date-fns';

export const StatsDashboard: React.FC = () => {
  const { gameState, getTodayProgress } = useGame();
  const todayProgress = getTodayProgress();
  const { streak } = gameState.userProgress;

  const stats = [
    {
      icon: CheckCircle,
      label: 'Today',
      value: `${todayProgress.completedTasks}/${todayProgress.totalTasks}`,
      color: 'from-velaris-500 to-velaris-700',
      iconColor: 'text-velaris-300',
      bgColor: 'bg-velaris-500/10',
    },
    {
      icon: TrendingUp,
      label: 'XP Today',
      value: todayProgress.xpEarned >= 0 ? `+${todayProgress.xpEarned}` : `${todayProgress.xpEarned}`,
      color: 'from-rhysand-500 to-rhysand-700',
      iconColor: 'text-rhysand-300',
      bgColor: 'bg-rhysand-500/10',
      textColor: todayProgress.xpEarned >= 0 ? 'text-violet-200' : 'text-red-400',
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${streak} days`,
      color: 'from-orange-500 to-red-600',
      iconColor: 'text-orange-300',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Award,
      label: 'Level',
      value: gameState.userProgress.currentLevel,
      color: 'from-yellow-500 to-amber-600',
      iconColor: 'text-yellow-300',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card-dark rounded-xl p-5 border-2 border-velaris-500/20 hover:border-velaris-400/40 transition-all glow-purple"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              
              <div className="flex-1">
                <p className="font-body text-xs text-violet-300/60 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className={`font-heading text-2xl font-bold ${stat.textColor || 'text-violet-200'}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};