
export enum View {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  NAVIGATE = 'NAVIGATE',
  CONTACTS = 'CONTACTS',
  SOS = 'SOS',
  RAKSHAK = 'RAKSHAK',
  ABOUT = 'ABOUT',
  PROFILE = 'PROFILE'
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  priority: 'Primary' | 'Secondary' | 'Emergency';
}

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
  email?: string;
  emergencyPreferences: string;
  avatar?: string;
  uid?: string;
}

export interface SafetyPoint {
  lat: number;
  lng: number;
  type: 'Police' | 'Hospital' | 'NGO' | 'Well-lit';
  name: string;
}

export interface Route {
  id: string;
  name: string;
  distance: string;
  eta: string;
  safetyScore: number;
  isSafest: boolean;
  points: [number, number][];
}
