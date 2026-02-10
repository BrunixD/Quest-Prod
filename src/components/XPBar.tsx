'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { getXPForNextLevel } from '@/lib/storage';
import { LEVELS } from '@/data/constants';
import { Star, Trophy } from 'lucide-react';

export const XPBar: React.FC = () => {
  const { gameState } = useGame();
  const { totalXP, currentLevel } = gameState.userProgress;
  
  const currentLevelXP = getXPForNextLevel(currentLevel - 1);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  const levelData = LEVELS.find(l => l.level === currentLevel);
  const nextLevelData = LEVELS.find(l => l.level === currentLevel + 1);

  return (
    <div className="glass-card-dark rounded-2xl p-6 border-2 border-velaris-500/30 glow-purple">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-velaris-400 to-rhysand-600 flex items-center justify-center glow-violet text-2xl">
            {levelData?.icon || '✨'}
          </div>
          <div>
            <h3 className="font-heading text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
              Level {currentLevel}
            </h3>
            <p className="font-body text-sm text-violet-200/90 font-semibold">
              {levelData?.title || 'Adventurer'}
            </p>
            <p className="font-body text-xs text-violet-300/70">
              {xpInCurrentLevel} / {xpNeededForNextLevel} XP
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="font-heading text-xl font-bold text-violet-200">
              {totalXP} XP
            </span>
          </div>
          <p className="font-body text-xs text-violet-300/60">Total Experience</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-8 bg-night-900/50 rounded-full overflow-hidden border-2 border-velaris-500/30">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-velaris-500 via-rhysand-400 to-velaris-600 rounded-full shimmer"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-sm font-bold text-white drop-shadow-lg z-10">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {nextLevelData && (
        <p className="text-center font-body text-xs text-violet-300/70 mt-3">
          {xpNeededForNextLevel - xpInCurrentLevel} XP until <span className="font-semibold text-violet-300">{nextLevelData.title}</span> {nextLevelData.icon}
        </p>
      )}
    </div>
  );
};