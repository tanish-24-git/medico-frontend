"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"; // If using Firestore for user data
import { getFirestore } from "firebase/firestore";
import { useAppStore } from "@/stores/app-store"

let app: FirebaseApp | null = null

export function getFirebaseApp() {
  if (app) return app
  if (!getApps().length) {
    app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    })
  } else {
    app = getApps()[0]!
  }
  return app
}

const auth = getAuth(getFirebaseApp());
const db = getFirestore(getFirebaseApp()); // If not already there

export async function signInWithGoogle() {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()
  const res = await signInWithPopup(auth, provider)
  return res.user
}

export async function signOutFirebase() {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  await signOut(auth)
}

export function onAuthUser(cb: (user: User | null) => void) {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const unsub = onAuthStateChanged(auth, (u) => {
    const store = useAppStore.getState()
    if (u) {
      useAppStore.setState({ user: u, initialized: true })
    } else {
      useAppStore.setState({ user: null, initialized: true })
    }
    cb(u)
  })
  return unsub
}

// New: Email/Password Sign-Up
export const signUpWithEmail = async (name: string, email: string, password: string, phone: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName: name });
    
    // Store additional data (e.g., phone) in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      phone,
      createdAt: new Date(),
    });
    
    console.log("User signed up:", user);
    return user;
  } catch (error) {
    console.error("Sign-up error:", error);
    throw error;
  }
};

// New: Email/Password Login
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed in:", user);
    return user;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
};