'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { ShoppingBag, Plus, Sparkles, Check, X, Trash2 } from 'lucide-react';

export const RewardsShop: React.FC = () => {
  const { gameState, purchaseReward, addCustomReward, deleteReward } = useGame();
  const [showAddReward, setShowAddReward] = useState(false);
  const [newReward, setNewReward] = useState({
    title: '',
    xpCost: 50,
    description: '',
    icon: '🎁',
  });

  const handlePurchase = (rewardId: string) => {
    purchaseReward(rewardId);
  };

  const handleDeleteReward = (rewardId: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      deleteReward(rewardId);
    }
  };

  const handleAddReward = () => {
    if (newReward.title.trim() && newReward.xpCost > 0) {
      addCustomReward(newReward);
      setNewReward({
        title: '',
        xpCost: 50,
        description: '',
        icon: '🎁',
      });
      setShowAddReward(false);
    }
  };

  const availableRewards = gameState.rewards.filter(r => !r.purchased);
  const purchasedRewards = gameState.rewards.filter(r => r.purchased);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-fantasy-midnight dark:text-fantasy-cream flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary-500" />
          Reward Shop
        </h2>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-fantasy-gold/20 rounded-lg border-2 border-fantasy-gold/50">
            <span className="font-heading text-lg font-bold text-fantasy-midnight dark:text-fantasy-cream flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-fantasy-gold" />
              {gameState.userProgress.totalXP} XP
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddReward(!showAddReward)}
            className="px-4 py-2 bg-fantasy-sage hover:bg-fantasy-sage/80 text-white rounded-lg font-heading font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Custom Reward
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showAddReward && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-fantasy-gold/20 to-fantasy-peach/20 rounded-2xl p-6 border-2 border-fantasy-gold/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-fantasy-midnight dark:text-fantasy-cream">
                Create Custom Reward
              </h3>
              <button
                onClick={() => setShowAddReward(false)}
                className="text-fantasy-midnight/60 hover:text-fantasy-midnight dark:text-fantasy-cream/60 dark:hover:text-fantasy-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="font-body text-sm font-semibold text-fantasy-midnight dark:text-fantasy-cream block mb-2">
                    Reward Name
                  </label>
                  <input
                    type="text"
                    value={newReward.title}
                    onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-gold/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body"
                    placeholder="What's your reward?"
                  />
                </div>

                <div>
                  <label className="font-body text-sm font-semibold text-fantasy-midnight dark:text-fantasy-cream block mb-2">
                    XP Cost
                  </label>
                  <input
                    type="number"
                    value={newReward.xpCost}
                    onChange={(e) => setNewReward({ ...newReward, xpCost: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-gold/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-fantasy-midnight dark:text-fantasy-cream block mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={newReward.icon}
                  onChange={(e) => setNewReward({ ...newReward, icon: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-gold/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body"
                  placeholder="🎁"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-fantasy-midnight dark:text-fantasy-cream block mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-fantasy-gold/30 bg-white/50 dark:bg-fantasy-midnight/50 font-body resize-none"
                  rows={2}
                  placeholder="Describe your reward..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddReward}
                className="w-full px-4 py-3 bg-fantasy-gold hover:bg-fantasy-gold/80 text-fantasy-midnight rounded-lg font-heading font-bold transition-colors"
              >
                Add Reward
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h3 className="font-heading text-xl font-semibold text-fantasy-midnight dark:text-fantasy-cream mb-4">
          Available Rewards
        </h3>
        
        {availableRewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward, index) => {
              const canAfford = gameState.userProgress.totalXP >= reward.xpCost;

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br from-white/50 to-fantasy-cream/50 dark:from-fantasy-midnight/50 dark:to-fantasy-deep/50 rounded-2xl p-6 border-2 ${
                    canAfford ? 'border-fantasy-gold shadow-lg hover:shadow-xl' : 'border-fantasy-lavender/30 opacity-75'
                  } backdrop-blur-sm transition-all`}
                >
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-3 animate-float">{reward.icon}</div>
                    <h4 className="font-heading text-lg font-bold text-fantasy-midnight dark:text-fantasy-cream">
                      {reward.title}
                    </h4>
                    {reward.description && (
                      <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60 mt-2">
                        {reward.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading text-2xl font-bold text-fantasy-gold flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      {reward.xpCost} XP
                    </span>
                    {!canAfford && (
                      <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                        Need {reward.xpCost - gameState.userProgress.totalXP} more XP
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: canAfford ? 1.05 : 1 }}
                      whileTap={{ scale: canAfford ? 0.95 : 1 }}
                      onClick={() => canAfford && handlePurchase(reward.id)}
                      disabled={!canAfford}
                      className={`flex-1 px-4 py-3 rounded-lg font-heading font-bold transition-all ${
                        canAfford
                          ? 'bg-fantasy-gold hover:bg-fantasy-gold/80 text-fantasy-midnight shadow-md'
                          : 'bg-fantasy-midnight/10 dark:bg-fantasy-cream/10 text-fantasy-midnight/40 dark:text-fantasy-cream/40 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Claim Reward' : 'Insufficient XP'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteReward(reward.id)}
                      className="px-3 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      title="Delete reward"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-fantasy-lavender/10 rounded-2xl border-2 border-fantasy-lavender/30">
            <p className="font-body text-fantasy-midnight/60 dark:text-fantasy-cream/60">
              All rewards claimed! Add custom rewards to keep the motivation going! ✨
            </p>
          </div>
        )}
      </div>

      {purchasedRewards.length > 0 && (
        <div>
          <h3 className="font-heading text-xl font-semibold text-fantasy-midnight dark:text-fantasy-cream mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Claimed Rewards
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {purchasedRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-green-500/10 rounded-xl p-4 border-2 border-green-500/30 text-center"
              >
                <div className="text-4xl mb-2 opacity-50">{reward.icon}</div>
                <p className="font-body text-xs text-fantasy-midnight/60 dark:text-fantasy-cream/60 line-through">
                  {reward.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};