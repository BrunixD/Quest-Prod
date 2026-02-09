'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { Settings as SettingsIcon, Volume2, VolumeX, Moon, Sun, RotateCcw, Smile, User, Upload } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const { gameState, toggleDarkMode, toggleSound, resetProgress, setProfileIcon } = useGame();
  const { user } = useAuth();
  const { soundEnabled, darkMode } = gameState.settings;
  const [uploading, setUploading] = useState(false);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Set the profile icon to the uploaded image URL
      setProfileIcon(data.publicUrl);
      
    } catch (error: any) {
      alert('Error uploading photo: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const iconOptions = ['⚔️', '🎨', '📚', '🎮', '💎', '🔥', '✨', '👑', '🌟', '💜', '🦇', '🎯'];

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-fantasy-midnight dark:text-fantasy-cream flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-primary-500" />
        Settings
      </h2>

      <div className="space-y-4">
        {/* Profile Icon & Picture */}
        <div className="bg-gradient-to-r from-fantasy-peach/20 to-fantasy-lavender/20 rounded-2xl p-6 border-2 border-fantasy-peach/30">
          <div className="flex items-center gap-3 mb-4">
            <Smile className="w-6 h-6 text-fantasy-peach" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-fantasy-midnight dark:text-fantasy-cream">
                Profile Picture
              </h3>
              <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                Choose an emoji or upload a photo
              </p>
            </div>
          </div>

          {/* Current Profile Display */}
          <div className="mb-4 flex justify-center">
            {gameState.userProgress.profileIcon ? (
              gameState.userProgress.profileIcon.startsWith('http') ? (
                <img 
                  src={gameState.userProgress.profileIcon} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-500/30"
                />
              ) : (
                <div className="text-8xl">{gameState.userProgress.profileIcon}</div>
              )
            ) : (
              <div className="w-24 h-24 rounded-full bg-fantasy-lavender/20 flex items-center justify-center">
                <User className="w-12 h-12 text-fantasy-midnight/40" />
              </div>
            )}
          </div>

          {/* Upload Photo Button */}
          <div className="mb-4">
            <label className="w-full cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-heading font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </motion.div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          
          {/* Emoji Icons */}
          <p className="font-body text-xs font-bold text-fantasy-midnight/60 dark:text-fantasy-cream/60 mb-2">
            Or choose an emoji:
          </p>
          <div className="grid grid-cols-6 gap-3 mb-4">
            {iconOptions.map(icon => (
              <motion.button
                key={icon}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setProfileIcon(icon)}
                className={`text-4xl p-3 rounded-xl border-2 transition-all ${
                  gameState.userProgress.profileIcon === icon
                    ? 'bg-primary-500/20 border-primary-500 shadow-lg'
                    : 'bg-white/30 dark:bg-fantasy-midnight/30 border-fantasy-lavender/30 hover:border-primary-400'
                }`}
              >
                {icon}
              </motion.button>
            ))}
          </div>

          {/* Clear Icon Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setProfileIcon(undefined)}
            className="w-full px-4 py-2 bg-fantasy-midnight/10 dark:bg-fantasy-cream/10 rounded-lg font-body text-sm hover:bg-fantasy-midnight/20 dark:hover:bg-fantasy-cream/20 transition-colors"
          >
            Clear Profile Picture
          </motion.button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="bg-gradient-to-r from-fantasy-lavender/20 to-fantasy-midnight/20 rounded-2xl p-6 border-2 border-fantasy-lavender/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-6 h-6 text-fantasy-lavender" /> : <Sun className="w-6 h-6 text-fantasy-gold" />}
              <div>
                <h3 className="font-heading text-lg font-semibold text-fantasy-midnight dark:text-fantasy-cream">
                  Dark Mode
                </h3>
                <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                  Toggle between light and dark themes
                </p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                darkMode ? 'bg-primary-500' : 'bg-fantasy-midnight/20'
              }`}
            >
              <motion.div
                animate={{ x: darkMode ? 32 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </motion.button>
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="bg-gradient-to-r from-fantasy-sage/20 to-fantasy-lavender/20 rounded-2xl p-6 border-2 border-fantasy-sage/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="w-6 h-6 text-fantasy-sage" /> : <VolumeX className="w-6 h-6 text-fantasy-midnight/40" />}
              <div>
                <h3 className="font-heading text-lg font-semibold text-fantasy-midnight dark:text-fantasy-cream">
                  Sound Effects
                </h3>
                <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                  Enable or disable sound notifications
                </p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleSound}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                soundEnabled ? 'bg-fantasy-sage' : 'bg-fantasy-midnight/20'
              }`}
            >
              <motion.div
                animate={{ x: soundEnabled ? 32 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </motion.button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="bg-gradient-to-r from-fantasy-gold/20 to-fantasy-peach/20 rounded-2xl p-6 border-2 border-fantasy-gold/30">
          <h3 className="font-heading text-lg font-semibold text-fantasy-midnight dark:text-fantasy-cream mb-4">
            Your Progress
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/30 dark:bg-fantasy-midnight/30 rounded-lg p-4">
              <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">Total Tasks</p>
              <p className="font-heading text-2xl font-bold text-fantasy-midnight dark:text-fantasy-cream">
                {gameState.tasks.length}
              </p>
            </div>
            
            <div className="bg-white/30 dark:bg-fantasy-midnight/30 rounded-lg p-4">
              <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">Completed</p>
              <p className="font-heading text-2xl font-bold text-green-600 dark:text-green-400">
                {gameState.tasks.filter(t => t.completed).length}
              </p>
            </div>
            
            <div className="bg-white/30 dark:bg-fantasy-midnight/30 rounded-lg p-4">
              <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">Total XP</p>
              <p className="font-heading text-2xl font-bold text-primary-600 dark:text-primary-400">
                {gameState.userProgress.totalXP}
              </p>
            </div>
            
            <div className="bg-white/30 dark:bg-fantasy-midnight/30 rounded-lg p-4">
              <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">Best Streak</p>
              <p className="font-heading text-2xl font-bold text-orange-600 dark:text-orange-400">
                {gameState.userProgress.streak} 🔥
              </p>
            </div>
          </div>
        </div>

        {/* Reset Progress */}
        <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-2xl p-6 border-2 border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-heading text-lg font-semibold text-fantasy-midnight dark:text-fantasy-cream">
                  Reset Progress
                </h3>
                <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                  Clear all data and start fresh
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-heading font-semibold transition-colors"
            >
              Reset
            </motion.button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-fantasy-lavender/10 rounded-lg p-4 border-2 border-fantasy-lavender/30">
          <p className="font-body text-sm text-fantasy-midnight/70 dark:text-fantasy-cream/70 text-center">
            Quest Productivity System v1.0 <br />
            Made with 💜 for productive adventurers
          </p>
        </div>
      </div>
    </div>
  );
};