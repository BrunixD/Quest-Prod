'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { Sparkles, Sword, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fantasy-cream via-fantasy-peach/30 to-fantasy-lavender/40 bg-fantasy-pattern flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-white/90 to-fantasy-cream/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-4 border-fantasy-lavender/30">
          {/* Logo Area */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="text-8xl mb-4"
            >
              ⚔️
            </motion.div>
            
            <h1 className="font-heading text-4xl font-bold text-fantasy-midnight mb-2 flex items-center justify-center gap-2">
              Quest System
              <Sparkles className="w-6 h-6 text-primary-500 animate-sparkle" />
            </h1>
            
            <p className="font-body text-fantasy-midnight/70 text-lg">
              Transform Productivity into Adventure
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 bg-fantasy-lavender/20 rounded-xl p-3"
            >
              <Sword className="w-5 h-5 text-primary-500" />
              <span className="font-body text-sm text-fantasy-midnight">
                Complete daily quests & earn XP
              </span>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 bg-fantasy-sage/20 rounded-xl p-3"
            >
              <Shield className="w-5 h-5 text-fantasy-sage" />
              <span className="font-body text-sm text-fantasy-midnight">
                Level up from Adventurer to Master
              </span>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 bg-fantasy-gold/20 rounded-xl p-3"
            >
              <Sparkles className="w-5 h-5 text-fantasy-gold" />
              <span className="font-body text-sm text-fantasy-midnight">
                Unlock rewards & maintain streaks
              </span>
            </motion.div>
          </div>

          {/* Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-gray-50 text-fantasy-midnight font-heading font-bold text-lg py-4 px-6 rounded-xl border-2 border-fantasy-lavender/30 shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </motion.button>

          {/* Privacy Note */}
          <p className="text-center text-xs text-fantasy-midnight/50 mt-6">
            Your progress syncs across all devices
          </p>
        </div>

        {/* Footer Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="font-body text-sm text-fantasy-midnight/60">
            🔒 Secure • ☁️ Cloud Saved • 📱 Cross-Device
          </p>
        </motion.div>
      </motion.div>

      {/* Floating Decorations */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl pointer-events-none"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: -50,
            opacity: 0
          }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [0, 1, 1, 0],
            rotate: 360
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear'
          }}
        >
          {['✨', '⚔️', '🎯', '👑', '🔥', '💎'][i]}
        </motion.div>
      ))}
    </div>
  );
};
