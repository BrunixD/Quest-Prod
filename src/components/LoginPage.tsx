'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { Sparkles, Sword, Shield, Mail, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
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
                Level up from Mortal to Cauldron Blessed
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-sm font-semibold text-fantasy-midnight block mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fantasy-midnight/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-fantasy-lavender/30 bg-white/50 font-body focus:border-primary-400 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="font-body text-sm font-semibold text-fantasy-midnight block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fantasy-midnight/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-fantasy-lavender/30 bg-white/50 font-body focus:border-primary-400 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-red-600">{error}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-heading font-bold text-lg py-4 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </motion.button>

            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center font-body text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </form>

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
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: -50,
            opacity: 0
          }}
          animate={{
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
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