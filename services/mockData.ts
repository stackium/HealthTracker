import { HealthMetrics, WeightEntry, BloodPressureEntry, SleepEntry, User } from '@/types/health';

export const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  age: 28,
  height: 165,
  weight: 62,
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
};

// Generate mock health data for the last 30 days
export const generateMockHealthData = (): HealthMetrics[] => {
  const data: HealthMetrics[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      steps: Math.floor(Math.random() * 5000) + 6000, // 6000-11000 steps
      calories: Math.floor(Math.random() * 800) + 1800, // 1800-2600 calories
      heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
      sleepHours: Math.random() * 3 + 6, // 6-9 hours
      date: date.toISOString().split('T')[0]
    });
  }
  
  return data;
};

export const mockWeightEntries: WeightEntry[] = [
  { id: '1', weight: 62.5, date: '2024-01-10' },
  { id: '2', weight: 62.2, date: '2024-01-03' },
  { id: '3', weight: 62.8, date: '2023-12-27' },
  { id: '4', weight: 63.1, date: '2023-12-20' },
];

export const mockBloodPressureEntries: BloodPressureEntry[] = [
  { id: '1', systolic: 118, diastolic: 78, date: '2024-01-10' },
  { id: '2', systolic: 122, diastolic: 82, date: '2024-01-03' },
  { id: '3', systolic: 115, diastolic: 75, date: '2023-12-27' },
];

export const mockSleepEntries: SleepEntry[] = [
  { id: '1', hours: 7.5, quality: 'good', date: '2024-01-10' },
  { id: '2', hours: 6.8, quality: 'fair', date: '2024-01-09' },
  { id: '3', hours: 8.2, quality: 'excellent', date: '2024-01-08' },
];