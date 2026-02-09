import { supabase } from './supabase';
import { GameState } from '@/types';
import { getInitialGameState } from './storage';

export const saveGameStateToSupabase = async (userId: string, state: GameState): Promise<void> => {
  try {
    console.log('💾 Saving to Supabase for user:', userId);
    console.log('📦 Data being saved:', state);
    
    const { data, error } = await supabase
      .from('user_data')
      .upsert({
        user_id: userId,
        game_state: state,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      console.error('❌ Supabase save error:', error);
      throw error;
    }
    
    console.log('✅ Save successful! Saved data:', data);
  } catch (error) {
    console.error('❌ Error saving to Supabase:', error);
    throw error;
  }
};

export const loadGameStateFromSupabase = async (userId: string): Promise<GameState | null> => {
  try {
    console.log('📥 Loading from Supabase for user:', userId);
    
    const { data, error } = await supabase
      .from('user_data')
      .select('game_state')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('🆕 No existing data, creating initial state');
        const initialState = getInitialGameState();
        await saveGameStateToSupabase(userId, initialState);
        return initialState;
      }
      console.error('❌ Load error:', error);
      throw error;
    }

    console.log('✅ Loaded successfully!');
    console.log('📦 Loaded data:', data.game_state);
    return data.game_state as GameState;
  } catch (error) {
    console.error('❌ Error loading from Supabase:', error);
    return null;
  }
};

export const subscribeToGameState = (
  userId: string,
  callback: (state: GameState) => void
): (() => void) => {
  console.log('👂 Setting up real-time subscription for:', userId);

  const channel = supabase
    .channel(`user_data:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_data',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('🔔 Received real-time update:', payload);
        if (payload.new && 'game_state' in payload.new) {
          callback(payload.new.game_state as GameState);
        }
      }
    )
    .subscribe();

  return () => {
    console.log('👋 Cleaning up subscription');
    supabase.removeChannel(channel);
  };
};