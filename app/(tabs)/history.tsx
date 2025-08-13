import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHealth } from '@/hooks/useHealthStore';
import SimpleChart from '@/components/SimpleChart';

export default function HistoryScreen() {
  const { healthData } = useHealth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  const getFilteredData = () => {
    if (selectedPeriod === 'week') {
      return healthData.slice(-7);
    }
    return healthData.slice(-30);
  };

  const filteredData = getFilteredData();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health History</Text>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <SimpleChart
          data={filteredData}
          metric="steps"
          title="Steps"
          color="#667eea"
          unit="steps"
        />

        <SimpleChart
          data={filteredData}
          metric="calories"
          title="Calories Burned"
          color="#f5576c"
          unit="kcal"
        />

        <SimpleChart
          data={filteredData}
          metric="heartRate"
          title="Heart Rate"
          color="#4facfe"
          unit="bpm"
        />

        <SimpleChart
          data={filteredData}
          metric="sleepHours"
          title="Sleep Duration"
          color="#a8edea"
          unit="hours"
        />

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Math.round(filteredData.reduce((sum, day) => sum + day.steps, 0) / filteredData.length).toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>Avg Steps</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Math.round(filteredData.reduce((sum, day) => sum + day.calories, 0) / filteredData.length).toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>Avg Calories</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Math.round(filteredData.reduce((sum, day) => sum + day.heartRate, 0) / filteredData.length)}
              </Text>
              <Text style={styles.summaryLabel}>Avg Heart Rate</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {(filteredData.reduce((sum, day) => sum + day.sleepHours, 0) / filteredData.length).toFixed(1)}h
              </Text>
              <Text style={styles.summaryLabel}>Avg Sleep</Text>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#333',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  summary: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
});