import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { useUserStore } from './src/store/userStore';
import { View, Text } from 'react-native';

import AddExpenseScreen from './src/screens/AddExpenseScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import GoalScreen from './src/screens/GoalScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // Hydration check for Zustand persist
  const [isHydrated, setIsHydrated] = useState(false);
  const isOnboarded = useUserStore((state) => state.isOnboarded);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return <View className="flex-1 bg-slate-950 items-center justify-center"><Text className="text-white">Loading...</Text></View>;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        )}
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="Analysis" component={AnalysisScreen} />
        <Stack.Screen name="Budget" component={BudgetScreen} />
        <Stack.Screen name="Goals" component={GoalScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
