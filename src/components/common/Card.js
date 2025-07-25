import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from '../../constants/theme';

const Card = ({
  children,
  variant = 'default',
  onPress,
  style,
  contentStyle,
  disabled = false,
  ...props
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'surface':
        return {
          backgroundColor: COLORS.surface,
          borderColor: COLORS.border,
          borderWidth: 1,
        };
      case 'gradient':
        return {
          // Gradient will be applied via LinearGradient
        };
      case 'assistant':
        return {
          backgroundColor: 'transparent', // Will use gradient
        };
      default:
        return {
          backgroundColor: COLORS.surface,
          borderColor: COLORS.border,
          borderWidth: 1,
        };
    }
  };

  const getBorderRadius = () => {
    switch (variant) {
      case 'assistant':
        return {
          borderTopLeftRadius: BORDER_RADIUS.lg,
          borderTopRightRadius: BORDER_RADIUS.lg,
          borderBottomLeftRadius: BORDER_RADIUS['2xl'],
          borderBottomRightRadius: BORDER_RADIUS['2xl'],
        };
      default:
        return {
          borderRadius: BORDER_RADIUS.lg,
        };
    }
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'gradient':
        return [COLORS.surfaceGradient.from, COLORS.surfaceGradient.to];
      case 'assistant':
        return [COLORS.assistantGradient.from, COLORS.assistantGradient.to];
      default:
        return null;
    }
  };

  const CardContent = () => (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );

  const gradientColors = getGradientColors();

  if (gradientColors) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[styles.container, getCardStyle(), getBorderRadius(), style]}
        {...props}
      >
        <LinearGradient
          colors={gradientColors}
          style={[styles.gradient, getBorderRadius()]}
        >
          <CardContent />
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        getCardStyle(),
        getBorderRadius(),
        style,
      ]}
      {...props}
    >
      <CardContent />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    ...SHADOWS.sm,
  },
  gradient: {
    flex: 1,
  },
  content: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
});

export default Card; 