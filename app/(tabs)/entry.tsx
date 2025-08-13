import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Scale, Heart, Moon } from 'lucide-react-native';
import { useHealth } from '@/hooks/useHealthStore';

export default function EntryScreen() {
  const { addWeightEntry, addBloodPressureEntry, addSleepEntry } = useHealth();
  
  const [weight, setWeight] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [sleepQuality, setSleepQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good');

  const handleWeightSubmit = async () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    try {
      await addWeightEntry(weightNum);
      setWeight('');
      Alert.alert('Success', 'Weight entry added successfully');
    } catch {
      Alert.alert('Error', 'Failed to add weight entry');
    }
  };

  const handleBloodPressureSubmit = async () => {
    const systolicNum = parseInt(systolic);
    const diastolicNum = parseInt(diastolic);
    
    if (isNaN(systolicNum) || isNaN(diastolicNum) || systolicNum <= 0 || diastolicNum <= 0) {
      Alert.alert('Error', 'Please enter valid blood pressure values');
      return;
    }

    try {
      await addBloodPressureEntry(systolicNum, diastolicNum);
      setSystolic('');
      setDiastolic('');
      Alert.alert('Success', 'Blood pressure entry added successfully');
    } catch {
      Alert.alert('Error', 'Failed to add blood pressure entry');
    }
  };

  const handleSleepSubmit = async () => {
    const hoursNum = parseFloat(sleepHours);
    if (isNaN(hoursNum) || hoursNum <= 0 || hoursNum > 24) {
      Alert.alert('Error', 'Please enter valid sleep hours (0-24)');
      return;
    }

    try {
      await addSleepEntry(hoursNum, sleepQuality);
      setSleepHours('');
      Alert.alert('Success', 'Sleep entry added successfully');
    } catch {
      Alert.alert('Error', 'Failed to add sleep entry');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manual Entry</Text>
        <Text style={styles.subtitle}>Track your health metrics</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Weight Entry */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Scale color="#667eea" size={24} />
            <Text style={styles.cardTitle}>Weight</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter weight in kg"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleWeightSubmit}>
              <Text style={styles.submitButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Blood Pressure Entry */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Heart color="#f5576c" size={24} />
            <Text style={styles.cardTitle}>Blood Pressure</Text>
          </View>
          <View style={styles.bpContainer}>
            <TextInput
              style={[styles.input, styles.bpInput]}
              placeholder="Systolic"
              value={systolic}
              onChangeText={setSystolic}
              keyboardType="number-pad"
            />
            <Text style={styles.bpSeparator}>/</Text>
            <TextInput
              style={[styles.input, styles.bpInput]}
              placeholder="Diastolic"
              value={diastolic}
              onChangeText={setDiastolic}
              keyboardType="number-pad"
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleBloodPressureSubmit}>
            <Text style={styles.submitButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Sleep Entry */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Moon color="#a8edea" size={24} />
            <Text style={styles.cardTitle}>Sleep</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Hours of sleep"
              value={sleepHours}
              onChangeText={setSleepHours}
              keyboardType="decimal-pad"
            />
          </View>
          
          <Text style={styles.qualityLabel}>Sleep Quality</Text>
          <View style={styles.qualityContainer}>
            {(['poor', 'fair', 'good', 'excellent'] as const).map((quality) => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.qualityButton,
                  sleepQuality === quality && styles.qualityButtonActive
                ]}
                onPress={() => setSleepQuality(quality)}
              >
                <Text style={[
                  styles.qualityButtonText,
                  sleepQuality === quality && styles.qualityButtonTextActive
                ]}>
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSleepSubmit}>
            <Text style={styles.submitButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  bpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bpInput: {
    flex: 1,
  },
  bpSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 12,
  },
  submitButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  qualityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  qualityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  qualityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  qualityButtonActive: {
    backgroundColor: '#a8edea',
    borderColor: '#a8edea',
  },
  qualityButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  qualityButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});