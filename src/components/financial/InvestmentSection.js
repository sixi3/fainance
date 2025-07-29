import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import Reanimated, { 
  useSharedValue, 
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Typography from '../common/Typography';
import Card from '../common/Card';
import { useHaptics } from '../../hooks/useHaptics';

const TAB_COUNT = 2;
const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.75; // 75% of screen width
const CARD_SPACING = SPACING.sm;

// Pill configuration
const PILL_CONFIG = {
  PILL_WIDTH: 50,
  OVERSCROLL_DEBOUNCE_MS: 300,
};

// Mock data for investment cards
const stockData = [
  { 
    id: '1', 
    name: 'Reliance Industries', 
    symbol: 'RELIANCE', 
    logo: '🏭', // Using emoji as placeholder for logo
    invested: 14760.3,
    current: 16928.3,
    change: 9.8,
    isPositive: true 
  },
  { 
    id: '2', 
    name: 'Tata Consultancy Services', 
    symbol: 'TCS', 
    logo: '💻',
    invested: 25430.5,
    current: 24567.2,
    change: -3.4,
    isPositive: false 
  },
  { 
    id: '3', 
    name: 'HDFC Bank', 
    symbol: 'HDFCBANK', 
    logo: '🏦',
    invested: 18900.0,
    current: 21345.7,
    change: 12.9,
    isPositive: true 
  },
  { 
    id: '4', 
    name: 'Infosys', 
    symbol: 'INFY', 
    logo: '🖥️',
    invested: 12500.0,
    current: 13100.0,
    change: 4.8,
    isPositive: true 
  },
  { 
    id: '5', 
    name: 'ICICI Bank', 
    symbol: 'ICICIBANK', 
    logo: '🏛️',
    invested: 9870.0,
    current: 9450.5,
    change: -4.3,
    isPositive: false 
  },
];

const mutualFundData = [
  { 
    id: '1', 
    name: 'Axis Bluechip Fund', 
    category: 'Large Cap', 
    logo: '📊',
    invested: 50000.0,
    current: 58900.0,
    change: 17.8,
    isPositive: true 
  },
  { 
    id: '2', 
    name: 'HDFC Mid-Cap Opportunities', 
    category: 'Mid Cap', 
    logo: '📈',
    invested: 35000.0,
    current: 42300.0,
    change: 20.9,
    isPositive: true 
  },
  { 
    id: '3', 
    name: 'SBI Small Cap Fund', 
    category: 'Small Cap', 
    logo: '📉',
    invested: 25000.0,
    current: 24100.0,
    change: -3.6,
    isPositive: false 
  },
  { 
    id: '4', 
    name: 'ICICI Prudential Equity & Debt', 
    category: 'Hybrid', 
    logo: '⚖️',
    invested: 40000.0,
    current: 43600.0,
    change: 9.0,
    isPositive: true 
  },
  { 
    id: '5', 
    name: 'Kotak Emerging Equity', 
    category: 'Mid Cap', 
    logo: '🚀',
    invested: 30000.0,
    current: 34500.0,
    change: 15.0,
    isPositive: true 
  },
];

// Utility function for currency formatting
const formatCurrency = (amount) => {
  return `${amount.toLocaleString('en-IN', { maximumFractionDigits: 1 })}`;
};

const InvestmentCard = ({ item, type }) => {
  return (
    <View style={styles.cardWrapper}>
      <Card variant="surface" style={styles.investmentItemCard}>
        <View style={styles.darkCardContent}>
          {/* Header with logo, name and percentage badge */}
          <View style={styles.darkCardHeader}>
            <View style={styles.logoAndName}>
              <View style={styles.logoContainer}>
                <Typography variant="bodySmall" color="textPrimary">
                  {item.logo}
                </Typography>
              </View>
              <Typography 
                variant="bodySmall" 
                color="textPrimary" 
                weight="medium" 
                numberOfLines={1}
                style={styles.companyName}
              >
                {item.name}
              </Typography>
            </View>
            
            <View style={[
              styles.percentageBadge,
              { backgroundColor: item.isPositive ? COLORS.success : COLORS.error }
            ]}>
              <Typography variant="caption" color="textPrimary" weight="bold">
                {item.isPositive ? '▲' : '▼'} {item.isPositive ? '+' : ''}{item.change}%
              </Typography>
            </View>
          </View>
          
          {/* Investment values */}
          <View style={styles.valuesContainer}>
            <View style={styles.valueColumn}>
              <Typography variant="caption" color="textSecondary" weight="regular">
                Invested
              </Typography>
              <Typography variant="body" color="textPrimary" weight="semibold">
                {formatCurrency(item.invested)}
              </Typography>
            </View>
            
            <View style={styles.valueColumn}>
              <Typography variant="caption" color="textSecondary" weight="regular">
                Current
              </Typography>
              <Typography variant="body" color="textPrimary" weight="semibold">
                {formatCurrency(item.current)}
              </Typography>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

const InvestmentSection = () => {
  const [activeTab, setActiveTab] = useState('stocks');
  const tabAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollViewRef = useRef(null);
  
  // Pill animation state
  const scrollX = useSharedValue(0);
  const haptics = useHaptics();
  
  // Pill state refs
  const rightPillStateRef = useRef({ visible: false, hapticTriggered: false, readyToSwitch: false });
  const leftPillStateRef = useRef({ visible: false, hapticTriggered: false, readyToSwitch: false });
  
  // Card list entrance animation
  const cardListAnim = useRef(new Animated.Value(0)).current;
  
  // Net value animations
  const valueAnim = useRef(new Animated.Value(0)).current;
  const percentageAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(tabAnim, {
      toValue: activeTab === 'stocks' ? 0 : 1,
      useNativeDriver: true,
      damping: 25,
      stiffness: 250,
      mass: 1,
    }).start();
  }, [activeTab]);

  const renderInvestmentCard = useCallback((item) => (
    <InvestmentCard key={item.id} item={item} type={activeTab} />
  ), [activeTab]);

  const currentData = activeTab === 'stocks' ? stockData : mutualFundData;

  // Calculate net values for current tab
  const netValues = useMemo(() => {
    const totalInvested = currentData.reduce((sum, item) => sum + item.invested, 0);
    const totalCurrent = currentData.reduce((sum, item) => sum + item.current, 0);
    const totalChange = ((totalCurrent - totalInvested) / totalInvested) * 100;
    const isPositive = totalChange >= 0;
    
    return {
      invested: totalInvested,
      current: totalCurrent,
      change: Math.abs(totalChange),
      isPositive
    };
  }, [currentData]);

  // Calculate max scroll offset for current data
  const maxScrollOffset = useMemo(() => {
    const totalWidth = currentData.length * (CARD_WIDTH + CARD_SPACING) - CARD_SPACING;
    const containerWidth = screenWidth - (SPACING.md * 2); // Account for card padding
    return Math.max(0, totalWidth - containerWidth);
  }, [currentData.length]);

  // Scroll event handler
  const onScroll = useCallback((event) => {
    const offset = event.nativeEvent.contentOffset.x;
    scrollX.value = offset;
    
    // Check pill visibility for stocks (right edge)
    if (activeTab === 'stocks') {
      const rightThreshold = maxScrollOffset + PILL_CONFIG.PILL_WIDTH;
      const rightShouldBeVisible = offset > rightThreshold;
      
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
      
      // Set readyToSwitch flag when past threshold
      if (offset > rightThreshold + 20) { // Add small buffer for reliability
        rightPillStateRef.current.readyToSwitch = true;
      } else {
        rightPillStateRef.current.readyToSwitch = false;
      }
    }
    
    // Check pill visibility for mutual funds (left edge)
    if (activeTab === 'mutualFunds') {
      const leftShouldBeVisible = offset < -PILL_CONFIG.PILL_WIDTH;
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
      
      // Set readyToSwitch flag when past threshold
      if (offset < -PILL_CONFIG.PILL_WIDTH - 20) { // Add small buffer for reliability
        leftPillStateRef.current.readyToSwitch = true;
      } else {
        leftPillStateRef.current.readyToSwitch = false;
      }
    }
  }, [activeTab, maxScrollOffset, haptics]);

  // Reset pill states when tab changes
  useEffect(() => {
    rightPillStateRef.current = { visible: false, hapticTriggered: false, readyToSwitch: false };
    leftPillStateRef.current = { visible: false, hapticTriggered: false, readyToSwitch: false };
    scrollX.value = 0;
  }, [activeTab]);

  // Initial animation on component mount
  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      // Animate in with spring animation on first load
      Animated.spring(cardListAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      }).start((finished) => {
        if (finished) {
          console.log('Card list animation completed');
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array for initial load only

  // Card list entrance animation when tab changes
  useEffect(() => {
    // Reset animation to start position
    cardListAnim.setValue(0);
    
    // Animate in with spring animation
    Animated.spring(cardListAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
      mass: 0.8,
    }).start();
  }, [activeTab]);

  // Initial net value animations on component mount
  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      // Animate value with spring animation
      Animated.spring(valueAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 25,
        stiffness: 350,
        mass: 0.8,
      }).start((finished) => {
        if (finished) {
          console.log('Value animation completed');
        }
      });
      
      // Animate percentage with slight delay
      Animated.spring(percentageAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 25,
        stiffness: 350,
        mass: 0.8,
        delay: 100,
      }).start((finished) => {
        if (finished) {
          console.log('Percentage animation completed');
        }
      });
    }, 150); // Slightly longer delay for net values

    return () => clearTimeout(timer);
  }, []); // Empty dependency array for initial load only

  // Net value animations when tab changes
  useEffect(() => {
    // Reset animations to start position
    valueAnim.setValue(0);
    percentageAnim.setValue(0);
    
    // Animate value with spring animation
    Animated.spring(valueAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 25,
      stiffness: 350,
      mass: 0.8,
    }).start();
    
    // Animate percentage with slight delay
    Animated.spring(percentageAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 25,
      stiffness: 350,
      mass: 0.8,
      delay: 100,
    }).start();
  }, [activeTab, netValues]);

  // --- On scroll release, switch tab if ready ---
  const onScrollEndDrag = useCallback(() => {
    if (activeTab === 'stocks' && rightPillStateRef.current.readyToSwitch) {
      haptics.impact.light();
      setActiveTab('mutualFunds');
      rightPillStateRef.current.readyToSwitch = false;
    }
    if (activeTab === 'mutualFunds' && leftPillStateRef.current.readyToSwitch) {
      haptics.impact.light();
      setActiveTab('stocks');
      leftPillStateRef.current.readyToSwitch = false;
    }
  }, [activeTab, haptics]);

  // Right Edge Indicator for Stocks
  const RightEdgeIndicator = memo(() => {
    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollX.value,
        [maxScrollOffset + PILL_CONFIG.PILL_WIDTH, maxScrollOffset + PILL_CONFIG.PILL_WIDTH + 20],
        [0, 1],
        Extrapolate.CLAMP
      );
      
      const translateX = interpolate(
        scrollX.value,
        [maxScrollOffset + PILL_CONFIG.PILL_WIDTH, maxScrollOffset + PILL_CONFIG.PILL_WIDTH + 20],
        [20, 0],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ translateX }],
      };
    });

    const handlePress = useCallback(() => {
      haptics.impact.light();
      // Scroll to the end of stocks
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [haptics]);

    if (activeTab !== 'stocks') return null;

    return (
      <Reanimated.View style={[styles.edgeIndicator, styles.rightIndicator, animatedStyle]}>
        <Pressable
          onPress={handlePress}
          style={styles.edgePillPressable}
        >
          <View style={styles.edgePill}>
            <Typography variant="caption" color="primary" weight="regular">
              Next
            </Typography>
          </View>
        </Pressable>
      </Reanimated.View>
    );
  });

  // Left Edge Indicator for Mutual Funds
  const LeftEdgeIndicator = memo(() => {
    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollX.value,
        [-PILL_CONFIG.PILL_WIDTH - 20, -PILL_CONFIG.PILL_WIDTH],
        [1, 0],
        Extrapolate.CLAMP
      );
      
      const translateX = interpolate(
        scrollX.value,
        [-PILL_CONFIG.PILL_WIDTH - 20, -PILL_CONFIG.PILL_WIDTH],
        [0, -20],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ translateX }],
      };
    });

    const handlePress = useCallback(() => {
      haptics.impact.light();
      // Scroll to the beginning of mutual funds
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    }, [haptics]);

    if (activeTab !== 'mutualFunds') return null;

    return (
      <Reanimated.View style={[styles.edgeIndicator, styles.leftIndicator, animatedStyle]}>
        <Pressable
          onPress={handlePress}
          style={styles.edgePillPressable}
        >
          <View style={styles.edgePill}>
            <Typography variant="caption" color="primary" weight="regular">
              Previous
            </Typography>
          </View>
        </Pressable>
      </Reanimated.View>
    );
  });

  return (
    <Card variant="gradient" style={styles.investmentCard}>
      <View style={styles.investmentContent}>
        {/* Header */}
        <View style={styles.investmentHeader}>
          <View style={styles.investmentLabels}>
            <Typography variant="caption" color="textSecondary" weight="medium" style={{ marginBottom: -4 }}>
              Your
            </Typography>
            <Typography variant="h3" color="textPrimary" weight="bold">
              Investments
            </Typography>
          </View>
          <TouchableOpacity style={styles.chevronButton} activeOpacity={0.7}>
            <ChevronRight size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Tabs with animated sliding indicator */}
        <View
          style={styles.tabContainer}
          onLayout={e => {
            const width = e.nativeEvent.layout.width;
            setContainerWidth(width);
          }}
        >
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                width: containerWidth > 0 ? (containerWidth - 4) / TAB_COUNT : 0,
                transform: [{
                  translateX: tabAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, containerWidth > 0 ? (containerWidth - 4) / TAB_COUNT : 0],
                  })
                }],
                backgroundColor: activeTab === 'stocks' ? COLORS.stocks : COLORS.mutualFunds,
              },
            ]}
            pointerEvents="none"
          />
          <TouchableOpacity
            style={styles.tabTouchable}
            onPress={() => {
              haptics.impact.light();
              setActiveTab('stocks');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Typography
                variant="body"
                color={activeTab === 'stocks' ? 'textPrimary' : '#f4f4f4'}
                weight={activeTab === 'stocks' ? 'bold' : 'light'}
              >
                Stock Holdings
              </Typography>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabTouchable}
            onPress={() => {
              haptics.impact.light();
              setActiveTab('mutualFunds');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Typography
                variant="body"
                color={activeTab === 'mutualFunds' ? 'textPrimary' : '#f4f4f4'}
                weight={activeTab === 'mutualFunds' ? 'bold' : 'light'}
              >
                Mutual Funds
              </Typography>
            </View>
          </TouchableOpacity>
        </View>

        {/* Net Values Section */}
        <View style={styles.netValuesContainer}>
          <View style={styles.netValuesContent}>
            <Typography variant="bodySmall" color="textSecondary" weight="medium">
              Total Value
            </Typography>
            <View style={styles.valueAndBadgeContainer}>
              <Animated.View 
                style={[
                  styles.balanceText,
                  {
                    opacity: valueAnim,
                    transform: [{
                      translateY: valueAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      })
                    }]
                  }
                ]}
              >
                <Typography variant="currency" color="textSecondary" size={14}>
                  ₹
                </Typography>
                <Typography variant="h3" color="textPrimary" weight="bold">
                  {formatCurrency(netValues.current)}
                </Typography>
              </Animated.View>
              <Animated.View
                style={{
                  opacity: percentageAnim,
                  transform: [{
                    translateY: percentageAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    })
                  }]
                }}
              >
                <Typography
                  variant="body"
                  style={{
                    color: netValues.isPositive ? COLORS.success : COLORS.error,
                    marginLeft: SPACING.sm,
                    fontWeight: 'bold',
                  }}
                >
                  {netValues.isPositive ? '+' : '-'}{netValues.change.toFixed(1)}% in last 7 days
                </Typography>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Horizontal scrolling cards */}
        <Animated.View 
          style={[
            styles.cardsContainer,
            {
              opacity: cardListAnim,
              transform: [{
                translateY: cardListAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }
          ]}
        >
          <View style={styles.scrollContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsScrollContent}
              snapToInterval={CARD_WIDTH + CARD_SPACING}
              decelerationRate="fast"
              bounces={true}
              scrollEventThrottle={16}
              onScroll={onScroll}
              onScrollEndDrag={onScrollEndDrag}
            >
              {currentData.map(renderInvestmentCard)}
            </ScrollView>
            
            <RightEdgeIndicator />
            <LeftEdgeIndicator />
          </View>
        </Animated.View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  investmentCard: {
    marginHorizontal: SPACING.sm,
    overflow: 'visible', // Allow content to extend beyond card bounds
  },
  investmentContent: {
    gap: SPACING.sm,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  investmentLabels: {
    alignItems: 'flex-start',
  },
  chevronButton: {
    width: 29,
    height: 29,
    borderRadius: 14.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 2,
    position: 'relative',
    marginBottom: SPACING.xs,
    overflow: 'hidden',
  },
  tabTouchable: {
    flex: 1,
    zIndex: 1,
  },
  tabContent: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIndicator: {
    position: 'absolute',
    top: 2,
    left: 2,
    bottom: 2,
    borderRadius: BORDER_RADIUS.sm,
    zIndex: 0,
    // Subtle elevation/shadow
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
  },
  cardsContainer: {
    marginHorizontal: -SPACING.md, // Negative margin to offset the card padding
  },
  scrollContainer: {
    position: 'relative',
  },
  cardsScrollContent: {
    paddingHorizontal: SPACING.md, // Add padding to the scroll content
    paddingRight: SPACING.md,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
  },
  investmentItemCard: {
    width: '100%',
    backgroundColor: COLORS.surface, // Dark background to match the design
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.xs,
  },
  darkCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoAndName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  logoContainer: {
    width: 24,
    height: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyName: {
    flex: 1,
    fontSize: 16,
  },
  percentageBadge: {
    borderRadius: 20,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    minWidth: 40,
    alignItems: 'center',
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  valueColumn: {
    gap: SPACING.xxs,
    marginRight: SPACING['2xl'],
  },
  // Pill styles
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
  netValuesContainer: {
    paddingHorizontal: SPACING.xs,
  },
  netValuesContent: {
    alignItems: 'flex-start',
  },
  valueAndBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 1,
    marginRight: SPACING.sm,
  },
  netPercentageBadge: {
    borderRadius: 20,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    minWidth: 50,
    alignItems: 'center',
  },
});

export default InvestmentSection;