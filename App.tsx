import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { AppNavigator } from './src/navigation';
import { initializeStores } from './src/store';
import { theme } from './src/styles/theme';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize all Zustand stores when app starts
      await initializeStores();
      SplashScreen.hideAsync();
    };
    
    initializeApp();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppNavigator />
      <StatusBar 
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
    </View>
  );
}
