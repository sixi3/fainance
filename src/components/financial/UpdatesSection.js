import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable, FlatList, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate
} from 'react-native-reanimated';
import { MessageSquare, ChevronRight, BotMessageSquare } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Typography from '../common/Typography';
import Card from '../common/Card';
import { SPRING_CONFIG } from '../../utils/animations';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = screenWidth - (CARD_MARGIN * 2);
const ITEM_WIDTH = screenWidth; // Full screen width for each item

const UpdatesSection = ({ updates = [], onUpdatePress, onSourcePress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useSharedValue(0);

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

  const displayUpdates = updates.length > 0 ? updates : defaultUpdates;

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setActiveIndex(newIndex);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const onScroll = useCallback((event) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  }, [scrollX]);

  const renderSourceTag = (source, index) => (
    <Pressable
      key={index}
      style={styles.sourceTag}
      onPress={() => onSourcePress?.(source)}
    >
      <Typography variant="caption" color="textPrimary" weight="light">
        {source}
      </Typography>
    </Pressable>
  );

  const AnimatedCard = ({ update, index }) => {
    const cardScale = useSharedValue(1);

    const cardAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: cardScale.value },
        ],
      };
    });

    const handlePressIn = () => {
      cardScale.value = withSpring(0.98, SPRING_CONFIG.light);
    };

    const handlePressOut = () => {
      cardScale.value = withSpring(1, SPRING_CONFIG.light);
    };

    return (
      <Animated.View style={[styles.updateItem, cardAnimatedStyle]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => onUpdatePress?.(update)}
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
  };

  const renderUpdateItem = ({ item: update, index }) => (
    <AnimatedCard update={update} index={index} />
  );

  const PaginationDot = ({ index }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const input = scrollX.value;
      const inputRange = [
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
        (index + 1) * ITEM_WIDTH,
      ];

      const width = interpolate(
        input,
        inputRange,
        [8, 32, 8],
        'clamp'
      );

      const opacity = interpolate(
        input,
        inputRange,
        [0.3, 1, 0.3],
        'clamp'
      );

      const scale = interpolate(
        input,
        inputRange,
        [0.8, 0.9, 0.8],
        'clamp'
      );

      return {
        width,
        opacity,
        transform: [{ scale }],
      };
    });

    return (
      <Animated.View style={[styles.paginationDot, animatedStyle]} />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={displayUpdates}
        renderItem={renderUpdateItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="center"
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
      />
      
      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {displayUpdates.map((_, index) => (
          <PaginationDot key={index} index={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  updateItem: {
    width: ITEM_WIDTH,
    paddingHorizontal: CARD_MARGIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPressable: {
    width: CARD_WIDTH,
  },
  updateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
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
    marginTop: SPACING.xs,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  paginationDot: {
    height: 8,
    backgroundColor: COLORS.divider,
    borderRadius: 4,
  },
});

export default UpdatesSection; 