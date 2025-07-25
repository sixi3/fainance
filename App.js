import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { COLORS } from './src/constants/theme';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <>
      <ExpoStatusBar style="light" backgroundColor={COLORS.background} />
      <HomeScreen />
    </>
  );
}
