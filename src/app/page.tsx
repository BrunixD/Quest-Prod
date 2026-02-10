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
      <div className="min-h-screen bg-night-stars flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🌙</div>
          <p className="font-heading text-xl text-violet-200">Loading your quest...</p>
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
      <div className="min-h-screen bg-night-stars bg-cover transition-colors duration-300 relative overflow-hidden">
        <CelebrationAnimation />
        
        {/* Header */}
        <header className="sticky top-0 z-40 glass-card-dark border-b-2 border-velaris-500/30 shadow-2xl">
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
                  className="text-4xl drop-shadow-lg"
                >
                  🌙
                </motion.div>
                <div>
                  <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-lg">
                    Night Court Quest System
                  </h1>
                  <p className="font-body text-sm text-violet-200/80">
                    To the stars who listen, and the dreams that are answered
                  </p>
                </div>
              </motion.div>

              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2 glass-card px-4 py-2 rounded-full border-2 border-starlight-400/30 glow-purple"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-sparkle" />
                  <span className="font-heading text-xl font-bold text-violet-100">
                    {gameState.userProgress.totalXP} XP
                  </span>
                </motion.div>

                {/* User Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 glass-card px-4 py-2 rounded-full border-2 border-starlight-400/30 hover:border-velaris-400/50 transition-all glow-purple"
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
                    ) : (
                      <User className="w-5 h-5 text-violet-200" />
                    )}
                    <span className="font-body text-sm text-violet-200 hidden sm:block">
                      {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Adventurer'}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 glass-card-dark rounded-xl shadow-2xl border-2 border-velaris-500/30 overflow-hidden glow-purple"
                      >
                        <div className="p-3 border-b border-velaris-500/20">
                          <p className="font-body text-sm text-violet-200 font-semibold">
                            {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="font-body text-xs text-violet-300/60">
                            {user.email}
                          </p>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-3 text-left font-body text-sm text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2"
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
        <nav className="sticky top-[88px] z-30 glass-card-dark border-b-2 border-velaris-500/30 shadow-xl">
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
                        ? 'text-violet-200'
                        : 'text-violet-400/60 hover:text-violet-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-velaris-500 via-violet-400 to-velaris-500 rounded-t-full glow-violet"
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
        <main className="container mx-auto px-4 py-8 relative z-10">
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

        {/* Floating Stars Decoration */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none z-0"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -50,
              opacity: 0
            }}
            animate={{
              y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'linear'
            }}
            style={{
              fontSize: `${12 + Math.random() * 8}px`,
            }}
          >
            {['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}

        {/* Footer */}
        <footer className="mt-16 py-8 glass-card-dark border-t-2 border-velaris-500/20 relative z-10">
          <div className="container mx-auto px-4 text-center">
            <p className="font-body text-sm text-violet-200/60">
              To the people who look at the stars and wish. To the stars who listen — and the dreams that are answered. 🌙✨
            </p>
            <p className="font-body text-xs text-violet-300/40 mt-2">
              Night Court Quest System • Powered by starlight and determination ⭐
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}