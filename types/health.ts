export interface HealthMetrics {
  steps: number;
  calories: number;
  heartRate: number;
  sleepHours: number;
  date: string;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

export interface BloodPressureEntry {
  id: string;
  systolic: number;
  diastolic: number;
  date: string;
}

export interface SleepEntry {
  id: string;
  hours: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  avatar: string;
}