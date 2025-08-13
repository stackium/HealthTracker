import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Calendar, Ruler, Scale, LogOut, Settings, Bell, Shield } from 'lucide-react-native';
import { useHealth } from '@/hooks/useHealthStore';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout, weightEntries, bloodPressureEntries, sleepEntries } = useHealth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
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

  const latestWeight = weightEntries[0]?.weight;
  const latestBP = bloodPressureEntries[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: user?.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Health Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Scale color="#667eea" size={24} />
              <Text style={styles.statValue}>{latestWeight?.toFixed(1) || user?.weight} kg</Text>
              <Text style={styles.statLabel}>Current Weight</Text>
            </View>
            <View style={styles.statCard}>
              <Ruler color="#f5576c" size={24} />
              <Text style={styles.statValue}>{user?.height} cm</Text>
              <Text style={styles.statLabel}>Height</Text>
            </View>
            <View style={styles.statCard}>
              <Calendar color="#4facfe" size={24} />
              <Text style={styles.statValue}>{user?.age}</Text>
              <Text style={styles.statLabel}>Age</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.bmiValue}>
                {user ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1) : '0'}
              </Text>
              <Text style={styles.statLabel}>BMI</Text>
            </View>
          </View>
        </View>

        {/* Recent Entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          <View style={styles.entryCard}>
            <Text style={styles.entryTitle}>Latest Blood Pressure</Text>
            <Text style={styles.entryValue}>
              {latestBP ? `${latestBP.systolic}/${latestBP.diastolic} mmHg` : 'No data'}
            </Text>
            <Text style={styles.entryDate}>
              {latestBP ? new Date(latestBP.date).toLocaleDateString() : ''}
            </Text>
          </View>
          <View style={styles.entryCard}>
            <Text style={styles.entryTitle}>Sleep Entries</Text>
            <Text style={styles.entryValue}>{sleepEntries.length} recorded</Text>
            <Text style={styles.entryDate}>Last 30 days</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Settings color="#666" size={20} />
            <Text style={styles.settingText}>App Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Bell color="#666" size={20} />
            <Text style={styles.settingText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Shield color="#666" size={20} />
            <Text style={styles.settingText}>Privacy & Security</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color="#f5576c" size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>HealthTracker v1.0.0</Text>
          <Text style={styles.footerText}>Demo Version</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  bmiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4facfe',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  entryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  entryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 12,
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f5576c',
  },
  logoutText: {
    fontSize: 16,
    color: '#f5576c',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
});