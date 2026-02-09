'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GameState, Task, DailyProgress, Reward } from '@/types';
import { 
  getInitialGameState, 
  saveGameState, 
  loadGameState, 
  getCurrentLevel,
  getXPForNextLevel,
  getXPProgress 
} from '@/lib/storage';
import { 
  saveGameStateToSupabase,
  loadGameStateFromSupabase,
  subscribeToGameState
} from '@/lib/supabaseStorage';
import { useAuth } from '@/lib/AuthContext';
import { XP_RULES, DAILY_SCHEDULE } from '@/data/constants';
import { format, startOfWeek, differenceInDays } from 'date-fns';

interface GameContextType {
  gameState: GameState;
  completeTask: (taskId: string, slotId: string) => void;
  skipTask: (taskId: string, slotId: string) => void;
  quitTask: (taskId: string) => void;
  addCustomTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  addCustomReward: (reward: Omit<Reward, 'id' | 'purchased'>) => void;
  purchaseReward: (rewardId: string) => void;
  selectWeeklyTasks: (taskIds: string[]) => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  resetProgress: () => void;
  assignTaskToSlot: (taskId: string, slotId: string, date: Date) => void;
  getTodayProgress: () => DailyProgress;
  getAssignedTasks: () => Record<string, string>;
  setProfileIcon: (icon: string | undefined) => void;
  deleteTask: (taskId: string) => void;
  deleteReward: (rewardId: string) => void;
  getSlotAssignment: (date: Date, slotId: string) => string | undefined;
  removeSlotAssignment: (date: Date, slotId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user, loading } = useAuth();

  // Load game state on mount or when user changes
  useEffect(() => {
    const loadData = async () => {
      if (loading) {
        console.log('⏳ Auth still loading, waiting...');
        return;
      }

      if (user) {
        console.log('🔵 User logged in, loading Supabase data for:', user.id);
        const supabaseState = await loadGameStateFromSupabase(user.id);
        if (supabaseState) {
          supabaseState.schedule = DAILY_SCHEDULE;
          console.log('🟢 Loaded Supabase state:', supabaseState);
          console.log('🟢 Weekly progress:', supabaseState.userProgress.weeklyProgress);
          setGameState(supabaseState);
        }
      } else {
        console.log('❌ No user, loading LocalStorage');
        const loadedState = loadGameState();
        if (loadedState) {
          loadedState.schedule = DAILY_SCHEDULE;
          setGameState(loadedState);
        }
      }
      setIsLoaded(true);
    };

    if (!isLoaded && !loading) {
      loadData();
    }
  }, [user?.id, loading, isLoaded]);

  // Real-time listener for Supabase updates
  useEffect(() => {
    if (!user || !isLoaded) return;

    console.log('👂 Setting up real-time listener for user:', user.id);
    
    const unsubscribe = subscribeToGameState(user.id, (updatedState: GameState) => {
      console.log('🔔 Received update from Supabase');
      setIsSyncing(true);
      updatedState.schedule = DAILY_SCHEDULE;
      setGameState(updatedState);
      setTimeout(() => setIsSyncing(false), 100);
    });

    return () => {
      console.log('👋 Cleaning up listener');
      unsubscribe();
    };
  }, [user?.id, isLoaded]);

  // Save game state whenever it changes (but not during sync)
  useEffect(() => {
    if (isLoaded && !isSyncing) {
      console.log('💾 Saving game state...');
      if (user) {
        saveGameStateToSupabase(user.id, gameState);
      } else {
        saveGameState(gameState);
      }
    } else if (isSyncing) {
      console.log('🔄 Syncing from Supabase, skip save');
    }
  }, [gameState, isLoaded, user?.id, isSyncing]);

  // Check and update streak
  useEffect(() => {
    if (!isLoaded) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const lastActive = gameState.userProgress.lastActiveDate;
    
    if (lastActive !== today) {
      const daysDiff = differenceInDays(new Date(today), new Date(lastActive));
      
      setGameState(prev => ({
        ...prev,
        userProgress: {
          ...prev.userProgress,
          lastActiveDate: today,
          streak: daysDiff === 1 ? prev.userProgress.streak : 0,
        }
      }));
    }
  }, [isLoaded, gameState.userProgress.lastActiveDate]);

  const getTodayProgress = (): DailyProgress => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existing = gameState.userProgress.weeklyProgress[today];
    
