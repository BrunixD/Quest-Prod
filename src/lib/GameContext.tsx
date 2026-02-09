'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Task, Reward, DailyProgress, GameState } from '@/types';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/database';
import { DAILY_SCHEDULE, INITIAL_TASKS, DEFAULT_REWARDS, XP_RULES } from '@/data/constants';
import { format, differenceInDays } from 'date-fns';
import { getCurrentLevel } from '@/lib/storage';

interface GameContextType {
  gameState: GameState;
  loading: boolean;
  completeTask: (taskId: string, slotId: string) => Promise<void>;
  skipTask: (taskId: string, slotId: string) => Promise<void>;
  quitTask: (taskId: string) => Promise<void>;
  addCustomTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  addCustomReward: (reward: Omit<Reward, 'id' | 'purchased'>) => Promise<void>;
  purchaseReward: (rewardId: string) => Promise<void>;
  selectWeeklyTasks: (taskIds: string[]) => void;
  toggleDarkMode: () => Promise<void>;
  toggleSound: () => Promise<void>;
  resetProgress: () => Promise<void>;
  assignTaskToSlot: (taskId: string, slotId: string, date: Date) => Promise<void>;
  getTodayProgress: () => DailyProgress;
  getAssignedTasks: () => Record<string, string>;
  setProfileIcon: (icon: string | undefined) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  deleteReward: (rewardId: string) => Promise<void>;
  getSlotAssignment: (date: Date, slotId: string) => string | undefined;
  removeSlotAssignment: (date: Date, slotId: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    userProgress: {
      totalXP: 0,
      currentLevel: 1,
      streak: 0,
      lastActiveDate: format(new Date(), 'yyyy-MM-dd'),
      weeklyProgress: {},
      history: [],
      profileIcon: undefined,
    },
    tasks: [],
    weeklyRotation: {
      weekStart: format(new Date(), 'yyyy-MM-dd'),
      selectedTasks: [],
    },
    rewards: [],
    schedule: DAILY_SCHEDULE,
    settings: {
      soundEnabled: true,
      darkMode: false,
      dailyStartTime: '09:30',
      dailyEndTime: '16:30',
    },
  });

  // Load all data from database
  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading && !user) {
        setLoading(false);
      }
      return;
    }

    const loadAllData = async () => {
      try {
        console.log('📥 Loading all data for user:', user.id);

        // Get or create profile
        let profile = await db.getProfile(user.id);
        console.log('👤 Profile:', profile);
        
        if (!profile) {
          console.log('🆕 Creating new profile');
          profile = await db.createProfile(user.id);
          console.log('✅ Profile created:', profile);
          
          // Initialize default tasks
          console.log('📝 Creating default tasks...');
          for (const task of INITIAL_TASKS) {
            await db.createTask(user.id, {
              ...task,
              title: task.title,
              category: task.category,
              difficulty: task.difficulty,
              xpValue: task.xpValue,
              notes: task.notes,
            });
          }
          console.log('✅ Tasks created');

          // Initialize default rewards
          console.log('🎁 Creating default rewards...');
          for (const reward of DEFAULT_REWARDS) {
            await db.createReward(user.id, reward);
          }
          console.log('✅ Rewards created');
        }

        // Load tasks
        console.log('📝 Loading tasks...');
        const tasksData = await db.getTasks(user.id);
        console.log('Tasks data:', tasksData);
        const tasks: Task[] = tasksData.map((t: any) => ({
          id: t.task_id,
          title: t.title,
          category: t.category,
          difficulty: t.difficulty,
          xpValue: t.xp_value,
          notes: t.notes || '',
          completed: t.completed,
          completedAt: t.completed_at,
        }));

        // Load rewards
        console.log('🎁 Loading rewards...');
        const rewardsData = await db.getRewards(user.id);
        console.log('Rewards data:', rewardsData);
        const rewards: Reward[] = rewardsData.map((r: any) => ({
          id: r.reward_id,
          title: r.title,
          xpCost: r.xp_cost,
          icon: r.icon,
          description: r.description || '',
          purchased: r.purchased,
          purchasedAt: r.purchased_at,
        }));

        // Load today's slot assignments
        console.log('📅 Loading slot assignments...');
        const today = new Date();
        const slotAssignments = await db.getSlotAssignments(user.id, today);
        const todayProgress = await db.getDailyProgress(user.id, today);
        console.log('Slot assignments:', slotAssignments);
        console.log('Today progress:', todayProgress);

        const weeklyProgress: Record<string, DailyProgress> = {};
        const dateStr = format(today, 'yyyy-MM-dd');
        
        const slotsCompleted = slotAssignments
          .filter(s => s.completed)
          .map(s => s.slot_id);
        
        const slotsSkipped = slotAssignments
          .filter(s => s.skipped)
          .map(s => s.slot_id);

        const slotAssignmentsMap: Record<string, string> = {};
        slotAssignments.forEach(s => {
          slotAssignmentsMap[s.slot_id] = s.task_id;
        });

        weeklyProgress[dateStr] = {
          date: dateStr,
          completedTasks: todayProgress?.completed_tasks || 0,
          totalTasks: 4,
          xpEarned: todayProgress?.xp_earned || 0,
          tasksCompleted: [],
          tasksSkipped: [],
          tasksPenalty: [],
          slotAssignments: slotAssignmentsMap,
          slotsCompleted,
          slotsSkipped,
        };

        console.log('🎯 Setting game state...');
        setGameState({
          userProgress: {
            totalXP: profile.total_xp,
            currentLevel: profile.current_level,
            streak: profile.streak,
            lastActiveDate: profile.last_active_date,
            weeklyProgress,
            history: [],
            profileIcon: profile.profile_icon,
          },
          tasks,
          weeklyRotation: {
            weekStart: format(new Date(), 'yyyy-MM-dd'),
            selectedTasks: [],
          },
          rewards,
          schedule: DAILY_SCHEDULE,
          settings: {
            soundEnabled: profile.sound_enabled,
            darkMode: profile.dark_mode,
            dailyStartTime: '09:30',
            dailyEndTime: '16:30',
          },
        });

        console.log('✅ All data loaded successfully');
      } catch (error) {
        console.error('❌ Error loading data:', error);
        alert('Error loading data: ' + error);
      } finally {
        console.log('🏁 Setting loading to false');
        setLoading(false);
      }
    };

    loadAllData();
  }, [user, authLoading]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user || loading) return;

    console.log('👂 Setting up real-time subscriptions');

    // Subscribe to profile changes
    const profileChannel = db.subscribeToProfile(user.id, async (payload) => {
      console.log('🔔 Profile update received:', payload);
      
      // Reload the entire profile to ensure we have latest data
      const updatedProfile = await db.getProfile(user.id);
      console.log('🔄 Reloaded profile:', updatedProfile);
      
      if (updatedProfile) {
        setGameState(prev => ({
          ...prev,
          userProgress: {
            ...prev.userProgress,
            totalXP: updatedProfile.total_xp,
            currentLevel: updatedProfile.current_level,
            streak: updatedProfile.streak,
            profileIcon: updatedProfile.profile_icon,
          },
          settings: {
            ...prev.settings,
            darkMode: updatedProfile.dark_mode,
            soundEnabled: updatedProfile.sound_enabled,
          },
        }));
      }
    });

    // Subscribe to task changes
    const tasksChannel = db.subscribeToTasks(user.id, async () => {
      console.log('🔔 Tasks updated, reloading...');
      const tasksData = await db.getTasks(user.id);
      const tasks: Task[] = tasksData.map((t: any) => ({
        id: t.task_id,
        title: t.title,
        category: t.category,
        difficulty: t.difficulty,
        xpValue: t.xp_value,
        notes: t.notes || '',
        completed: t.completed,
        completedAt: t.completed_at,
      }));
      setGameState(prev => ({ ...prev, tasks }));
    });

    // Subscribe to slot assignments
    // Subscribe to slot assignments
    const slotsChannel = db.subscribeToSlotAssignments(user.id, async (payload) => {
      console.log('🔔 Slot assignments updated:', payload);
      
      // Reload all slot assignments for today to ensure consistency
      const today = new Date();
      const slotAssignments = await db.getSlotAssignments(user.id, today);
      const dateStr = format(today, 'yyyy-MM-dd');

      console.log('🔄 Reloaded slot assignments:', slotAssignments);

      const slotsCompleted = slotAssignments
        .filter(s => s.completed)
        .map(s => s.slot_id);
      
      const slotsSkipped = slotAssignments
        .filter(s => s.skipped)
        .map(s => s.slot_id);

      const slotAssignmentsMap: Record<string, string> = {};
      slotAssignments.forEach(s => {
        slotAssignmentsMap[s.slot_id] = s.task_id;
      });

      setGameState(prev => ({
        ...prev,
        userProgress: {
          ...prev.userProgress,
          weeklyProgress: {
            ...prev.userProgress.weeklyProgress,
            [dateStr]: {
              ...(prev.userProgress.weeklyProgress[dateStr] || {
                date: dateStr,
                completedTasks: 0,
                totalTasks: 4,
                xpEarned: 0,
                tasksCompleted: [],
                tasksSkipped: [],
                tasksPenalty: [],
              }),
              slotAssignments: slotAssignmentsMap,
              slotsCompleted,
              slotsSkipped,
            },
          },
        },
      }));
    });

    // Subscribe to rewards
    const rewardsChannel = db.subscribeToRewards(user.id, async () => {
      console.log('🔔 Rewards updated, reloading...');
      const rewardsData = await db.getRewards(user.id);
      const rewards: Reward[] = rewardsData.map((r: any) => ({
        id: r.reward_id,
        title: r.title,
        xpCost: r.xp_cost,
        icon: r.icon,
        description: r.description || '',
        purchased: r.purchased,
        purchasedAt: r.purchased_at,
      }));
      setGameState(prev => ({ ...prev, rewards }));
    });

    return () => {
      console.log('👋 Cleaning up subscriptions');
      profileChannel.unsubscribe();
      tasksChannel.unsubscribe();
      slotsChannel.unsubscribe();
      rewardsChannel.unsubscribe();
    };
  }, [user, loading]);

  const getTodayProgress = (): DailyProgress => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return gameState.userProgress.weeklyProgress[today] || {
      date: today,
      completedTasks: 0,
      totalTasks: 4,
      xpEarned: 0,
      tasksCompleted: [],
      tasksSkipped: [],
      tasksPenalty: [],
      slotAssignments: {},
      slotsCompleted: [],
      slotsSkipped: [],
    };
  };

  const getAssignedTasks = (): Record<string, string> => {
    const todayProgress = getTodayProgress();
    return todayProgress.slotAssignments || {};
  };

  const getSlotAssignment = (date: Date, slotId: string): string | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayProgress = gameState.userProgress.weeklyProgress[dateStr];
    return dayProgress?.slotAssignments?.[slotId];
  };

  const assignTaskToSlot = async (taskId: string, slotId: string, date: Date) => {
    if (!user) return;
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      console.log('📌 Assigning task to slot:', { taskId, slotId, date: dateStr });
      
      // Optimistic update
      setGameState(prev => ({
        ...prev,
        userProgress: {
          ...prev.userProgress,
          weeklyProgress: {
            ...prev.userProgress.weeklyProgress,
            [dateStr]: {
              ...(prev.userProgress.weeklyProgress[dateStr] || {
                date: dateStr,
                completedTasks: 0,
                totalTasks: 4,
                xpEarned: 0,
                tasksCompleted: [],
                tasksSkipped: [],
                tasksPenalty: [],
                slotsCompleted: [],
                slotsSkipped: [],
              }),
              slotAssignments: {
                ...(prev.userProgress.weeklyProgress[dateStr]?.slotAssignments || {}),
                [slotId]: taskId,
              },
            },
          },
        },
      }));

      // Save to database
      await db.assignTaskToSlot(user.id, date, slotId, taskId);
      console.log('✅ Task assigned to database');
    } catch (error) {
      console.error('❌ Error assigning task:', error);
      // Reload data on error
      const slotAssignments = await db.getSlotAssignments(user.id, date);
      const dateStr = format(date, 'yyyy-MM-dd');
      const slotAssignmentsMap: Record<string, string> = {};
      slotAssignments.forEach(s => {
        slotAssignmentsMap[s.slot_id] = s.task_id;
      });
      setGameState(prev => ({
        ...prev,
        userProgress: {
          ...prev.userProgress,
          weeklyProgress: {
            ...prev.userProgress.weeklyProgress,
            [dateStr]: {
              ...prev.userProgress.weeklyProgress[dateStr],
              slotAssignments: slotAssignmentsMap,
            },
          },
        },
      }));
    }
  };

  const removeSlotAssignment = async (date: Date, slotId: string) => {
    if (!user) return;
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      console.log('🗑️ Removing slot assignment:', { slotId, date: dateStr });
      
      // Optimistic update
      setGameState(prev => {
        const dayProgress = prev.userProgress.weeklyProgress[dateStr];
        if (!dayProgress?.slotAssignments) return prev;
        
        const newAssignments = { ...dayProgress.slotAssignments };
        delete newAssignments[slotId];
        
        return {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            weeklyProgress: {
              ...prev.userProgress.weeklyProgress,
              [dateStr]: {
                ...dayProgress,
                slotAssignments: newAssignments,
              },
            },
          },
        };
      });

      // Save to database
      await db.removeSlotAssignment(user.id, date, slotId);
      console.log('✅ Slot assignment removed from database');
    } catch (error) {
      console.error('❌ Error removing slot:', error);
      // Reload data on error
      const slotAssignments = await db.getSlotAssignments(user.id, date);
      const dateStr = format(date, 'yyyy-MM-dd');
      const slotAssignmentsMap: Record<string, string> = {};
      slotAssignments.forEach(s => {
        slotAssignmentsMap[s.slot_id] = s.task_id;
      });
      setGameState(prev => ({
        ...prev,
        userProgress: {
          ...prev.userProgress,
          weeklyProgress: {
            ...prev.userProgress.weeklyProgress,
            [dateStr]: {
              ...prev.userProgress.weeklyProgress[dateStr],
              slotAssignments: slotAssignmentsMap,
            },
          },
        },
      }));
    }
  };

  const completeTask = async (taskId: string, slotId: string) => {
    if (!user) return;
    try {
      const task = gameState.tasks.find(t => t.id === taskId);
      if (!task) return;

      const today = new Date();
      const todayProgress = getTodayProgress();
      const xpGained = task.xpValue;
      
      // Mark slot as completed
      await db.completeSlot(user.id, today, slotId);

      const newCompletedCount = todayProgress.completedTasks + 1;
      let bonusXP = 0;
      if (newCompletedCount === 4) {
        bonusXP = XP_RULES.ALL_TASKS_BONUS;
      }

      const newTotalXP = gameState.userProgress.totalXP + xpGained + bonusXP;
      const newLevel = getCurrentLevel(newTotalXP);
      const newStreak = todayProgress.completedTasks === 0 
        ? gameState.userProgress.streak + 1 
        : gameState.userProgress.streak;

      // Update daily progress
      await db.updateDailyProgress(user.id, today, newCompletedCount, todayProgress.xpEarned + xpGained + bonusXP);

      // Update profile
      await db.updateProfile(user.id, {
        total_xp: newTotalXP,
        current_level: newLevel,
        streak: newStreak,
      });

      console.log('✅ Task completed successfully');
    } catch (error) {
      console.error('❌ Error completing task:', error);
    }
  };

  const skipTask = async (taskId: string, slotId: string) => {
    if (!user) return;
    try {
      const today = new Date();
      const todayProgress = getTodayProgress();

      // Mark slot as skipped
      await db.skipSlot(user.id, today, slotId);

      const newTotalXP = Math.max(0, gameState.userProgress.totalXP + XP_RULES.SKIP_TASK_PENALTY);

      // Update daily progress
      await db.updateDailyProgress(
        user.id, 
        today, 
        todayProgress.completedTasks, 
        todayProgress.xpEarned + XP_RULES.SKIP_TASK_PENALTY
      );

      // Update profile
      await db.updateProfile(user.id, {
        total_xp: newTotalXP,
      });

      console.log('✅ Task skipped');
    } catch (error) {
      console.error('❌ Error skipping task:', error);
    }
  };

  const quitTask = async (taskId: string) => {
    if (!user) return;
    try {
      const today = new Date();
      const todayProgress = getTodayProgress();

      const newTotalXP = Math.max(0, gameState.userProgress.totalXP + XP_RULES.QUIT_MID_TASK_PENALTY);

      await db.updateDailyProgress(
        user.id,
        today,
        todayProgress.completedTasks,
        todayProgress.xpEarned + XP_RULES.QUIT_MID_TASK_PENALTY
      );

      await db.updateProfile(user.id, {
        total_xp: newTotalXP,
      });

      console.log('✅ Task quit');
    } catch (error) {
      console.error('❌ Error quitting task:', error);
    }
  };

  const addCustomTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    if (!user) return;
    try {
      await db.createTask(user.id, task);
      console.log('✅ Task created');
    } catch (error) {
      console.error('❌ Error creating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return;
    try {
      await db.deleteTask(user.id, taskId);
      console.log('✅ Task deleted');
    } catch (error) {
      console.error('❌ Error deleting task:', error);
    }
  };

  const addCustomReward = async (reward: Omit<Reward, 'id' | 'purchased'>) => {
    if (!user) return;
    try {
      await db.createReward(user.id, reward);
      console.log('✅ Reward created');
    } catch (error) {
      console.error('❌ Error creating reward:', error);
    }
  };

  const purchaseReward = async (rewardId: string) => {
    if (!user) return;
    try {
      const reward = gameState.rewards.find(r => r.id === rewardId);
      if (!reward || reward.purchased) return;

      if (gameState.userProgress.totalXP >= reward.xpCost) {
        await db.purchaseReward(user.id, rewardId);
        await db.updateProfile(user.id, {
          total_xp: gameState.userProgress.totalXP - reward.xpCost,
        });
        console.log('✅ Reward purchased');
      }
    } catch (error) {
      console.error('❌ Error purchasing reward:', error);
    }
  };

  const deleteReward = async (rewardId: string) => {
    if (!user) return;
    try {
      await db.deleteReward(user.id, rewardId);
      console.log('✅ Reward deleted');
    } catch (error) {
      console.error('❌ Error deleting reward:', error);
    }
  };

  const toggleDarkMode = async () => {
    if (!user) return;
    try {
      // Optimistic update
      setGameState(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          darkMode: !prev.settings.darkMode,
        },
      }));

      // Save to database
      await db.updateProfile(user.id, {
        dark_mode: !gameState.settings.darkMode,
      });
      
      console.log('✅ Dark mode toggled');
    } catch (error) {
      console.error('❌ Error toggling dark mode:', error);
      // Revert on error
      setGameState(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          darkMode: !prev.settings.darkMode,
        },
      }));
    }
  };

  const toggleSound = async () => {
    if (!user) return;
    try {
      // Optimistic update
      setGameState(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          soundEnabled: !prev.settings.soundEnabled,
        },
      }));

      // Save to database
      await db.updateProfile(user.id, {
        sound_enabled: !gameState.settings.soundEnabled,
      });
      
      console.log('✅ Sound toggled');
    } catch (error) {
      console.error('❌ Error toggling sound:', error);
      // Revert on error
      setGameState(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          soundEnabled: !prev.settings.soundEnabled,
        },
      }));
    }
  };

  const setProfileIcon = async (icon: string | undefined) => {
    if (!user) return;
    try {
      await db.updateProfile(user.id, {
        profile_icon: icon || null,
      });
    } catch (error) {
      console.error('❌ Error setting profile icon:', error);
    }
  };

  const selectWeeklyTasks = (taskIds: string[]) => {
    // This is now just for local state, not saved to DB
    setGameState(prev => ({
      ...prev,
      weeklyRotation: {
        ...prev.weeklyRotation,
        selectedTasks: taskIds,
      },
    }));
  };

  const resetProgress = async () => {
    if (!user) return;
    try {
      // This would require deleting all user data and recreating
      // For now, just reload the page
      window.location.reload();
    } catch (error) {
      console.error('❌ Error resetting progress:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-fantasy-cream dark:bg-fantasy-deep flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">⚔️</div>
          <p className="font-heading text-xl text-fantasy-midnight dark:text-fantasy-cream">
            Loading your quest...
          </p>
        </div>
      </div>
    );
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        loading,
        completeTask,
        skipTask,
        quitTask,
        addCustomTask,
        addCustomReward,
        purchaseReward,
        selectWeeklyTasks,
        toggleDarkMode,
        toggleSound,
        resetProgress,
        assignTaskToSlot,
        getTodayProgress,
        getAssignedTasks,
        setProfileIcon,
        deleteTask,
        deleteReward,
        getSlotAssignment,
        removeSlotAssignment,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};