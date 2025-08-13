import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { HealthMetrics, WeightEntry, BloodPressureEntry, SleepEntry, User } from '@/types/health';
import { generateMockHealthData, mockUser, mockWeightEntries, mockBloodPressureEntries, mockSleepEntries } from '@/services/mockData';

export const [HealthProvider, useHealth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [healthData, setHealthData] = useState<HealthMetrics[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [bloodPressureEntries, setBloodPressureEntries] = useState<BloodPressureEntry[]>([]);
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem('isAuthenticated');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
        setUser(mockUser);
      }
      
      // Load or generate health data
      const storedHealthData = await AsyncStorage.getItem('healthData');
      if (storedHealthData) {
        setHealthData(JSON.parse(storedHealthData));
      } else {
        const mockData = generateMockHealthData();
        setHealthData(mockData);
        await AsyncStorage.setItem('healthData', JSON.stringify(mockData));
      }

      // Load entries
      const storedWeight = await AsyncStorage.getItem('weightEntries');
      setWeightEntries(storedWeight ? JSON.parse(storedWeight) : mockWeightEntries);

      const storedBP = await AsyncStorage.getItem('bloodPressureEntries');
      setBloodPressureEntries(storedBP ? JSON.parse(storedBP) : mockBloodPressureEntries);

      const storedSleep = await AsyncStorage.getItem('sleepEntries');
      setSleepEntries(storedSleep ? JSON.parse(storedSleep) : mockSleepEntries);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    // Mock authentication - accept any email/password
    setIsAuthenticated(true);
    setUser(mockUser);
    await AsyncStorage.setItem('isAuthenticated', 'true');
    return true;
  }, []);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setUser(null);
    await AsyncStorage.removeItem('isAuthenticated');
  }, []);

  const addWeightEntry = useCallback(async (weight: number) => {
    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      weight,
      date: new Date().toISOString().split('T')[0]
    };
    setWeightEntries(prev => {
      const updated = [newEntry, ...prev];
      AsyncStorage.setItem('weightEntries', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addBloodPressureEntry = useCallback(async (systolic: number, diastolic: number) => {
    const newEntry: BloodPressureEntry = {
      id: Date.now().toString(),
      systolic,
      diastolic,
      date: new Date().toISOString().split('T')[0]
    };
    setBloodPressureEntries(prev => {
      const updated = [newEntry, ...prev];
      AsyncStorage.setItem('bloodPressureEntries', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addSleepEntry = useCallback(async (hours: number, quality: 'poor' | 'fair' | 'good' | 'excellent') => {
    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      hours,
      quality,
      date: new Date().toISOString().split('T')[0]
    };
    setSleepEntries(prev => {
      const updated = [newEntry, ...prev];
      AsyncStorage.setItem('sleepEntries', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getTodayMetrics = useCallback((): HealthMetrics | null => {
    const today = new Date().toISOString().split('T')[0];
    return healthData.find(data => data.date === today) || null;
  }, [healthData]);

  const getWeeklyAverage = useCallback(() => {
    const lastWeek = healthData.slice(-7);
    if (lastWeek.length === 0) return null;

    return {
      steps: Math.round(lastWeek.reduce((sum, day) => sum + day.steps, 0) / lastWeek.length),
      calories: Math.round(lastWeek.reduce((sum, day) => sum + day.calories, 0) / lastWeek.length),
      heartRate: Math.round(lastWeek.reduce((sum, day) => sum + day.heartRate, 0) / lastWeek.length),
      sleepHours: Math.round((lastWeek.reduce((sum, day) => sum + day.sleepHours, 0) / lastWeek.length) * 10) / 10
    };
  }, [healthData]);

  return useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    healthData,
    weightEntries,
    bloodPressureEntries,
    sleepEntries,
    login,
    logout,
    addWeightEntry,
    addBloodPressureEntry,
    addSleepEntry,
    getTodayMetrics,
    getWeeklyAverage
  }), [
    user,
    isAuthenticated,
    isLoading,
    healthData,
    weightEntries,
    bloodPressureEntries,
    sleepEntries,
    login,
    logout,
    addWeightEntry,
    addBloodPressureEntry,
    addSleepEntry,
    getTodayMetrics,
    getWeeklyAverage
  ]);
});