import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import BreakdownFormScreen from './src/screens/BreakdownFormScreen';
import AccidentFormScreen from './src/screens/AccidentFormScreen';
import { getTenant } from './src/tenants';

export type RootStackParamList = {
  Home: undefined;
  BreakdownForm: undefined;
  AccidentForm: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const tenant = getTenant();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: tenant.primaryColor,
          headerBackTitle: 'Back',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BreakdownForm" component={BreakdownFormScreen} options={{ title: 'Breakdown Assistance' }} />
        <Stack.Screen name="AccidentForm" component={AccidentFormScreen} options={{ title: 'Accident Report' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
