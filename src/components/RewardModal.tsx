'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { X } from 'lucide-react';
import { Portal } from './Portal';

interface RewardModalProps {
  onClose: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({ onClose }) => {
  const { addCustomReward } = useGame();
  const [title, setTitle] = useState('');
  const [xpCost, setXpCost] = useState(100);
  const [icon, setIcon] = useState('🎁');
  const [description, setDescription] = useState('');

  const iconOptions = [
    '🎁', '💝', '🎉', '🌟', '✨', '💎', '👑', '🏆',
    '🎮', '📚', '🎨', '🍕', '🍰', '☕', '🎬', '🎵',
    '💜', '🦇', '🌙', '⭐', '🔥', '💫', '🌈', '🎯'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a reward title');
      return;
    }

    await addCustomReward({
      title: title.trim(),
      xpCost,
      icon,
      description: description.trim(),
    });

    onClose();
  };

  return (
    <Portal>
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        >
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card-dark rounded-2xl p-6 border-2 border-velaris-500/30 max-w-md w-full glow-purple"
        >
            <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                Create New Reward
            </h2>
            <button
                onClick={onClose}
                className="p-2 hover:bg-velaris-500/20 rounded-lg transition-colors"
            >
                <X className="w-5 h-5 text-violet-200" />
            </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
                <label className="block font-body text-sm font-semibold text-violet-200 mb-2">
                Reward Title *
                </label>
                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 glass-card rounded-lg border-2 border-velaris-400/30 bg-night-900/50 text-violet-100 font-body focus:border-velaris-400 focus:outline-none"
                placeholder="e.g., Buy a new book"
                required
                />
            </div>

            {/* Icon */}
            <div>
                <label className="block font-body text-sm font-semibold text-violet-200 mb-2">
                Choose Icon
                </label>
                <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 glass-card rounded-lg border-2 border-velaris-400/20">
                {iconOptions.map(emoji => (
                    <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={`text-2xl p-2 rounded-lg transition-all ${
                        icon === emoji
                        ? 'bg-velaris-500/30 border-2 border-velaris-400'
                        : 'hover:bg-velaris-500/10 border-2 border-transparent'
                    }`}
                    >
                    {emoji}
                    </button>
                ))}
                </div>
            </div>

            {/* XP Cost */}
            <div>
                <label className="block font-body text-sm font-semibold text-violet-200 mb-2">
                XP Cost
                </label>
                <input
                type="number"
                value={xpCost}
                onChange={(e) => setXpCost(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 glass-card rounded-lg border-2 border-velaris-400/30 bg-night-900/50 text-violet-100 font-body focus:border-velaris-400 focus:outline-none"
                min="1"
                max="10000"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block font-body text-sm font-semibold text-violet-200 mb-2">
                Description (Optional)
                </label>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 glass-card rounded-lg border-2 border-velaris-400/30 bg-night-900/50 text-violet-100 font-body focus:border-velaris-400 focus:outline-none resize-none"
                rows={3}
                placeholder="Describe this reward..."
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 glass-card rounded-lg font-heading font-semibold text-violet-200 hover:bg-velaris-500/20 transition-colors"
                >
                Cancel
                </motion.button>
                <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 px-4 py-2 bg-velaris-500 hover:bg-velaris-600 text-white rounded-lg font-heading font-semibold transition-colors glow-purple"
                >
                Create Reward
                </motion.button>
            </div>
            </form>
        </motion.div>
        </motion.div>
    </Portal>
  );
};