    return {
      date: today,
      completedTasks: existing?.completedTasks || 0,
      totalTasks: 4,
      xpEarned: existing?.xpEarned || 0,
      tasksCompleted: existing?.tasksCompleted || [],
      tasksSkipped: existing?.tasksSkipped || [],
      tasksPenalty: existing?.tasksPenalty || [],
      slotAssignments: existing?.slotAssignments || {},
      slotsCompleted: existing?.slotsCompleted || [],
      slotsSkipped: existing?.slotsSkipped || [],
    };
  };

  const getAssignedTasks = (): Record<string, string> => {
    const assignments: Record<string, string> = {};
    gameState.schedule.forEach(slot => {
      if (slot.taskId) {
        assignments[slot.id] = slot.taskId;
      }
    });
    return assignments;
  };

  const assignTaskToSlot = (taskId: string, slotId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    console.log('Assigning task:', { taskId, slotId, dateStr });
    
    setGameState(prev => {
      const existingProgress = prev.userProgress.weeklyProgress[dateStr];
      
      const newState = {
        ...prev,
        userProgress: {
          ...prev.userProgress,
          weeklyProgress: {
            ...prev.userProgress.weeklyProgress,
            [dateStr]: {
              date: dateStr,
              completedTasks: existingProgress?.completedTasks || 0,
              totalTasks: 4,
              xpEarned: existingProgress?.xpEarned || 0,
              tasksCompleted: existingProgress?.tasksCompleted || [],
              tasksSkipped: existingProgress?.tasksSkipped || [],
              tasksPenalty: existingProgress?.tasksPenalty || [],
              slotsCompleted: existingProgress?.slotsCompleted || [],
              slotsSkipped: existingProgress?.slotsSkipped || [],
              slotAssignments: {
                ...(existingProgress?.slotAssignments || {}),
                [slotId]: taskId,
              },
            },
          },
        },
      };
      
      console.log('New state after assignment:', newState);
      return newState;
    });
  };

  const getSlotAssignment = (date: Date, slotId: string): string | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayProgress = gameState.userProgress.weeklyProgress[dateStr];
    return dayProgress?.slotAssignments?.[slotId];
  };

  const removeSlotAssignment = (date: Date, slotId: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
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
  };

  const completeTask = (taskId: string, slotId: string) => {
    const task = gameState.tasks.find(t => t.id === taskId);
    if (!task) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const todayProgress = getTodayProgress();
    const xpGained = task.xpValue;
    
    setGameState(prev => {
      const newCompletedCount = todayProgress.completedTasks + 1;
      const newXPEarned = todayProgress.xpEarned + xpGained;
      
      let bonusXP = 0;
      if (newCompletedCount === 4) {
        bonusXP = XP_RULES.ALL_TASKS_BONUS;
      }

      const newTotalXP = prev.userProgress.totalXP + xpGained + bonusXP;
      const newLevel = getCurrentLevel(newTotalXP);
      
      const newStreak = todayProgress.completedTasks === 0 
        ? prev.userProgress.streak + 1 
        : prev.userProgress.streak;

      return {
        ...prev,
        userProgress: {
          ...prev.userProgress,
          totalXP: newTotalXP,
          currentLevel: newLevel,
          streak: newStreak,
          weeklyProgress: {
            ...prev.userProgress.weeklyProgress,
            [today]: {
              ...todayProgress,
              completedTasks: newCompletedCount,
              xpEarned: newXPEarned + bonusXP,
              tasksCompleted: [...(todayProgress.tasksCompleted || []), taskId],
              slotsCompleted: [...(todayProgress.slotsCompleted || []), slotId],
            },
          },
        },
      };
    });
  };

  const skipTask = (taskId: string, slotId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayProgress = getTodayProgress();
    
    setGameState(prev => ({
      ...prev,
      userProgress: {
        ...prev.userProgress,
        totalXP: Math.max(0, prev.userProgress.totalXP + XP_RULES.SKIP_TASK_PENALTY),
        weeklyProgress: {
          ...prev.userProgress.weeklyProgress,
          [today]: {
            ...todayProgress,
            xpEarned: todayProgress.xpEarned + XP_RULES.SKIP_TASK_PENALTY,
            tasksSkipped: [...(todayProgress.tasksSkipped || []), taskId],
            slotsSkipped: [...(todayProgress.slotsSkipped || []), slotId],
          },
        },
      },
    }));
  };

  const quitTask = (taskId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayProgress = getTodayProgress();
    
    setGameState(prev => ({
      ...prev,
      userProgress: {
        ...prev.userProgress,
        totalXP: Math.max(0, prev.userProgress.totalXP + XP_RULES.QUIT_MID_TASK_PENALTY),
        weeklyProgress: {
          ...prev.userProgress.weeklyProgress,
          [today]: {
            ...todayProgress,
            xpEarned: todayProgress.xpEarned + XP_RULES.QUIT_MID_TASK_PENALTY,
            tasksPenalty: [...todayProgress.tasksPenalty, taskId],
          },
        },
      },
    }));
  };

  const addCustomTask = (task: Omit<Task, 'id' | 'completed'>) => {
    setGameState(prev => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          ...task,
          id: `task-${Date.now()}`,
          completed: false,
        },
      ],
    }));
  };

  const addCustomReward = (reward: Omit<Reward, 'id' | 'purchased'>) => {
    setGameState(prev => ({
      ...prev,
      rewards: [
        ...prev.rewards,
        {
          ...reward,
          id: `reward-${Date.now()}`,
          purchased: false,
        },
      ],
    }));
  };

  const purchaseReward = (rewardId: string) => {
    const reward = gameState.rewards.find(r => r.id === rewardId);
    if (!reward || reward.purchased) return;
    
    if (gameState.userProgress.totalXP >= reward.xpCost) {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      setGameState(prev => ({
        ...prev,
        userProgress: {
          ...prev.userProgress,
          totalXP: prev.userProgress.totalXP - reward.xpCost,
        },
        rewards: prev.rewards.map(r =>
          r.id === rewardId ? { ...r, purchased: true, purchasedAt: today } : r
        ),
      }));
    }
  };

  const selectWeeklyTasks = (taskIds: string[]) => {
    const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    
    setGameState(prev => ({
      ...prev,
      weeklyRotation: {
        weekStart,
        selectedTasks: taskIds,
      },
    }));
  };

  const toggleDarkMode = () => {
    setGameState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        darkMode: !prev.settings.darkMode,
      },
    }));
  };

  const toggleSound = () => {
    setGameState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEnabled: !prev.settings.soundEnabled,
      },
    }));
  };

  const resetProgress = () => {
    setGameState(getInitialGameState());
  };

  const setProfileIcon = (icon: string | undefined) => {
    setGameState(prev => ({
      ...prev,
      userProgress: {
        ...prev.userProgress,
        profileIcon: icon
      }
    }));
  };

  const deleteTask = (taskId: string) => {
    setGameState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId),
    }));
  };

  const deleteReward = (rewardId: string) => {
    setGameState(prev => ({
      ...prev,
      rewards: prev.rewards.filter(r => r.id !== rewardId),
    }));
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
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