import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation';
import { initializeStores } from './src/store';

export default function App() {
  useEffect(() => {
    // Initialize all Zustand stores when app starts
    initializeStores();
  }, []);

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
