import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { GameState } from '@/types';
import { getInitialGameState } from './storage';

// Helper function to remove undefined values and convert them to null
const cleanForFirestore = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(cleanForFirestore);
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      const value = obj[key];
      // Keep null, convert undefined to null, otherwise clean recursively
      if (value === undefined) {
        cleaned[key] = null;
      } else if (value === null) {
        cleaned[key] = null;
      } else {
        cleaned[key] = cleanForFirestore(value);
      }
    }
    return cleaned;
  }
  
  return obj;
};

export const saveGameStateToFirestore = async (userId: string, state: GameState): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);

    const cleanedState = cleanForFirestore(state);
    
    await setDoc(userDocRef, {
      gameState: cleanedState,
      lastUpdated: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error details:', error);
    console.error('Error code:', (error as any).code);
    console.error('Error message:', (error as any).message);
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