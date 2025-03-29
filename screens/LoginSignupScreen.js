import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Keyboard,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { supabase } from '../supabase'; // Ensure you have the Supabase client setup

const LoginSignupScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [slideAnim]);

  const handleSignup = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('MainApp');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required!');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('MainApp');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Animated.View
          style={[
            styles.contentContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>

          {!isKeyboardVisible && (
            <View style={styles.statsContainer}>
              <View
                style={[
                  styles.statItem,
                  { alignSelf: 'flex-start', backgroundColor: '#d9f99d' },
                ]}
              >
                <Text style={styles.statNumber}>30%</Text>
                <Text style={styles.statText}>
                  of food in the US is wasted annually.
                </Text>
              </View>
              <View
                style={[
                  styles.statItem,
                  { alignSelf: 'center', backgroundColor: '#fca5a5' },
                ]}
              >
                <Text style={styles.statNumber}>219 lbs</Text>
                <Text style={styles.statText}>
                  of food waste per person each year.
                </Text>
              </View>
              <View
                style={[
                  styles.statItem,
                  { alignSelf: 'flex-end', backgroundColor: '#fde68a' },
                ]}
              >
                <Text style={styles.statNumber}>$1,600</Text>
                <Text style={styles.statText}>
                  saved yearly by reducing food waste.
                </Text>
              </View>
            </View>
          )}

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={isLogin ? handleLogin : handleSignup}
          >
            <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsLogin(!isLogin)}
            style={styles.toggleContainer}
          >
            <Text style={styles.toggleText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 20,
  },
  statsContainer: {
    marginBottom: 30,
    width: '100%',
  },
  statItem: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  statText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleContainer: {
    marginTop: 20,
    alignSelf: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
});

export default LoginSignupScreen;
