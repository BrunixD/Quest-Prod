import { supabase } from './supabase';
import { Task, Reward, DailyProgress } from '@/types';
import { format } from 'date-fns';

export const db = {
  // ============ USER PROFILE ============
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        total_xp: 0,
        current_level: 1,
        streak: 0,
        last_active_date: format(new Date(), 'yyyy-MM-dd'),
        dark_mode: false,
        sound_enabled: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ============ TASKS ============
  async getTasks(userId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createTask(userId: string, task: Omit<Task, 'id' | 'completed'>) {
    const taskId = `task-${Date.now()}`;
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        task_id: taskId,
        title: task.title,
        category: task.category,
        difficulty: task.difficulty,
        xp_value: task.xpValue,
        notes: task.notes || null,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTask(userId: string, taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', userId)
      .eq('task_id', taskId);

    if (error) throw error;
  },

  async completeTask(userId: string, taskId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ============ SLOT ASSIGNMENTS ============
  async getSlotAssignments(userId: string, date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('slot_assignments')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr);

    if (error) throw error;
    return data || [];
  },

  async assignTaskToSlot(userId: string, date: Date, slotId: string, taskId: string) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('slot_assignments')
      .upsert({
        user_id: userId,
        date: dateStr,
        slot_id: slotId,
        task_id: taskId,
        completed: false,
        skipped: false,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,date,slot_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeSlotAssignment(userId: string, date: Date, slotId: string) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { error } = await supabase
      .from('slot_assignments')
      .delete()
      .eq('user_id', userId)
      .eq('date', dateStr)
      .eq('slot_id', slotId);

    if (error) throw error;
  },

  async completeSlot(userId: string, date: Date, slotId: string) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('slot_assignments')
      .update({
        completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('date', dateStr)
      .eq('slot_id', slotId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async skipSlot(userId: string, date: Date, slotId: string) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('slot_assignments')
      .update({
        skipped: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('date', dateStr)
      .eq('slot_id', slotId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ============ DAILY PROGRESS ============
  async getDailyProgress(userId: string, date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateDailyProgress(userId: string, date: Date, completedTasks: number, xpEarned: number, extraTasksCompleted?: string[]) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('daily_progress')
      .upsert({
        user_id: userId,
        date: dateStr,
        completed_tasks: completedTasks,
        xp_earned: xpEarned,
        extra_tasks_completed: extraTasksCompleted || [],
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,date'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ============ REWARDS ============
  async getRewards(userId: string) {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createReward(userId: string, reward: Omit<Reward, 'id' | 'purchased'>) {
    const rewardId = `reward-${Date.now()}`;
    const { data, error } = await supabase
      .from('rewards')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        title: reward.title,
        xp_cost: reward.xpCost,
        icon: reward.icon,
        description: reward.description || null,
        purchased: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async purchaseReward(userId: string, rewardId: string) {
    const { data, error } = await supabase
      .from('rewards')
      .update({
        purchased: true,
        purchased_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('reward_id', rewardId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteReward(userId: string, rewardId: string) {
    const { error } = await supabase
      .from('rewards')
      .delete()
      .eq('user_id', userId)
      .eq('reward_id', rewardId);

    if (error) throw error;
  },

  // ============ REAL-TIME SUBSCRIPTIONS ============
  subscribeToProfile(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`profile:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToTasks(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`tasks:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToSlotAssignments(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`slots:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'slot_assignments',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToRewards(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`rewards:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rewards',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};