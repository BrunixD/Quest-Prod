'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { Sparkles, Trophy, Star } from 'lucide-react';

export const CelebrationAnimation: React.FC = () => {
  const { getTodayProgress } = useGame();
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevCompleted, setPrevCompleted] = useState(0);

  useEffect(() => {
    const todayProgress = getTodayProgress();
    
    if (todayProgress.completedTasks === 4 && prevCompleted < 4) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
    
    setPrevCompleted(todayProgress.completedTasks);
  }, [getTodayProgress]);

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          
          {/* Celebration Card */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="relative bg-gradient-to-br from-fantasy-gold via-fantasy-peach to-fantasy-rose rounded-3xl p-12 shadow-2xl max-w-md mx-4 pointer-events-auto"
          >
            {/* Floating Stars */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-300"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  opacity: 0 
                }}
                animate={{
                  x: Math.cos(i * 30 * Math.PI / 180) * 150,
                  y: Math.sin(i * 30 * Math.PI / 180) * 150,
                  scale: [0, 1.5, 1],
                  opacity: [0, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Star className="w-6 h-6 fill-current" />
              </motion.div>
            ))}

            <div className="text-center relative z-10">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                }}
                className="text-8xl mb-4"
              >
                🎉
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-4xl font-bold text-white mb-2"
              >
                All Quests Complete!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-body text-lg text-white/90 mb-4"
              >
                You've conquered all 4 tasks today!
              </motion.p>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/40"
              >
                <Trophy className="w-6 h-6 text-yellow-200" />
                <span className="font-heading text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 animate-sparkle" />
                  +25 XP Bonus!
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="font-body text-sm text-white/80 mt-4"
              >
                Keep up the amazing work! 🌟
              </motion.p>
            </div>
          </motion.div>

          {/* Confetti-like particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#f4d56f', '#f4a5b9', '#c8b6e2', '#ffd6ba'][i % 4],
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: (Math.random() - 0.5) * 800,
                y: Math.random() * -600 - 200,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.05,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
