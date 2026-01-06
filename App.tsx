import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { UserProvider, useUserContext } from './src/context/UserContext';
import { View, Text } from 'react-native';

import AddExpenseScreen from './src/screens/AddExpenseScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import GoalScreen from './src/screens/GoalScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}

function MainApp() {
  const { isOnboarded } = useUserContext();

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
