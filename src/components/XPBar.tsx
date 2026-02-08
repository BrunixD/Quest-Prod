'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { LEVELS } from '@/data/constants';
import { getXPProgress, getXPForNextLevel } from '@/lib/storage';
import { Sparkles } from 'lucide-react';

export const XPBar: React.FC = () => {
  const { gameState } = useGame();
  const { totalXP, currentLevel } = gameState.userProgress;
  
  const currentLevelData = LEVELS.find(l => l.level === currentLevel);
  const nextLevelData = LEVELS.find(l => l.level === currentLevel + 1);
  const progress = getXPProgress(totalXP, currentLevel);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  
  const isMaxLevel = currentLevel >= LEVELS.length;

  return (
    <div className="bg-gradient-to-br from-fantasy-lavender/20 to-fantasy-peach/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-fantasy-lavender/30 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl animate-float">{currentLevelData?.icon}</div>
          <div>
            <h3 className="font-heading text-xl font-bold text-fantasy-midnight dark:text-fantasy-cream">
              Level {currentLevel}
            </h3>
            <p className="font-body text-sm text-fantasy-midnight/70 dark:text-fantasy-cream/70">
              {currentLevelData?.title}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-heading text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-sparkle" />
            {totalXP} XP
          </div>
          {!isMaxLevel && (
            <p className="font-body text-xs text-fantasy-midnight/60 dark:text-fantasy-cream/60">
              {nextLevelXP - totalXP} XP to {nextLevelData?.title}
            </p>
          )}
        </div>
      </div>

      {!isMaxLevel ? (
        <div className="relative">
          <div className="h-6 bg-fantasy-midnight/10 dark:bg-fantasy-cream/10 rounded-full overflow-hidden border-2 border-fantasy-lavender/30">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-fantasy-gold rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer" 
                   style={{
                     backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                     backgroundSize: '200% 100%',
                   }}
              />
            </motion.div>
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="font-body text-xs text-fantasy-midnight/60 dark:text-fantasy-cream/60">
              {currentLevelData?.xpRequired} XP
            </span>
            <span className="font-heading text-sm font-bold text-primary-600 dark:text-primary-400">
              {Math.round(progress)}%
            </span>
            <span className="font-body text-xs text-fantasy-midnight/60 dark:text-fantasy-cream/60">
              {nextLevelXP} XP
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="font-heading text-lg font-bold text-fantasy-gold animate-pulse-glow">
            ✨ Maximum Level Reached! ✨
          </p>
          <p className="font-body text-sm text-fantasy-midnight/70 dark:text-fantasy-cream/70 mt-1">
            You are a legendary Master Crafter!
          </p>
        </div>
      )}
    </div>
  );
};
