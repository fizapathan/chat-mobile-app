import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { AppNavigator } from './src/navigation';
import { initializeStores } from './src/store';
import { theme } from './src/styles/theme';

export default function App() {
  useEffect(() => {
    // Initialize all Zustand stores when app starts
    initializeStores();
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
