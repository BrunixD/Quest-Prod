import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { GameState } from '@/types';
import { getInitialGameState } from './storage';

// Helper function to remove undefined values
const removeUndefined = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (value !== undefined) {
        cleaned[key] = removeUndefined(value);
      }
    }
    return cleaned;
  }
  
  return obj;
};

export const saveGameStateToFirestore = async (userId: string, state: GameState): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Clean the state to remove undefined values
    const cleanedState = removeUndefined(state);
    
    await setDoc(userDocRef, {
      gameState: cleanedState,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    throw error;
  }
};

export const loadGameStateFromFirestore = async (userId: string): Promise<GameState | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.gameState as GameState;
    }
    
    // If no data exists, create initial state
    const initialState = getInitialGameState();
    await saveGameStateToFirestore(userId, initialState);
    return initialState;
  } catch (error) {
    console.error('Error loading from Firestore:', error);
    return null;
  }
};

export const subscribeToGameState = (
  userId: string, 
  callback: (state: GameState) => void
): (() => void) => {
  const userDocRef = doc(db, 'users', userId);
  
  return onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback(data.gameState as GameState);
    }
  });
};