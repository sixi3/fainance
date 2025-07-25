import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useRef, useCallback } from 'react';

export const useHaptics = () => {
  // Only run haptics on iOS and Android
  const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';
  
  // Debounce refs to prevent rapid-fire haptics
  const lastHapticTime = useRef(0);
  const HAPTIC_DEBOUNCE_MS = 100; // Minimum 100ms between haptics

  const debouncedHaptic = useCallback((hapticFunction) => {
    if (!isHapticsSupported) return;
    
    const now = Date.now();
    if (now - lastHapticTime.current >= HAPTIC_DEBOUNCE_MS) {
      hapticFunction();
      lastHapticTime.current = now;
    }
  }, [isHapticsSupported]);

  const impact = {
    light: useCallback(() => debouncedHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)), [debouncedHaptic]),
    medium: useCallback(() => debouncedHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)), [debouncedHaptic]),
    heavy: useCallback(() => debouncedHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)), [debouncedHaptic]),
  };

  const notification = {
    success: useCallback(() => debouncedHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)), [debouncedHaptic]),
    warning: useCallback(() => debouncedHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)), [debouncedHaptic]),
    error: useCallback(() => debouncedHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)), [debouncedHaptic]),
  };

  const selection = useCallback(() => debouncedHaptic(() => Haptics.selectionAsync()), [debouncedHaptic]);

  return {
    impact,
    notification,
    selection,
  };
}; 