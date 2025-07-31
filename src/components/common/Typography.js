import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../constants/theme';

const Typography = ({
  variant = 'body',
  weight = 'regular',
  color = 'textPrimary',
  size,
  lineHeight,
  style,
  children,
  ...props
}) => {
  const getTextStyle = () => {
    const baseStyle = {
      fontFamily: TYPOGRAPHY.fonts.primary,
      fontWeight: TYPOGRAPHY.weights[weight],
      color: COLORS[color] || color,
    };

    // Apply variant-specific styles
    switch (variant) {
      case 'h1':
        return {
          ...baseStyle,
          fontSize: TYPOGRAPHY.sizes['3xl'],
          lineHeight: TYPOGRAPHY.sizes['3xl'] * TYPOGRAPHY.lineHeights.tight,
          fontWeight: TYPOGRAPHY.weights[weight], // Use the weight prop instead of hardcoded bold
        };
      case 'h2':
        return {
          ...baseStyle,
          fontSize: TYPOGRAPHY.sizes['2xl'],
          lineHeight: TYPOGRAPHY.sizes['2xl'] * TYPOGRAPHY.lineHeights.normal,
          fontWeight: TYPOGRAPHY.weights[weight], // Use the weight prop instead of hardcoded semibold
        };
      case 'h3':
        return {
          ...baseStyle,
          fontSize: TYPOGRAPHY.sizes.xl,
          lineHeight: TYPOGRAPHY.sizes.xl * TYPOGRAPHY.lineHeights.normal,
          fontWeight: TYPOGRAPHY.weights[weight], // Use the weight prop instead of hardcoded semibold
        };
      case 'h4':
        return {
          ...baseStyle,
          fontSize: TYPOGRAPHY.sizes.lg,
          lineHeight: TYPOGRAPHY.sizes.lg * TYPOGRAPHY.lineHeights.normal,
          fontWeight: TYPOGRAPHY.weights[weight], // Use the weight prop instead of hardcoded semibold
        };
      case 'h5':
        return {
          ...baseStyle,
          fontSize: TYPOGRAPHY.sizes.base,
          lineHeight: TYPOGRAPHY.sizes.base * TYPOGRAPHY.lineHeights.normal,
          fontWeight: TYPOGRAPHY.weights[weight], // Use the weight prop instead of hardcoded semibold
        };
      case 'body':
        return {
          ...baseStyle,
          fontSize: TYPOGRAPHY.sizes.sm,
          lineHeight: TYPOGRAPHY.sizes.sm * TYPOGRAPHY.lineHeights.relaxed,
        };
      case 'bodySmall':
        return {
          ...baseStyle,
          fontSize: TYPOGRAPHY.sizes.xs,
          lineHeight: TYPOGRAPHY.sizes.xs * TYPOGRAPHY.lineHeights.loose,
        };
      case 'caption':
        return {
          ...baseStyle,
          fontSize: TYPOGRAPHY.sizes.xs,
          lineHeight: TYPOGRAPHY.sizes.xs * TYPOGRAPHY.lineHeights.loose,
          fontWeight: TYPOGRAPHY.weights.light,
        };
      case 'currency':
        return {
          ...baseStyle,
          fontFamily: TYPOGRAPHY.fonts.currency,
          fontSize: size || TYPOGRAPHY.sizes.base,
          lineHeight: (size || TYPOGRAPHY.sizes.base) * TYPOGRAPHY.lineHeights.relaxed,
          fontWeight: TYPOGRAPHY.weights.semibold,
        };
      case 'status':
        return {
          ...baseStyle,
          fontFamily: TYPOGRAPHY.fonts.status,
          fontSize: size || TYPOGRAPHY.sizes.lg,
          lineHeight: (size || TYPOGRAPHY.sizes.lg) * TYPOGRAPHY.lineHeights.normal,
          fontWeight: TYPOGRAPHY.weights.semibold,
        };
      default:
        return {
          ...baseStyle,
          fontSize: size || TYPOGRAPHY.sizes.base,
          lineHeight: lineHeight || (size || TYPOGRAPHY.sizes.base) * TYPOGRAPHY.lineHeights.relaxed,
        };
    }
  };

  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {children}
    </Text>
  );
};

export default Typography; 