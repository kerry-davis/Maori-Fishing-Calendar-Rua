export enum FishingRating {
  Excellent = "Excellent",
  Good = "Good",
  Average = "Average",
  Poor = "Poor",
}

export interface MaramatakaPhase {
  name: string;
  quality: FishingRating;
  description: string;
  biteQualities: [string, string, string, string]; // Corresponds to major1, major2, minor1 (rise), minor2 (set)
}

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  phase: MaramatakaPhase;
  isToday: boolean;
  isCurrentMonth: boolean;
  hasLog: boolean;
}

export interface UserLocation {
  lat: number;
  lon: number;
  name: string;
}

// --- IndexedDB Entities ---

export interface Trip {
  id?: number; // Auto-incrementing primary key
  date: string; // YYYY-MM-DD
  water: string;
  location: string;
  hours: number;
  companions: string;
  notes: string;
}

export interface FishCatch {
  id?: number; // Auto-incrementing primary key
  tripId: number;
  species: string;
  gear: string[];
  length: string;
  weight: string;
  time: string; // HH:MM
  details: string;
  photo?: string; // Base64 encoded image
}

export interface WeatherLog {
  id?: number; // Auto-incrementing primary key
  tripId: number;
  timeOfDay: 'AM' | 'PM' | 'EVE';
  sky: string;
  windCondition: string;
  windDirection: string;
  waterTemp?: number;
  airTemp?: number;
}

// --- localStorage Entities ---

export interface TackleItem {
  id: number; // Timestamp-based
  name: string;
  brand: string;
  type: string;
  colour: string;
}
