/**
 * MMA Universe - Main App Navigator
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import { OnboardingScreen } from '@screens/onboarding';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '@screens/auth';
import { HomeScreen } from '@screens/home';
import { FightersListScreen, FighterDetailScreen } from '@screens/fighters';
import { EventsScreen, EventDetailScreen } from '@screens/events';
import { SocialFeedScreen, CreatePostScreen, PostDetailScreen } from '@screens/social';
import { ConversationsScreen, ChatRoomScreen } from '@screens/chat';
import { ProfileScreen, SettingsScreen } from '@screens/profile';

// Theme
import { colors, typography, spacing, layout } from '@theme/tokens';

// =============================================================================
// NAVIGATION THEME
// =============================================================================

const NavigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary.red,
    background: colors.primary.dark,
    card: colors.neutral[100],
    text: colors.text.primary,
    border: colors.neutral[200],
    notification: colors.primary.red,
  },
};

// =============================================================================
// STACK NAVIGATORS
// =============================================================================

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'fade',
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Home Stack
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="FighterDetail" component={FighterDetailScreen} />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} />
  </Stack.Navigator>
);

// Fighters Stack
const FightersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="FightersMain" component={FightersListScreen} />
    <Stack.Screen name="FighterDetail" component={FighterDetailScreen} />
  </Stack.Navigator>
);

// Events Stack
const EventsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="EventsMain" component={EventsScreen} />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    <Stack.Screen name="FighterDetail" component={FighterDetailScreen} />
  </Stack.Navigator>
);

// Social Stack
const SocialStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="SocialMain" component={SocialFeedScreen} />
    <Stack.Screen name="CreatePost" component={CreatePostScreen} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="FighterDetail" component={FighterDetailScreen} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} />
  </Stack.Navigator>
);

// =============================================================================
// TAB BAR COMPONENT
// =============================================================================

interface TabBarIconProps {
  focused: boolean;
  color: string;
  name: string;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ focused, color, name }) => {
  const iconName = focused ? name : `${name}-outline`;
  return (
    <View style={tabBarStyles.iconContainer}>
      <Ionicons name={iconName as any} size={24} color={color} />
      {focused && <View style={tabBarStyles.indicator} />}
    </View>
  );
};

const tabBarStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary.red,
    marginTop: 4,
  },
});

// =============================================================================
// MAIN TAB NAVIGATOR
// =============================================================================

const MainTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.neutral[100],
          borderTopWidth: 0,
          elevation: 0,
          height: layout.tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        tabBarActiveTintColor: colors.text.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: {
          fontFamily: typography.fonts.bodyMedium,
          fontSize: 10,
          marginTop: -4,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} name="home" />
          ),
        }}
      />
      <Tab.Screen
        name="Fighters"
        component={FightersStack}
        options={{
          tabBarLabel: 'Combattants',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} name="people" />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsStack}
        options={{
          tabBarLabel: 'Événements',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} name="calendar" />
          ),
        }}
      />
      <Tab.Screen
        name="Social"
        component={SocialStack}
        options={{
          tabBarLabel: 'Social',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} name="chatbubbles" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} name="person" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// =============================================================================
// ROOT NAVIGATOR
// =============================================================================

const RootStack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  // TODO: Add auth state check
  const isAuthenticated = true;
  const hasSeenOnboarding = true;

  return (
    <NavigationContainer theme={NavigationTheme}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {!hasSeenOnboarding ? (
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <RootStack.Screen name="Main" component={MainTabs} />
            <RootStack.Screen
              name="Chat"
              component={ConversationsScreen}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'modal',
              }}
            />
            <RootStack.Screen
              name="ChatRoom"
              component={ChatRoomScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
