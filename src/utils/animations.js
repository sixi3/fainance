import { Easing } from 'react-native';

// Animation timing presets
export const ANIMATION_TIMING = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Spring animation presets
export const SPRING_CONFIG = {
  // Light spring - for subtle interactions
  light: {
    damping: 20,
    stiffness: 100,
    mass: 0.8,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
  
  // Medium spring - for standard interactions
  medium: {
    damping: 15,
    stiffness: 150,
    mass: 0.8,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
  
  // Heavy spring - for impactful interactions
  heavy: {
    damping: 10,
    stiffness: 200,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
  
  // Bouncy spring - for playful interactions
  bouncy: {
    damping: 8,
    stiffness: 300,
    mass: 0.5,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

// Easing functions
export const EASING = {
  easeInOut: Easing.bezier(0.25, 0.1, 0.25, 1),
  easeOut: Easing.bezier(0.0, 0.0, 0.2, 1),
  easeIn: Easing.bezier(0.4, 0.0, 1, 1),
  easeOutBack: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  easeInBack: Easing.bezier(0.6, -0.28, 0.735, 0.045),
};

// Card animation presets
export const CARD_ANIMATIONS = {
  entrance: {
    opacity: { from: 0, to: 1 },
    scale: { from: 0.95, to: 1 },
    translateY: { from: 20, to: 0 },
    spring: SPRING_CONFIG.medium,
  },
  
  press: {
    scale: { from: 1, to: 0.98 },
    spring: SPRING_CONFIG.light,
  },
  
  release: {
    scale: { from: 0.98, to: 1 },
    spring: SPRING_CONFIG.light,
  },
};

// Pagination dot animation presets
export const PAGINATION_ANIMATIONS = {
  active: {
    width: { from: 8, to: 32 },
    opacity: { from: 0.3, to: 1 },
    scale: { from: 0.8, to: 1.1 },
    spring: SPRING_CONFIG.medium,
  },
  
  inactive: {
    width: { from: 32, to: 8 },
    opacity: { from: 1, to: 0.3 },
    scale: { from: 1.1, to: 0.8 },
    spring: SPRING_CONFIG.medium,
  },
};

// Utility functions
export const createStaggeredDelay = (index, baseDelay = 100) => {
  return index * baseDelay;
};

export const createInterpolatedValue = (input, inputRange, outputRange, extrapolate = 'clamp') => {
  return {
    input,
    inputRange,
    outputRange,
    extrapolate,
  };
};

// Animation sequences
export const createEntranceSequence = (index, animations) => {
  const delay = createStaggeredDelay(index);
  return {
    opacity: delay,
    scale: delay,
    translateY: delay,
    ...animations,
  };
}; 