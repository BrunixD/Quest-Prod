'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { ShoppingBag, Plus, Sparkles, CheckCircle, Trash2 } from 'lucide-react';
import { RewardModal } from './RewardModal';

export const RewardsShop: React.FC = () => {
  const { gameState, purchaseReward, deleteReward } = useGame();
  const [showRewardModal, setShowRewardModal] = useState(false);

  const availableRewards = gameState.rewards.filter(r => !r.purchased);
  const purchasedRewards = gameState.rewards.filter(r => r.purchased);

  const handlePurchase = (rewardId: string) => {
    const reward = gameState.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (gameState.userProgress.totalXP >= reward.xpCost) {
      if (confirm(`Purchase "${reward.title}" for ${reward.xpCost} XP?`)) {
        purchaseReward(rewardId);
      }
    } else {
      alert(`Not enough XP! You need ${reward.xpCost - gameState.userProgress.totalXP} more XP.`);
    }
  };

  const handleDeleteReward = (rewardId: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      deleteReward(rewardId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-velaris-400" />
            Rewards Shop
          </h2>
          <p className="font-body text-sm text-violet-300/70 mt-1">
            Spend your hard-earned XP on rewards you deserve!
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowRewardModal(true)}
          className="px-4 py-2 bg-velaris-500 hover:bg-velaris-600 text-white rounded-lg font-heading font-semibold flex items-center gap-2 transition-colors glow-purple"
        >
          <Plus className="w-5 h-5" />
          Add Reward
        </motion.button>
      </div>

      {/* Available Rewards */}
      <div className="glass-card-dark rounded-2xl p-6 border-2 border-velaris-500/30">
        <h3 className="font-heading text-xl font-bold text-violet-200 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
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
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card rounded-xl p-5 border-2 transition-all group ${
                    canAfford 
                      ? 'border-velaris-400/40 hover:border-velaris-400/60 hover:glow-purple' 
                      : 'border-velaris-400/20 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{reward.icon}</div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteReward(reward.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>

                  <h4 className="font-heading text-lg font-bold text-violet-100 mb-2">
                    {reward.title}
                  </h4>

                  {reward.description && (
                    <p className="font-body text-sm text-violet-300/70 mb-4 line-clamp-2">
                      {reward.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="font-heading font-bold text-lg text-violet-200">
                        {reward.xpCost} XP
                      </span>
                    </div>

                    <motion.button
                      whileHover={canAfford ? { scale: 1.05 } : {}}
                      whileTap={canAfford ? { scale: 0.95 } : {}}
                      onClick={() => handlePurchase(reward.id)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-lg font-heading font-semibold text-sm transition-colors ${
                        canAfford
                          ? 'bg-velaris-500 hover:bg-velaris-600 text-white'
                          : 'bg-velaris-500/20 text-velaris-300/40 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Purchase' : 'Locked'}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-violet-300/60">No rewards available. Add some rewards to unlock!</p>
          </div>
        )}
      </div>

      {/* Purchased Rewards */}
      {purchasedRewards.length > 0 && (
        <div className="glass-card-dark rounded-2xl p-6 border-2 border-green-500/30">
          <h3 className="font-heading text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Claimed Rewards ({purchasedRewards.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchasedRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl p-5 border-2 border-green-400/30 bg-green-500/5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl opacity-60">{reward.icon}</div>
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                </div>

                <h4 className="font-heading text-lg font-bold text-violet-100 mb-1">
                  {reward.title}
                </h4>

                {reward.purchasedAt && (
                  <p className="font-body text-xs text-green-300/60">
                    Claimed on {new Date(reward.purchasedAt).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showRewardModal && (
          <RewardModal onClose={() => setShowRewardModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};