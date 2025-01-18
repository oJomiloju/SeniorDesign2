import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import LandingScreen from './screens/LandingScreen';
import LoginSignupScreen from './screens/LoginSignupScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SmartSuggestionsScreen from './screens/SmartSuggestionsScreen';
import ItemDetailsScreen from './screens/ItemDetailsScreen'; // Import the ItemDetailsScreen

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tabs for the App
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide the header
        tabBarStyle: {
          backgroundColor: '#000', // Dark background
          borderRadius: 30, // Rounded edges
          height: 70, // Adjust the height
          width: '90%', // Ensure width is 90% of the screen
          alignSelf: 'center', // Center it horizontally
          position: 'absolute', // Float above content
          bottom: 30, // Position it above the bottom
          shadowColor: '#000', // Add shadow for floating effect
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          marginHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#FFF', // Active tab icon color
        tabBarInactiveTintColor: '#fff', // Inactive tab icon color
        tabBarShowLabel: false, // Hide the labels (only show icons)
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          // Set different icons for each screen
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Suggestions') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Suggestions" component={SmartSuggestionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

    </Tab.Navigator>
  );
}

// Main Stack Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginSignup"
          component={LoginSignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ItemDetails"
          component={ItemDetailsScreen} // Add ItemDetailsScreen here
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
