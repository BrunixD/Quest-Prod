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

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

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
      <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-velaris-400" />
        Settings
      </h2>

      <div className="space-y-4">
        {/* Profile Icon & Picture */}
        <div className="glass-card-dark rounded-2xl p-6 border-2 border-velaris-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Smile className="w-6 h-6 text-velaris-400" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-violet-200">
                Profile Picture
              </h3>
              <p className="font-body text-sm text-violet-300/70">
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
                  className="w-24 h-24 rounded-full object-cover border-4 border-velaris-500/30 glow-purple"
                />
              ) : (
                <div className="text-8xl">{gameState.userProgress.profileIcon}</div>
              )
            ) : (
              <div className="w-24 h-24 rounded-full bg-velaris-500/20 flex items-center justify-center border-2 border-velaris-400/30">
                <User className="w-12 h-12 text-velaris-300/40" />
              </div>
            )}
          </div>

          {/* Upload Photo Button */}
          <div className="mb-4">
            <label className="w-full cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-velaris-500 hover:bg-velaris-600 text-white rounded-lg font-heading font-semibold transition-colors flex items-center justify-center gap-2 glow-purple"
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
          <p className="font-body text-xs font-bold text-violet-300/70 mb-2">
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
                    ? 'bg-velaris-500/20 border-velaris-500 glow-purple'
                    : 'glass-card border-velaris-400/20 hover:border-velaris-400/40'
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
            className="w-full px-4 py-2 glass-card rounded-lg font-body text-sm hover:bg-velaris-500/20 transition-colors text-violet-200"
          >
            Clear Profile Picture
          </motion.button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="glass-card-dark rounded-2xl p-6 border-2 border-velaris-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-6 h-6 text-velaris-400" /> : <Sun className="w-6 h-6 text-yellow-400" />}
              <div>
                <h3 className="font-heading text-lg font-semibold text-violet-200">
                  Dark Mode
                </h3>
                <p className="font-body text-sm text-violet-300/70">
                  Toggle between light and dark themes
                </p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                darkMode ? 'bg-velaris-500' : 'bg-velaris-500/30'
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
        <div className="glass-card-dark rounded-2xl p-6 border-2 border-velaris-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="w-6 h-6 text-velaris-400" /> : <VolumeX className="w-6 h-6 text-velaris-300/40" />}
              <div>
                <h3 className="font-heading text-lg font-semibold text-violet-200">
                  Sound Effects
                </h3>
                <p className="font-body text-sm text-violet-300/70">
                  Enable or disable sound notifications
                </p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleSound}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                soundEnabled ? 'bg-velaris-500' : 'bg-velaris-500/30'
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
        <div className="glass-card-dark rounded-2xl p-6 border-2 border-velaris-500/30">
          <h3 className="font-heading text-lg font-semibold text-violet-200 mb-4">
            Your Progress
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-lg p-4 border border-velaris-400/20">
              <p className="font-body text-sm text-violet-300/70">Total Tasks</p>
              <p className="font-heading text-2xl font-bold text-violet-200">
                {gameState.tasks.length}
              </p>
            </div>
            
            <div className="glass-card rounded-lg p-4 border border-velaris-400/20">
              <p className="font-body text-sm text-violet-300/70">Completed</p>
              <p className="font-heading text-2xl font-bold text-green-400">
                {gameState.tasks.filter(t => t.completed).length}
              </p>
            </div>
            
            <div className="glass-card rounded-lg p-4 border border-velaris-400/20">
              <p className="font-body text-sm text-violet-300/70">Total XP</p>
              <p className="font-heading text-2xl font-bold text-velaris-300">
                {gameState.userProgress.totalXP}
              </p>
            </div>
            
            <div className="glass-card rounded-lg p-4 border border-velaris-400/20">
              <p className="font-body text-sm text-violet-300/70">Best Streak</p>
              <p className="font-heading text-2xl font-bold text-orange-400">
                {gameState.userProgress.streak} 🔥
              </p>
            </div>
          </div>
        </div>

        {/* Reset Progress */}
        <div className="glass-card-dark rounded-2xl p-6 border-2 border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="font-heading text-lg font-semibold text-violet-200">
                  Reset Progress
                </h3>
                <p className="font-body text-sm text-violet-300/70">
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
        <div className="glass-card-dark rounded-lg p-4 border-2 border-velaris-500/20">
          <p className="font-body text-sm text-violet-300/70 text-center">
            Night Court Quest System v1.0 <br />
            To the stars who listen — and the dreams that are answered 🌙✨
          </p>
        </div>
      </div>
    </div>
  );
};