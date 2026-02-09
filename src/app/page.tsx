'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { useAuth } from '@/lib/AuthContext';
import { LoginPage } from '@/components/LoginPage';
import { XPBar } from '@/components/XPBar';
import { StatsDashboard } from '@/components/StatsDashboard';
import { ScheduleTimeline } from '@/components/ScheduleTimeline';
import { WeeklyRotation } from '@/components/WeeklyRotation';
import { RewardsShop } from '@/components/RewardsShop';
import { SettingsPanel } from '@/components/SettingsPanel';
import { CelebrationAnimation } from '@/components/CelebrationAnimation';
import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { MonthlyCalendar } from '@/components/MonthlyCalendar';
import { Home, Calendar, ShoppingBag, Settings, Sparkles, LogOut, User } from 'lucide-react';

type TabType = 'dashboard' | 'weekly' | 'monthly' | 'rotation' | 'rewards' | 'settings';

export default function QuestPage() {
  const { gameState } = useGame();
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-fantasy-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">⚔️</div>
          <p className="font-heading text-xl text-fantasy-midnight">Loading your quest...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Home },
    { id: 'weekly' as TabType, label: 'Weekly', icon: Calendar },
    { id: 'monthly' as TabType, label: 'Monthly', icon: Calendar },
    { id: 'rotation' as TabType, label: 'Tasks', icon: Calendar },
    { id: 'rewards' as TabType, label: 'Rewards', icon: ShoppingBag },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${gameState.settings.darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-fantasy-cream dark:bg-fantasy-deep bg-fantasy-pattern transition-colors duration-300">
        <CelebrationAnimation />
        
        {/* Header */}
        <header className="sticky top-0 z-40 bg-gradient-to-r from-primary-500/90 via-fantasy-lavender/90 to-fantasy-rose/90 backdrop-blur-lg border-b-4 border-fantasy-midnight/10 dark:border-fantasy-cream/10 shadow-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl"
                >
                  ⚔️
                </motion.div>
                <div>
                  <h1 className="font-heading text-3xl font-bold text-white drop-shadow-lg">
                    Quest System
                  </h1>
                  <p className="font-body text-sm text-white/80">
                    Your Daily Adventure Awaits
                  </p>
                </div>
              </motion.div>

              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/30"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-sparkle" />
                  <span className="font-heading text-xl font-bold text-white">
                    {gameState.userProgress.totalXP} XP
                  </span>
                </motion.div>

                {/* User Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/30 hover:bg-white/30 transition-colors"
                  >
                    {gameState.userProgress.profileIcon ? (
                      gameState.userProgress.profileIcon.startsWith('http') ? (
                        <img 
                          src={gameState.userProgress.profileIcon} 
                          alt="Profile" 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{gameState.userProgress.profileIcon}</span>
                      )
                    ) : user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                    <span className="font-body text-sm text-white hidden sm:block">
                      {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Adventurer'}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-fantasy-midnight rounded-xl shadow-xl border-2 border-fantasy-lavender/30 overflow-hidden"
                      >
                        <div className="p-3 border-b border-fantasy-lavender/20">
                          <p className="font-body text-sm text-fantasy-midnight dark:text-fantasy-cream font-semibold">
                            {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="font-body text-xs text-fantasy-midnight/60 dark:text-fantasy-cream/60">
                            {user.email}
                          </p>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-3 text-left font-body text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="sticky top-[88px] z-30 bg-white/80 dark:bg-fantasy-midnight/80 backdrop-blur-lg border-b-2 border-fantasy-lavender/30 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-6 py-4 font-heading font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-fantasy-midnight/60 dark:text-fantasy-cream/60 hover:text-fantasy-midnight dark:hover:text-fantasy-cream'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-fantasy-lavender rounded-t-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {activeTab === 'dashboard' && (
                <>
                  <XPBar />
                  <StatsDashboard />
                  <ScheduleTimeline />
                </>
              )}

              {activeTab === 'weekly' && <WeeklyCalendar />}
              {activeTab === 'monthly' && <MonthlyCalendar />}
              {activeTab === 'rotation' && <WeeklyRotation />}
              {activeTab === 'rewards' && <RewardsShop />}
              {activeTab === 'settings' && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 bg-fantasy-midnight/5 dark:bg-fantasy-deep/50 border-t-2 border-fantasy-lavender/20">
          <div className="container mx-auto px-4 text-center">
            <p className="font-body text-sm text-fantasy-midnight/60 dark:text-fantasy-cream/60">
              Keep grinding, adventurer! Every task completed brings you closer to mastery. ⚔️✨
            </p>
            <p className="font-body text-xs text-fantasy-midnight/40 dark:text-fantasy-cream/40 mt-2">
              Made with 💜 for productivity heroes • Synced across all devices ☁️
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}