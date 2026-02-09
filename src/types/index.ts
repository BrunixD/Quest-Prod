// Core Types
export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpValue: number;
  notes?: string;
  completed: boolean;
  completedAt?: string;
}

export interface ScheduleSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: 'task' | 'meal' | 'break' | 'free';
  label: string;
}

export type TaskCategory = 
  | 'Creative / Art'
  | 'Craft / Sewing'
  | 'Writing / Learning'
  | 'Content / Online'
  | 'Gaming / Fun'
  | 'Life Skills';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: 'task' | 'break' | 'meal' | 'free';
  label: string;
  taskId?: string;
}

export interface DailyProgress {
  date: string;
  completedTasks: number;
  totalTasks: number;
  xpEarned: number;
  tasksCompleted: string[];
  tasksSkipped: string[];
  tasksPenalty: string[];
  slotAssignments?: Record<string, string>;
  slotsCompleted?: string[];
  slotsSkipped?: string[];
}

export interface WeeklyRotation {
  weekStart: string;
  selectedTasks: string[];
}

export interface Reward {
  id: string;
  title: string;
  xpCost: number;
  description?: string;
  icon: string;
  purchased: boolean;
  purchasedAt?: string;
}

export interface UserProgress {
  totalXP: number;
  currentLevel: number;
  streak: number;
  lastActiveDate: string;
  weeklyProgress: Record<string, DailyProgress>;
  history: DailyProgress[];
  profileIcon?: string;
}

export interface Level {
  level: number;
  title: string;
  xpRequired: number;
  icon: string;
}

export interface GameState {
  userProgress: UserProgress;
  tasks: Task[];
  weeklyRotation: WeeklyRotation;
  rewards: Reward[];
  schedule: TimeSlot[];
  settings: Settings;
}

export interface Settings {
  soundEnabled: boolean;
  darkMode: boolean;
  dailyStartTime: string;
  dailyEndTime: string;
}