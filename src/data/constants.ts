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
  // Original Rewards
  { title: 'Guilt-free binge session', xpCost: 50, icon: '📺', description: 'Watch shows without any guilt!' },
  { title: 'Order food', xpCost: 120, icon: '🍕', description: 'Treat yourself to a delicious meal' },
  { title: 'Buy art supplies', xpCost: 150, icon: '🎨', description: 'Get new materials for your creations' },
  { title: 'Skip 1 task penalty-free', xpCost: 200, icon: '✨', description: 'Take a break without losing XP' },
  { title: 'Big reward fund', xpCost: 400, icon: '💎', description: 'Save up for something special!' },
  
  // Gaming Rewards
  { title: 'Play one more game', xpCost: 75, icon: '🎮', description: 'Extra gaming session unlocked!' },
  { title: 'Play 1 League game with her', xpCost: 150, icon: '⚔️', description: 'Duo queue time together!' },
  { title: 'FNAF - 1 try', xpCost: 80, icon: '🐻', description: 'Face your fears... once' },
  { title: 'FNAF - 5 tries', xpCost: 180, icon: '🐻', description: 'Survive the night... five times' },
  { title: 'FNAF - 10 tries', xpCost: 300, icon: '🐻', description: 'Marathon horror session!' },
  
  // Reading Tasks
  { title: 'Read 1 page of a book', xpCost: 100, icon: '📖', description: 'She picks the book!' },
  { title: 'Read 5 pages of a book', xpCost: 200, icon: '📚', description: 'Get into the story!' },
  { title: 'Read 10 pages of a book', xpCost: 350, icon: '📕', description: 'Serious reading time!' },
  { title: 'Read 25 pages of a book', xpCost: 600, icon: '📗', description: 'Almost a chapter!' },
  
  // TV/Entertainment
  { title: 'Watch 1 episode with her', xpCost: 120, icon: '📺', description: 'Cozy viewing time together' },
  
  // Messages & Photos
  { title: 'Send heartfelt message', xpCost: 250, icon: '💌', description: 'Pour your heart out to her' },
  { title: 'Send spicy message', xpCost: 300, icon: '🌶️', description: 'Turn up the heat...' },
  { title: 'Send nasty message', xpCost: 400, icon: '🔥', description: 'Make her blush hard' },
  { title: 'Send cute photo', xpCost: 200, icon: '📸', description: 'Show off that smile!' },
  { title: 'Send spicy photo', xpCost: 450, icon: '😏', description: 'Drive her wild...' },
  { title: 'Send nasty photo', xpCost: 600, icon: '🥵', description: 'Only for her eyes...' },
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
  { id: 'task1', startTime: '10:30', endTime: '11:30', type: 'task', label: 'Task Slot 1' },
  { id: 'task2', startTime: '11:30', endTime: '12:30', type: 'task', label: 'Task Slot 2' },
  { id: 'task3', startTime: '12:30', endTime: '13:30', type: 'meal', label: 'Lunch' },
  { id: 'lunch', startTime: '13:30', endTime: '15:00', type: 'task', label: 'Task Slot 3' },
  { id: 'task4', startTime: '15:00', endTime: '16:00', type: 'task', label: 'Task Slot 4' },
  { id: 'winddown', startTime: '16:00', endTime: '16:30', type: 'free', label: 'Wind-down' },
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