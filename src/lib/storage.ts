import { GameState, UserProgress, Task, Reward, WeeklyRotation } from '@/types';
import { INITIAL_TASKS, DEFAULT_REWARDS, DAILY_SCHEDULE } from '@/data/constants';
import { format, startOfWeek } from 'date-fns';

const STORAGE_KEY = 'quest-productivity-system';

export const getInitialGameState = (): GameState => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  
  return {
    userProgress: {
      totalXP: 0,
      currentLevel: 1,
      streak: 0,
      lastActiveDate: today,
      weeklyProgress: {},
      history: [],
    },
    tasks: INITIAL_TASKS.map((task, index) => ({
      ...task,
      id: `task-${index}`,
      completed: false,
    })),
    weeklyRotation: {
      weekStart,
      selectedTasks: [],
    },
    rewards: DEFAULT_REWARDS.map((reward, index) => ({
      ...reward,
      id: `reward-${index}`,
      purchased: false,
    })),
    schedule: DAILY_SCHEDULE,
    settings: {
      soundEnabled: true,
      darkMode: false,
      dailyStartTime: '09:30',
      dailyEndTime: '16:30',
    },
  };
};

export const saveGameState = (state: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};

// Helper functions
export const getCurrentLevel = (totalXP: number): number => {
  if (totalXP >= 900) return 5;
  if (totalXP >= 500) return 4;
  if (totalXP >= 250) return 3;
  if (totalXP >= 100) return 2;
  return 1;
};

export const getXPForNextLevel = (currentLevel: number): number => {
  const levels = [0, 100, 250, 500, 900];
  return levels[currentLevel] || 900;
};

export const getXPProgress = (totalXP: number, currentLevel: number): number => {
  const levels = [0, 100, 250, 500, 900];
  const currentLevelXP = levels[currentLevel - 1] || 0;
  const nextLevelXP = levels[currentLevel] || 900;
  const xpInLevel = totalXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  return (xpInLevel / xpNeeded) * 100;
};
