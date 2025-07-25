// Theme system based on Figma design specifications
export const COLORS = {
  // Primary colors
  background: '#090A09',
  surface: '#141C18',
  surfaceGradient: {
    from: '#232523',
    to: '#1A1E1C',
  },
  
  // Accent colors
  primary: '#E3FFBB',
  secondary: '#4D5753',
  tertiary: '#9AABA0',
  
  // Status colors
  success: '#2C8249',
  warning: '#F15A29',
  error: '#F12929',
  
  // Financial colors
  currency: '#F15A29',
  investment: '#003874',
  gold: '#D2AB67',
  
  // UI colors
  border: '#222E29',
  divider: '#70897E',
  dot: '#3D4C45',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#E3FFBB',
  textTertiary: '#9AABA0',
  
  // Assistant colors
  assistantGradient: {
    from: '#2A4E2A',
    to: '#011A01',
  },
  
  // Bank colors
  bankOfBaroda: '#F15A29',
  kotakBank: '#003874',
};

export const TYPOGRAPHY = {
  fonts: {
    primary: 'Hiragino Sans',
    currency: 'Inknut Antiqua',
    status: 'SF Pro',
  },
  
  weights: {
    light: '250',
    regular: '300',
    medium: '400',
    semibold: '500',
    bold: '600',
    black: '700',
  },
  
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 20,
    '2xl': 22,
    '3xl': 28,
  },
  
  lineHeights: {
    tight: 0.785, // For large numbers
    normal: 1.375,
    relaxed: 1.571,
    loose: 1.833,
  },
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
  '5xl': 64,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 48,
  '3xl': 52, // Device frame
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const ANIMATIONS = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
};

// Device dimensions
export const DEVICE = {
  padding: SPACING.md,
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATIONS,
  DEVICE,
}; 