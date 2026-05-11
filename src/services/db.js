import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

export function subscribeToUser(userId, callback) {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  });
}

export async function startNewRecharge(userId, startDate = new Date().toISOString()) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    currentRecharge: {
      startDate: startDate,
      totalMeals: 56
    },
    skippedMeals: []
  });
}

export async function addRecharge(userId, currentTotal) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    'currentRecharge.totalMeals': currentTotal + 56
  });
}

export async function toggleSkippedMeal(userId, dateString, mealType, isCurrentlySkipped) {
  const userRef = doc(db, 'users', userId);
  const mealIdentifier = `${dateString}-${mealType}`;
  
  if (isCurrentlySkipped) {
    await updateDoc(userRef, {
      skippedMeals: arrayRemove(mealIdentifier)
    });
  } else {
    await updateDoc(userRef, {
      skippedMeals: arrayUnion(mealIdentifier)
    });
  }
}

export async function deletePlan(userId) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    currentRecharge: null,
    skippedMeals: []
  });
}
