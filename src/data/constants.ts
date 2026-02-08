import { Task, Reward, Level, TimeSlot } from '@/types';

export const INITIAL_TASKS: Omit<Task, 'id' | 'completed' | 'completedAt'>[] = [
  // Creative / Art
  { title: 'Draw small animals', category: 'Creative / Art', difficulty: 'Easy', xpValue: 15 },
  { title: 'Learn how to draw', category: 'Creative / Art', difficulty: 'Medium', xpValue: 20 },
  { title: 'Paint baby drawings', category: 'Creative / Art', difficulty: 'Easy', xpValue: 15 },
  { title: 'Funko Pop', category: 'Creative / Art', difficulty: 'Hard', xpValue: 20 },
  { title: 'Keychains', category: 'Creative / Art', difficulty: 'Medium', xpValue: 20 },
  { title: 'Bookbinding', category: 'Creative / Art', difficulty: 'Hard', xpValue: 20 },
  { title: 'Bat sewed plush', category: 'Creative / Art', difficulty: 'Hard', xpValue: 20 },
  { title: 'Kindred', category: 'Creative / Art', difficulty: 'Hard', xpValue: 20 },
  { title: 'DnD buildings', category: 'Creative / Art', difficulty: 'Hard', xpValue: 20 },
  
  // Craft / Sewing
  { title: 'Crochet', category: 'Craft / Sewing', difficulty: 'Medium', xpValue: 20 },
  { title: 'Patinho', category: 'Craft / Sewing', difficulty: 'Medium', xpValue: 20 },
  { title: 'Fix golden pants', category: 'Craft / Sewing', difficulty: 'Easy', xpValue: 15 },
  
  // Writing / Learning
  { title: 'Write the book', category: 'Writing / Learning', difficulty: 'Hard', xpValue: 20 },
  { title: 'Book notebook', category: 'Writing / Learning', difficulty: 'Medium', xpValue: 20 },
  { title: 'Read', category: 'Writing / Learning', difficulty: 'Easy', xpValue: 15 },
  { title: 'Learn to be a DM', category: 'Writing / Learning', difficulty: 'Hard', xpValue: 20 },
  
  // Content / Online
  { title: 'VTuber', category: 'Content / Online', difficulty: 'Hard', xpValue: 20 },
  { title: 'Post pins & edit', category: 'Content / Online', difficulty: 'Medium', xpValue: 20 },
  { title: 'Clean YouTube playlist', category: 'Content / Online', difficulty: 'Easy', xpValue: 15 },
  { title: 'Follow social media people', category: 'Content / Online', difficulty: 'Easy', xpValue: 15 },
  
  // Gaming / Fun
  { title: 'Play FNAF', category: 'Gaming / Fun', difficulty: 'Easy', xpValue: 15 },
  
  // Life Skills
  { title: 'Cooking', category: 'Life Skills', difficulty: 'Medium', xpValue: 20 },
];

export const DEFAULT_REWARDS: Omit<Reward, 'id' | 'purchased' | 'purchasedAt'>[] = [
  { title: 'Guilt-free binge session', xpCost: 50, icon: '📺', description: 'Watch shows without any guilt!' },
  { title: 'Order food', xpCost: 120, icon: '🍕', description: 'Treat yourself to a delicious meal' },
  { title: 'Buy art supplies', xpCost: 150, icon: '🎨', description: 'Get new materials for your creations' },
  { title: 'Skip 1 task penalty-free', xpCost: 200, icon: '✨', description: 'Take a break without losing XP' },
  { title: 'Big reward fund', xpCost: 400, icon: '💎', description: 'Save up for something special!' },
];

export const LEVELS: Level[] = [
  { level: 1, title: 'New Adventurer', xpRequired: 0, icon: '🌱' },
  { level: 2, title: 'Hobbyist', xpRequired: 100, icon: '🎯' },
  { level: 3, title: 'Creator', xpRequired: 250, icon: '✨' },
  { level: 4, title: 'Artisan', xpRequired: 500, icon: '🎨' },
  { level: 5, title: 'Master Crafter', xpRequired: 900, icon: '👑' },
];

export const DAILY_SCHEDULE: TimeSlot[] = [
  { id: 'breakfast', startTime: '09:30', endTime: '10:30', type: 'meal', label: 'Breakfast' },
  { id: 'break1', startTime: '10:30', endTime: '10:40', type: 'break', label: 'Break' },
  { id: 'task1', startTime: '10:40', endTime: '11:40', type: 'task', label: 'Task Slot 1' },
  { id: 'break2', startTime: '11:40', endTime: '11:50', type: 'break', label: 'Break' },
  { id: 'task2', startTime: '11:50', endTime: '12:50', type: 'task', label: 'Task Slot 2' },
  { id: 'lunch', startTime: '12:50', endTime: '13:50', type: 'meal', label: 'Lunch' },
  { id: 'break3', startTime: '13:50', endTime: '14:00', type: 'break', label: 'Break' },
  { id: 'task3', startTime: '14:00', endTime: '15:00', type: 'task', label: 'Task Slot 3' },
  { id: 'break4', startTime: '15:00', endTime: '15:10', type: 'break', label: 'Break' },
  { id: 'task4', startTime: '15:10', endTime: '16:10', type: 'task', label: 'Task Slot 4' },
  { id: 'winddown', startTime: '16:10', endTime: '16:30', type: 'free', label: 'Wind-down' },
];

export const XP_RULES = {
  COMPLETE_TASK: 15,
  COMPLETE_HARD_TASK: 20,
  ALL_TASKS_BONUS: 25,
  WEEKLY_CONSISTENCY_BONUS: 50,
  SKIP_TASK_PENALTY: -5,
  SKIP_DAY_PENALTY: -20,
  QUIT_MID_TASK_PENALTY: -10,
};
