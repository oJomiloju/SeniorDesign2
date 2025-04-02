import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../supabase';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndItems = async () => {
    setLoading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return;

    const userId = user.id;

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: fridgeItems, error: fridgeError } = await supabase
      .from('fridge_items')
      .select('*')
      .eq('profile_id', userId);

    if (profileError || fridgeError) {
      console.error(profileError || fridgeError);
      return;
    }

    const today = new Date();

    const expiringSoon = fridgeItems.filter(item => {
      const expDate = new Date(item.expiration_date);
      const diffDays = (expDate - today) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 4;
    }).map(item => ({
      id: item.id,
      message: `${item.name} expiring in ${Math.ceil((new Date(item.expiration_date) - today) / (1000 * 60 * 60 * 24))} days`,
    }));

    const expiredItems = fridgeItems.filter(item => {
      const expDate = new Date(item.expiration_date);
      return expDate < today;
    }).map(item => ({
      id: item.id,
      message: `${item.name} expired`,
    }));

    setNotifications([...expiringSoon, ...expiredItems]);
    setProfile(profileData);
    setFridgeItems(fridgeItems);
    setLoading(false);
  };

  // ✅ This makes the screen re-fetch data every time it is focused
  useFocusEffect(
    useCallback(() => {
      fetchProfileAndItems();
    }, [])
  );

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout Error', error.message);
    } else {
      navigation.replace('LoginSignup');
    }
  };

  const faqs = [
    {
      id: '1',
      question: 'How do I add items to my fridge?',
      answer: 'Use the + button on the home screen to add items manually or scan a receipt.',
    },
    {
      id: '2',
      question: 'How does the app suggest recipes?',
      answer: 'The app uses the items in your fridge to suggest recipes you can try.',
    },
    {
      id: '3',
      question: 'Can I edit my profile?',
      answer: 'Profile editing will be available in the next update!',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={profile?.avatar ? { uri: profile.avatar } : require('../assets/helper.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{profile?.full_name || 'Loading...'}</Text>
        <Text style={styles.profileEmail}>{profile?.email || ''}</Text>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.notificationsContainer}>
          {notifications.length > 0 ? notifications.map(notification => (
            <View key={notification.id} style={styles.notificationBubble}>
              <Text style={styles.notificationText}>{notification.message}</Text>
            </View>
          )) : (
            <Text style={{ color: '#6B7280' }}>No expiring items soon.</Text>
          )}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{fridgeItems?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Items Saved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {
              fridgeItems?.filter(item => new Date(item.expiration_date) < new Date())?.length ?? 0
            }
          </Text>
          <Text style={styles.statLabel}>Items Wasted</Text>
        </View>
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQ</Text>
        {faqs.map((faq) => (
          <View key={faq.id} style={styles.faqCard}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        ))}
      </View>

      {/* Help & Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>
        <TouchableOpacity style={styles.supportButton}>
          <Text style={styles.supportButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 30, paddingTop: 50 },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#292524' },
  profileEmail: { fontSize: 16, color: '#6B7280' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  notificationsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  notificationBubble: {
    backgroundColor: '#FECACA',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationText: { fontSize: 14, color: '#111827', fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: {
    backgroundColor: '#A7F3D0',
    borderRadius: 10,
    padding: 20,
    width: '48%',
    alignItems: 'center',
  },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#111827' },
  statLabel: { fontSize: 16, color: '#6B7280' },
  faqCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqQuestion: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 5 },
  faqAnswer: { fontSize: 14, color: '#6B7280' },
  supportButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  supportButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 80,
  },
  logoutButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;
