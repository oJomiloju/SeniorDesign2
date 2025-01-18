import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FoodStatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Food Stats</Text>
      <Text style={styles.subtitle}>
        View your weekly food consumption, expired items, and waste reduction metrics.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default FoodStatsScreen;
