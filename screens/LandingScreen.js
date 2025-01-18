import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';

const LandingScreen = ({ navigation }) => {
  // Features with colors
  const features = [
    { label: "Track Items", color: "#fca5a5" }, 
    { label: "Reduce Waste", color: "#ADD8E6" }, 
    { label: "Smart Suggestions", color: "#d9f99d" }, 
    { label: "Healthy Meals", color: "#d8b4fe" }, 
    { label: "Expiration Alerts", color: "#f0fdf4" }, 
  ];

  // Animation References for Hovering
  const animations = useRef(features.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Loop the hovering effect for each bubble
    animations.forEach((animation, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 10, // Move up by 10px
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0, // Move back down
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [animations]);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>KEEP</Text>
      <Text style={styles.title}>IT FRESH</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Your ultimate tool to manage your fridge, keep track of expiration dates, 
        reduce food waste, and make smarter choices for healthier living.
      </Text>

      {/* Bubbles Section */}
      <View style={styles.bubblesContainer}>
        {features.map((feature, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bubble,
              { backgroundColor: feature.color, transform: [{ translateY: animations[index] }] },
            ]}
          >
            <Text style={styles.bubbleText}>{feature.label}</Text>
          </Animated.View>
        ))}
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginSignup')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 24, // Adjusted font size
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', // Use a serif font
    color: '#0f172a',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 34, // Line height for readability
  },
  bubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  bubbleText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 17,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LandingScreen;
