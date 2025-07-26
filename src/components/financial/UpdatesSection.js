import React, { useState, useRef, useCallback, useEffect, memo, useMemo } from 'react';
import { View, StyleSheet, Pressable, FlatList, Dimensions, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { ChevronRight, BotMessageSquare, ChevronLeft, Info } from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import Typography from '../common/Typography';
import Card from '../common/Card';
import { useHaptics } from '../../hooks/useHaptics';

// Memoized constants outside component to prevent recalculation
const { width: screenWidth } = Dimensions.get('window');
const EDGE_SPACING = 4; // 4px spacing from screen edges
const CARD_WIDTH = screenWidth - (EDGE_SPACING * 2); // Card width with edge spacing
const ITEM_WIDTH = CARD_WIDTH; // Total width per item (no margin needed)

// Group related constants
const SCROLL_CONFIG = {
  PILL_WIDTH: 50,
  AUTO_SCROLL_INTERVAL: 5000,
  OVERSCROLL_DEBOUNCE_MS: Platform.OS === 'ios' ? 300 : 500,
};

// Move AnimatedCard outside the main component
const AnimatedCard = memo(({ update, index, scrollX, haptics, onUpdatePress, renderSourceTag }) => {
  const cardAnimatedStyle = useAnimatedStyle(() => {
    const input = scrollX.value;
    const progress = (input - index * ITEM_WIDTH) / ITEM_WIDTH;
    const scale = 1 - Math.abs(progress) * 0.1; // Reduced scale effect, removed opacity

    return {
      transform: [{ scale }],
    };
  }, [index, scrollX]);

  return (
    <Animated.View style={[styles.updateItem, cardAnimatedStyle]}>
      <Pressable
        onPress={() => {
          haptics.impact.light();
          onUpdatePress?.(update);
        }}
        style={styles.cardPressable}
      >
        <Card variant="surface" contentStyle={{ paddingVertical: 0 }}>
          <View style={styles.updateContent}>
            <View style={styles.updateHeader}>
              <View style={styles.updateIconContainer}>
                <BotMessageSquare size={16} color={COLORS.textSecondary} strokeWidth={1.5} />
              </View>
              
              <View style={styles.updateTextContainer}>
                <Typography variant="body" color="textPrimary" weight="regular">
                  {update.message}
                </Typography>
                
                <View style={styles.sourcesContainer}>
                  {update.sources.slice(0, 2).map((source, idx) => 
                    renderSourceTag(source, idx)
                  )}
                  {update.sources.length > 2 && (
                    <View style={styles.sourceTag}>
                      <Typography variant="caption" color="textPrimary" weight="light">
                        +{update.sources.length - 2}
                      </Typography>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            <View style={styles.chevronContainer}>
              <ChevronRight size={12} color={COLORS.textPrimary} strokeWidth={2} />
            </View>
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
});

const UpdatesSection = ({ updates = [], onUpdatePress, onSourcePress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useSharedValue(0);
  const autoScrollTimerRef = useRef(null);
  const currentIndexRef = useRef(0);
  const haptics = useHaptics();
  const isManualScrollRef = useRef(false);

  // Add these refs inside your UpdatesSection component, after the existing refs
  const leftPillStateRef = useRef({ visible: false, hapticTriggered: false });
  const rightPillStateRef = useRef({ visible: false, hapticTriggered: false });

  const defaultUpdates = [
    {
      id: '1',
      message: 'Consider reallocating some of your IT stocks to banking.',
      sources: ['bloomberg.com', 'moneycontrol.com'],
      timestamp: '2024-01-15T10:28:00Z',
      type: 'investment_advice',
    },
    {
      id: '2',
      message: 'Your mutual fund portfolio has shown 12% growth this quarter.',
      sources: ['moneycontrol.com', 'economictimes.com'],
      timestamp: '2024-01-15T09:15:00Z',
      type: 'portfolio_update',
    },
    {
      id: '3',
      message: 'Market volatility expected due to upcoming RBI policy announcement.',
      sources: ['bloomberg.com', 'reuters.com', 'livemint.com'],
      timestamp: '2024-01-15T08:45:00Z',
      type: 'market_alert',
    },
  ];

  const displayUpdates = useMemo(() => 
    updates.length > 0 ? updates : defaultUpdates, 
    [updates]
  );

  // Memoize expensive calculations
  const maxOffset = useMemo(() => 
    (displayUpdates.length - 1) * ITEM_WIDTH, 
    [displayUpdates.length]
  );

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }
    
    autoScrollTimerRef.current = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % displayUpdates.length;
      currentIndexRef.current = nextIndex;
      
      // Mark as auto-scroll to prevent haptics
      isManualScrollRef.current = false;
      
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, SCROLL_CONFIG.AUTO_SCROLL_INTERVAL);
  }, [displayUpdates.length]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoScroll();
    return () => {
      stopAutoScroll();
    };
  }, []);

  const onScrollBeginDrag = useCallback(() => {
    stopAutoScroll();
    // Mark as manual scroll to enable haptics
    isManualScrollRef.current = true;
    // Reset both pill states
    leftPillStateRef.current = { visible: false, hapticTriggered: false };
    rightPillStateRef.current = { visible: false, hapticTriggered: false };
  }, [stopAutoScroll]);

  const onScrollEndDrag = useCallback(() => {
    setTimeout(() => {
      startAutoScroll();
    }, 2000);
  }, [startAutoScroll]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setActiveIndex(newIndex);
      currentIndexRef.current = newIndex;
    }
  }, []);

  // Add haptic feedback when scrolling to snap points (only for manual scroll)
  const onMomentumScrollEnd = useCallback(() => {
    if (isManualScrollRef.current) {
      haptics.selection();
    }
  }, [haptics]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  // Extract pill logic for better readability
  const checkPillHaptics = useCallback((offset) => {
    // Only trigger haptics for manual scroll
    if (!isManualScrollRef.current) return;

    // Left pill logic
    const leftShouldBeVisible = offset < -SCROLL_CONFIG.PILL_WIDTH;
    if (leftShouldBeVisible && !leftPillStateRef.current.visible) {
      leftPillStateRef.current.visible = true;
      if (!leftPillStateRef.current.hapticTriggered) {
        haptics.impact.light();
        leftPillStateRef.current.hapticTriggered = true;
      }
    } else if (!leftShouldBeVisible) {
      leftPillStateRef.current.visible = false;
      leftPillStateRef.current.hapticTriggered = false;
    }

    // Right pill logic
    const rightShouldBeVisible = offset > maxOffset + SCROLL_CONFIG.PILL_WIDTH;
    if (rightShouldBeVisible && !rightPillStateRef.current.visible) {
      rightPillStateRef.current.visible = true;
      if (!rightPillStateRef.current.hapticTriggered) {
        haptics.impact.light();
        rightPillStateRef.current.hapticTriggered = true;
      }
    } else if (!rightShouldBeVisible) {
      rightPillStateRef.current.visible = false;
      rightPillStateRef.current.hapticTriggered = false;
    }
  }, [maxOffset, haptics]);

  const onScroll = useCallback((event) => {
    const offset = event.nativeEvent.contentOffset.x;
    checkPillHaptics(offset);
    scrollX.value = offset;
  }, [scrollX, checkPillHaptics]);

  const renderSourceTag = useCallback((source, index) => (
    <Pressable
      key={index}
      style={styles.sourceTag}
      onPress={() => {
        haptics.impact.light();
        onSourcePress?.(source);
      }}
    >
      <Typography variant="caption" color="textPrimary" weight="light">
        {source}
      </Typography>
    </Pressable>
  ), [haptics, onSourcePress]);

  // Error boundary for scroll with fallback
  const scrollToIndex = useCallback((index) => {
    try {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    } catch (error) {
      // Fallback to scrollToOffset if index fails
      flatListRef.current?.scrollToOffset({
        offset: index * ITEM_WIDTH,
        animated: true,
      });
    }
  }, []);

  const renderUpdateItem = useCallback(({ item: update, index }) => (
    <AnimatedCard 
      update={update} 
      index={index} 
      scrollX={scrollX}
      haptics={haptics}
      onUpdatePress={onUpdatePress}
      renderSourceTag={renderSourceTag}
    />
  ), [scrollX, haptics, onUpdatePress, renderSourceTag]);

  const PaginationDot = memo(({ index }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const input = scrollX.value;
      const currentIndex = input / ITEM_WIDTH;
      const distance = Math.abs(currentIndex - index);
      
      // Calculate if this dot is the current one or the next one
      const isCurrentDot = Math.floor(currentIndex) === index;
      const isNextDot = Math.floor(currentIndex) + 1 === index;
      const progress = currentIndex - Math.floor(currentIndex); // 0 to 1 progress between dots
      
      let width = 4; // Default minimum width
      
      if (isCurrentDot) {
        // Current dot decreases in width as we scroll
        width = 32 - (progress * 28); // From 32 to 4
      } else if (isNextDot) {
        // Next dot increases in width as we scroll
        width = 4 + (progress * 28); // From 4 to 32
      } else {
        // Other dots maintain minimum width
        width = 4;
      }
      
      const opacity = Math.max(0.3, 1 - distance * 1.4); // Smooth from 1 to 0.3
      const scale = Math.max(0.8, 0.9 - distance * 0.2); // Smooth from 0.9 to 0.8

      return {
        width,
        opacity,
        transform: [{ scale }],
      };
    }, [index]);

    return (
      <Animated.View style={[styles.paginationDot, animatedStyle]} />
    );
  });

  // Edge indicator pills
  
  // Modified LeftEdgeIndicator component
  const LeftEdgeIndicator = memo(() => {
    const animatedStyle = useAnimatedStyle(() => {
      // Only show when scrolled past the pill width
      const opacity = interpolate(
        scrollX.value,
        [-SCROLL_CONFIG.PILL_WIDTH - 20, -SCROLL_CONFIG.PILL_WIDTH],
        [1, 0],
        Extrapolate.CLAMP
      );
      
      const translateX = interpolate(
        scrollX.value,
        [-SCROLL_CONFIG.PILL_WIDTH - 20, -SCROLL_CONFIG.PILL_WIDTH],
        [0, -20],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ translateX }],
      };
    });

    const handlePress = useCallback(() => {
      // Remove haptic from press, it now only happens on entrance
      scrollToIndex(0);
    }, [scrollToIndex]);

    return (
      <Animated.View style={[styles.edgeIndicator, styles.leftIndicator, animatedStyle]}>
        <Pressable
          onPress={handlePress}
          style={styles.edgePillPressable}
        >
          <View style={styles.edgePill}>
            <Typography variant="caption" color="primary" weight="regular">
              See All
            </Typography>
          </View>
        </Pressable>
      </Animated.View>
    );
  });

  // Modified RightEdgeIndicator component
  const RightEdgeIndicator = memo(() => {
    const animatedStyle = useAnimatedStyle(() => {
      // Only show when scrolled past the pill width
      const opacity = interpolate(
        scrollX.value,
        [maxOffset + SCROLL_CONFIG.PILL_WIDTH, maxOffset + SCROLL_CONFIG.PILL_WIDTH + 20],
        [0, 1],
        Extrapolate.CLAMP
      );
      
      const translateX = interpolate(
        scrollX.value,
        [maxOffset + SCROLL_CONFIG.PILL_WIDTH, maxOffset + SCROLL_CONFIG.PILL_WIDTH + 20],
        [20, 0],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ translateX }],
      };
    });

    const handlePress = useCallback(() => {
      // Remove haptic from press, it now only happens on entrance
      scrollToIndex(displayUpdates.length - 1);
    }, [scrollToIndex, displayUpdates.length]);

    return (
      <Animated.View style={[styles.edgeIndicator, styles.rightIndicator, animatedStyle]}>
        <Pressable
          onPress={handlePress}
          style={styles.edgePillPressable}
        >
          <View style={styles.edgePill}>
            <Typography variant="caption" color="primary" weight="regular">
              See All
            </Typography>
          </View>
        </Pressable>
      </Animated.View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={displayUpdates}
          renderItem={renderUpdateItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          snapToAlignment="start"
          decelerationRate={0.8}
          contentContainerStyle={styles.scrollContent}
          onScroll={onScroll}
          scrollEventThrottle={16}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          getItemLayout={(data, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
          onScrollBeginDrag={onScrollBeginDrag}
          onScrollEndDrag={onScrollEndDrag}
          onMomentumScrollEnd={onMomentumScrollEnd}
          removeClippedSubviews={true}
          maxToRenderPerBatch={2}
          windowSize={3}
          initialNumToRender={1}
          updateCellsBatchingPeriod={50}
          bounces={true}
          overScrollMode="always"
          pagingEnabled={false}
        />
        
        <LeftEdgeIndicator />
        <RightEdgeIndicator />
      </View>
      
      <View style={styles.paginationContainer}>
        {useMemo(() => 
          displayUpdates.map((_, index) => (
            <PaginationDot key={index} index={index} />
          )), 
          [displayUpdates.length]
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  carouselContainer: {
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: EDGE_SPACING,
  },
  updateItem: {
    width: CARD_WIDTH,
  },
  cardPressable: {
    width: '100%',
  },
  updateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: EDGE_SPACING,
  },
  updateHeader: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flex: 1,
  },
  updateIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateTextContainer: {
    flex: 1,
    gap: SPACING.sm,
  },
  sourcesContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  sourceTag: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 20,
  },
  chevronContainer: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    paddingHorizontal: EDGE_SPACING,
  },
  paginationDot: {
    height: 4,
    backgroundColor: COLORS.divider,
    borderRadius: 4,
  },
  edgeIndicator: {
    position: 'absolute',
    top: '50%',
    marginTop: -16, // Half of pill height
    zIndex: 10,
  },
  leftIndicator: {
    left: SPACING.md,
  },
  rightIndicator: {
    right: SPACING.md,
  },
  edgePillPressable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  edgePill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default UpdatesSection;