import { useSharedValue, withSpring, withTiming, Easing, interpolate } from 'react-native-reanimated';

export const useAnimations = () => {
  const createSpringAnimation = (config = {}) => {
    const defaultConfig = {
      damping: 15,
      stiffness: 150,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    };
    
    return (value, toValue) => {
      return withSpring(toValue, { ...defaultConfig, ...config });
    };
  };

  const createTimingAnimation = (config = {}) => {
    const defaultConfig = {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    };
    
    return (value, toValue) => {
      return withTiming(toValue, { ...defaultConfig, ...config });
    };
  };

  const createPulseAnimation = (config = {}) => {
    const defaultConfig = {
      duration: 2000,
      easing: Easing.inOut(Easing.cubic),
    };
    
    return (value, toValue) => {
      return withTiming(toValue, { ...defaultConfig, ...config });
    };
  };

  return {
    createSpringAnimation,
    createTimingAnimation,
    createPulseAnimation,
  };
};

export const usePaginationAnimation = (scrollX, index, cardWidth, cardSpacing) => {
  const animatedStyle = useSharedValue({
    width: 8,
    opacity: 0.4,
  });

  const updateAnimation = (scrollOffset) => {
    const inputRange = [
      (index - 1) * (cardWidth + cardSpacing),
      index * (cardWidth + cardSpacing),
      (index + 1) * (cardWidth + cardSpacing),
    ];

    const width = interpolate(
      scrollOffset,
      inputRange,
      [8, 24, 8],
      'clamp'
    );

    const opacity = interpolate(
      scrollOffset,
      inputRange,
      [0.4, 1, 0.4],
      'clamp'
    );

    animatedStyle.value = {
      width: withSpring(width, {
        damping: 15,
        stiffness: 150,
        mass: 0.8,
      }),
      opacity: withSpring(opacity, {
        damping: 15,
        stiffness: 150,
        mass: 0.8,
      }),
    };
  };

  return { animatedStyle, updateAnimation };
}; 