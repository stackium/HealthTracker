import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Heart, Flame, Moon, LogOut } from 'lucide-react-native';
import { useHealth } from '@/hooks/useHealthStore';
import { router } from 'expo-router';
import MetricCard from '@/components/MetricCard';

export default function DashboardScreen() {
  const { getTodayMetrics, getWeeklyAverage, user, logout } = useHealth();
  const [refreshing, setRefreshing] = React.useState(false);

  const todayMetrics = getTodayMetrics();
  const weeklyAverage = getWeeklyAverage();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleBackToLogin = () => {
    Alert.alert(
      'Back to Login',
      'Are you sure you want to logout and return to the login screen?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.backToLoginButton} 
              onPress={handleBackToLogin}
            >
              <LogOut color="#667eea" size={20} />
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Today&apos;s Activity</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Steps"
            value={todayMetrics?.steps.toLocaleString() || '0'}
            unit="steps"
            icon={Activity}
            gradient={['#667eea', '#764ba2']}
            progress={todayMetrics ? (todayMetrics.steps / 10000) * 100 : 0}
          />
          <MetricCard
            title="Calories"
            value={todayMetrics?.calories.toLocaleString() || '0'}
            unit="kcal"
            icon={Flame}
            gradient={['#f093fb', '#f5576c']}
            progress={todayMetrics ? (todayMetrics.calories / 2500) * 100 : 0}
          />
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            title="Heart Rate"
            value={todayMetrics?.heartRate.toString() || '0'}
            unit="bpm"
            icon={Heart}
            gradient={['#4facfe', '#00f2fe']}
          />
          <MetricCard
            title="Sleep"
            value={todayMetrics?.sleepHours.toFixed(1) || '0'}
            unit="hours"
            icon={Moon}
            gradient={['#a8edea', '#fed6e3']}
            progress={todayMetrics ? (todayMetrics.sleepHours / 8) * 100 : 0}
          />
        </View>

        {weeklyAverage && (
          <>
            <Text style={styles.sectionTitle}>Weekly Average</Text>
            <View style={styles.weeklyStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{weeklyAverage.steps.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Steps</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{weeklyAverage.calories.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{weeklyAverage.heartRate}</Text>
                <Text style={styles.statLabel}>Heart Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{weeklyAverage.sleepHours}h</Text>
                <Text style={styles.statLabel}>Sleep</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  backToLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#667eea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backToLoginText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  weeklyStats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});