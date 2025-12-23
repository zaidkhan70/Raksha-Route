
import { UserProfile } from '../types';

/**
 * Mocking Firebase behavior for the prototype.
 * In a real app, you would use:
 * import { initializeApp } from "firebase/app";
 * import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
 */

const STORAGE_KEY = 'raksha_route_users';

export const firebaseAuth = {
  // Simulate Registration
  signup: async (email: string, pass: string, profile: UserProfile): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        if (users[email]) {
          reject(new Error("User already exists with this email."));
          return;
        }
        users[email] = { password: pass, profile };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        resolve();
      }, 1000);
    });
  },

  // Simulate Login
  login: async (email: string, pass: string): Promise<UserProfile> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const userData = users[email];
        if (userData && userData.password === pass) {
          resolve(userData.profile);
        } else {
          reject(new Error("Invalid email or password."));
        }
      }, 1000);
    });
  },

  // Simulate Google Sign-In
  loginWithGoogle: async (): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock profile for Google User
        const googleProfile: UserProfile = {
          name: 'Google User',
          phone: '+91 00000 00000',
          address: 'Location fetched from Google Account',
          emergencyPreferences: 'Standard SOS Protocol Enabled',
        };
        resolve(googleProfile);
      }, 1500);
    });
  }
};
