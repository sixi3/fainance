import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BORDER_RADIUS } from '../../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const VoiceAssistant = ({ style }) => {
  // Animation values for each layer
  const wave1TranslateY = useRef(new Animated.Value(0)).current;
  const wave1Opacity = useRef(new Animated.Value(0.5)).current;
  
  const wave2TranslateY = useRef(new Animated.Value(0)).current;
  const wave2Opacity = useRef(new Animated.Value(0.4)).current;
  
  const wave3TranslateY = useRef(new Animated.Value(0)).current;
  const wave3Opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    // Wave 1 Animation - Fastest
    const wave1Animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(wave1TranslateY, {
            toValue: -SCREEN_HEIGHT * 0.25,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(wave1TranslateY, {
            toValue: SCREEN_HEIGHT * 0.25,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(wave1Opacity, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(wave1Opacity, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(wave1Opacity, {
            toValue: 0.5,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Wave 2 Animation - Medium speed
    const wave2Animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(wave2TranslateY, {
            toValue: SCREEN_HEIGHT * 0.3,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(wave2TranslateY, {
            toValue: -SCREEN_HEIGHT * 0.3,
            duration: 5000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(wave2Opacity, {
            toValue: 0.5,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(wave2Opacity, {
            toValue: 0.25,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(wave2Opacity, {
            toValue: 0.4,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Wave 3 Animation - Slowest
    const wave3Animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(wave3TranslateY, {
            toValue: -SCREEN_HEIGHT * 0.2,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(wave3TranslateY, {
            toValue: SCREEN_HEIGHT * 0.2,
            duration: 6000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(wave3Opacity, {
            toValue: 0.55,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(wave3Opacity, {
            toValue: 0.3,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(wave3Opacity, {
            toValue: 0.45,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Start all animations
    wave1Animation.start();
    wave2Animation.start();
    wave3Animation.start();

    // Cleanup
    return () => {
      wave1Animation.stop();
      wave2Animation.stop();
      wave3Animation.stop();
    };
  }, []);

  return (
    <View style={[styles.container, style]}>
      {/* Wave Layer 1 - Red to Green spectrum */}
      <Animated.View
        style={[
          styles.waveLayer,
          {
            transform: [{ translateY: wave1TranslateY }],
            opacity: wave1Opacity,
          },
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(255, 0, 128, 0)',    // Transparent hot pink
            'rgba(255, 0, 128, 0.3)',  // Semi-transparent hot pink
            'rgba(255, 0, 0, 0.4)',    // Semi-transparent red
            'rgba(255, 127, 0, 0.5)',  // Semi-transparent orange
            'rgba(255, 255, 0, 0.5)',  // Semi-transparent yellow
            'rgba(0, 255, 0, 0.4)',    // Semi-transparent green
            'rgba(0, 255, 255, 0.3)',  // Semi-transparent cyan
            'rgba(0, 255, 255, 0)',    // Transparent cyan
          ]}
          locations={[0, 0.1, 0.3, 0.4, 0.5, 0.6, 0.8, 1]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Wave Layer 2 - Green to Violet spectrum */}
      <Animated.View
        style={[
          styles.waveLayer,
          {
            transform: [{ translateY: wave2TranslateY }],
            opacity: wave2Opacity,
          },
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(0, 255, 0, 0)',      // Transparent green
            'rgba(0, 255, 0, 0.2)',    // Semi-transparent green
            'rgba(0, 255, 255, 0.3)',  // Semi-transparent cyan
            'rgba(0, 0, 255, 0.4)',    // Semi-transparent blue
            'rgba(75, 0, 130, 0.4)',   // Semi-transparent indigo
            'rgba(148, 0, 211, 0.3)',  // Semi-transparent violet
            'rgba(255, 0, 255, 0.2)',  // Semi-transparent magenta
            'rgba(255, 0, 255, 0)',    // Transparent magenta
          ]}
          locations={[0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Wave Layer 3 - Violet to Red spectrum */}
      <Animated.View
        style={[
          styles.waveLayer,
          {
            transform: [{ translateY: wave3TranslateY }],
            opacity: wave3Opacity,
          },
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(148, 0, 211, 0)',    // Transparent violet
            'rgba(148, 0, 211, 0.25)', // Semi-transparent violet
            'rgba(255, 0, 255, 0.35)', // Semi-transparent magenta
            'rgba(255, 0, 128, 0.4)',  // Semi-transparent hot pink
            'rgba(255, 0, 0, 0.4)',    // Semi-transparent red
            'rgba(255, 127, 0, 0.35)', // Semi-transparent orange
            'rgba(255, 255, 0, 0.25)', // Semi-transparent yellow
            'rgba(255, 255, 0, 0)',    // Transparent yellow
          ]}
          locations={[0, 0.1, 0.25, 0.4, 0.5, 0.65, 0.8, 1]}
          style={styles.gradient}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* Opacity Mask - Strong at bottom, fade to top */}
      <LinearGradient
        colors={[
          'rgba(0,0,0,0)',    // Transparent at top
          'rgba(0,0,0,0)',    // Still transparent
          'rgba(0,0,0,0.1)',  // Slight opacity
          'rgba(0,0,0,0.3)',  // More visible
          'rgba(0,0,0,0)',    // Full visibility at bottom
        ]}
        locations={[0, 0.3, 0.5, 0.7, 1]}
        style={styles.opacityMask}
        pointerEvents="none"
      />

      {/* Content placeholder - add your mic button and text here */}
      <View style={styles.contentContainer}>
        {/* Your voice assistant UI elements go here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: '#000', // Fallback color
  },
  waveLayer: {
    position: 'absolute',
    width: '100%',
    height: '150%', // Extend beyond container for smooth animation
    top: '-25%', // Start above container
  },
  gradient: {
    flex: 1,
  },
  opacityMask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50, // Adjust based on your needs
    zIndex: 10, // Ensure content is above gradients
  },
});

export default VoiceAssistant;