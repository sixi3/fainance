import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import Reanimated, { 
  useSharedValue, 
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  runOnJS,
  withSpring,
  withTiming,
  useAnimatedScrollHandler,
  SharedValue,
  withDelay,
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Typography from '../common/Typography';
import Card from '../common/Card';
import { useHaptics } from '../../hooks/useHaptics';
import DistributionProgressBar from './DistributionProgressBar';

// Import company logos
const axisLogo = require('../../../assets/axis.png');
const hdfcLogo = require('../../../assets/hdfc.png');
const iciciLogo = require('../../../assets/icici.png');
const infosysLogo = require('../../../assets/infosys.png');
const kotakLogo = require('../../../assets/kotak.png');
const relianceLogo = require('../../../assets/reliance.png');
const sbiLogo = require('../../../assets/sbi.png');
const tcsLogo = require('../../../assets/tcs.png');

const TAB_COUNT = 2;
const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.75;
const CARD_SPACING = SPACING.sm;
const PILL_WIDTH = 50;
const OVERSCROLL_THRESHOLD = 20;

// Move data outside component to prevent recreation
const stockData = [
  { 
    id: '1', 
    name: 'Reliance Industries', 
    symbol: 'RELIANCE', 
    logo: relianceLogo,
    invested: 14760.3,
    current: 16928.3,
    change: 9.8,
    isPositive: true 
  },
  { 
    id: '2', 
    name: 'Tata Consultancy Services', 
    symbol: 'TCS', 
    logo: tcsLogo,
    invested: 25430.5,
    current: 24567.2,
    change: -3.4,
    isPositive: false 
  },
  { 
    id: '3', 
    name: 'HDFC Bank', 
    symbol: 'HDFCBANK', 
    logo: hdfcLogo,
    invested: 18900.0,
    current: 21345.7,
    change: 12.9,
    isPositive: true 
  },
  { 
    id: '4', 
    name: 'Infosys', 
    symbol: 'INFY', 
    logo: infosysLogo,
    invested: 12500.0,
    current: 13100.0,
    change: 4.8,
    isPositive: true 
  },
  { 
    id: '5', 
    name: 'ICICI Bank', 
    symbol: 'ICICIBANK', 
    logo: iciciLogo,
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
    logo: axisLogo,
    invested: 50000.0,
    current: 58900.0,
    change: 17.8,
    isPositive: true 
  },
  { 
    id: '2', 
    name: 'HDFC Mid-Cap Opportunities', 
    category: 'Mid Cap', 
    logo: hdfcLogo,
    invested: 35000.0,
    current: 42300.0,
    change: 20.9,
    isPositive: true 
  },
  { 
    id: '3', 
    name: 'SBI Small Cap Fund', 
    category: 'Small Cap', 
    logo: sbiLogo,
    invested: 25000.0,
    current: 24100.0,
    change: -3.6,
    isPositive: false 
  },
  { 
    id: '4', 
    name: 'ICICI Prudential Equity & Debt', 
    category: 'Hybrid', 
    logo: iciciLogo,
    invested: 40000.0,
    current: 43600.0,
    change: 9.0,
    isPositive: true 
  },
  { 
    id: '5', 
    name: 'Kotak Emerging Equity', 
    category: 'Mid Cap', 
    logo: kotakLogo,
    invested: 30000.0,
    current: 34500.0,
    change: 15.0,
    isPositive: true 
  },
];

// Memoized utility function
const formatCurrency = (amount) => {
  return `${amount.toLocaleString('en-IN', { maximumFractionDigits: 1 })}`;
};

// Extract InvestmentCard as a proper memoized component
const InvestmentCard = memo(({ item, type }) => {
  const badgeStyle = useMemo(() => [
    styles.percentageBadge,
    { backgroundColor: item.isPositive ? COLORS.success : COLORS.error }
  ], [item.isPositive]);

  return (
    <View style={styles.cardWrapper}>
      <Card variant="surface" style={styles.investmentItemCard}>
        <View style={styles.darkCardContent}>
          <View style={styles.darkCardHeader}>
            <View style={styles.logoAndName}>
              <View style={styles.logoContainer}>
                {typeof item.logo === 'string' ? (
                  <Typography variant="bodySmall" color="textPrimary">
                    {item.logo}
                  </Typography>
                ) : (
                  <Image 
                    source={item.logo} 
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                )}
              </View>
              <Typography 
                variant="h5" 
                color="textPrimary" 
                weight="semibold" 
                numberOfLines={1}
                style={styles.companyName}
              >
                {item.name}
              </Typography>
            </View>
            
            <View style={badgeStyle}>
              <Typography variant="caption" color="textPrimary" weight="bold">
                {item.isPositive ? '▲' : '▼'} {item.isPositive ? '+' : ''}{item.change}%
              </Typography>
            </View>
          </View>
          
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
});

InvestmentCard.displayName = 'InvestmentCard';

// Extract edge indicators
const EdgeIndicator = memo(({ 
  position, 
  scrollX, 
  maxScrollOffset, 
  onPress, 
  visible,
  label 
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    if (position === 'right') {
      const opacity = interpolate(
        scrollX.value,
        [maxScrollOffset + PILL_WIDTH, maxScrollOffset + PILL_WIDTH + 20],
        [0, 1],
        Extrapolate.CLAMP
      );
      
      const translateX = interpolate(
        scrollX.value,
        [maxScrollOffset + PILL_WIDTH, maxScrollOffset + PILL_WIDTH + 20],
        [20, 0],
        Extrapolate.CLAMP
      );

      return { opacity, transform: [{ translateX }] };
    } else {
      const opacity = interpolate(
        scrollX.value,
        [-PILL_WIDTH - 20, -PILL_WIDTH],
        [1, 0],
        Extrapolate.CLAMP
      );
      
      const translateX = interpolate(
        scrollX.value,
        [-PILL_WIDTH - 20, -PILL_WIDTH],
        [0, -20],
        Extrapolate.CLAMP
      );

      return { opacity, transform: [{ translateX }] };
    }
  });

  if (!visible) return null;

  return (
    <Reanimated.View 
      style={[
        styles.edgeIndicator, 
        position === 'right' ? styles.rightIndicator : styles.leftIndicator,
        animatedStyle
      ]}
    >
      <Pressable onPress={onPress} style={styles.edgePillPressable}>
        <View style={styles.edgePill}>
          <Typography variant="caption" color="primary" weight="regular">
            {label}
          </Typography>
        </View>
      </Pressable>
    </Reanimated.View>
  );
});

EdgeIndicator.displayName = 'EdgeIndicator';

const InvestmentSection = () => {
  const [activeTab, setActiveTab] = useState('stocks');
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollViewRef = useRef(null);
  
  // Reanimated values
  const scrollX = useSharedValue(0);
  const tabAnimation = useSharedValue(0);
  const cardListOpacity = useSharedValue(0); // Start at 0 for fade in
  const cardListTranslateY = useSharedValue(20); // Start at 20 for slide up
  const valueOpacity = useSharedValue(0); // Start at 0 for fade in
  const valueTranslateY = useSharedValue(20); // Start at 20 for slide up
  const percentageOpacity = useSharedValue(0); // Start at 0 for fade in
  const percentageTranslateY = useSharedValue(20); // Start at 20 for slide up
  
  const haptics = useHaptics();
  
  // Memoized data selection
  const currentData = useMemo(
    () => activeTab === 'stocks' ? stockData : mutualFundData,
    [activeTab]
  );

  // Memoized calculations
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

  const distributionPercentages = useMemo(() => {
    const totalStockValue = stockData.reduce((sum, item) => sum + item.current, 0);
    const totalMutualFundValue = mutualFundData.reduce((sum, item) => sum + item.current, 0);
    const totalValue = totalStockValue + totalMutualFundValue;
    
    if (totalValue === 0) {
      return { stockPercentage: 30, mutualFundPercentage: 70 };
    }
    
    const stockPercentage = Math.round((totalStockValue / totalValue) * 100);
    const mutualFundPercentage = 100 - stockPercentage;
    
    return { stockPercentage, mutualFundPercentage };
  }, []); // Static data, no dependencies

  const maxScrollOffset = useMemo(() => {
    const totalWidth = currentData.length * (CARD_WIDTH + CARD_SPACING) - CARD_SPACING;
    const containerWidth = screenWidth - (SPACING.md * 2);
    return Math.max(0, totalWidth - containerWidth);
  }, [currentData.length]);

  // Animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Tab change handler
  const handleTabChange = useCallback((newTab) => {
    'worklet';
    runOnJS(haptics.impact.light)();
    runOnJS(setActiveTab)(newTab);
  }, [haptics]);

  // Edge indicator handlers
  const handleRightPress = useCallback(() => {
    haptics.impact.light();
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [haptics]);

  const handleLeftPress = useCallback(() => {
    haptics.impact.light();
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  }, [haptics]);

  // Scroll end handler
  const handleScrollEndDrag = useCallback((event) => {
    const offset = event.nativeEvent.contentOffset.x;
    
    if (activeTab === 'stocks' && offset > maxScrollOffset + PILL_WIDTH + OVERSCROLL_THRESHOLD) {
      handleTabChange('mutualFunds');
    } else if (activeTab === 'mutualFunds' && offset < -PILL_WIDTH - OVERSCROLL_THRESHOLD) {
      handleTabChange('stocks');
    }
  }, [activeTab, maxScrollOffset, handleTabChange]);

  // Animated styles
  const tabIndicatorStyle = useAnimatedStyle(() => ({
    width: containerWidth > 0 ? (containerWidth - 4) / TAB_COUNT : 0,
    transform: [{
      translateX: interpolate(
        tabAnimation.value,
        [0, 1],
        [0, containerWidth > 0 ? (containerWidth - 4) / TAB_COUNT : 0]
      )
    }],
    backgroundColor: activeTab === 'stocks' ? COLORS.stocks : COLORS.mutualFunds,
  }));

  const cardListStyle = useAnimatedStyle(() => ({
    opacity: cardListOpacity.value,
    transform: [{ translateY: cardListTranslateY.value }]
  }));

  const valueStyle = useAnimatedStyle(() => ({
    opacity: valueOpacity.value,
    transform: [{ translateY: valueTranslateY.value }]
  }));

  const percentageStyle = useAnimatedStyle(() => ({
    opacity: percentageOpacity.value,
    transform: [{ translateY: percentageTranslateY.value }]
  }));

  // Tab animation effect
  useEffect(() => {
    tabAnimation.value = withSpring(activeTab === 'stocks' ? 0 : 1, {
      damping: 25,
      stiffness: 250,
      mass: 1,
    });
  }, [activeTab]);

  // Track if component has mounted
  const hasMountedRef = useRef(false);
  
  // Initial mount animation
  useEffect(() => {
    // Initial animation on component mount with staggered timing
    const timer = setTimeout(() => {
      // Net values animate first
      valueOpacity.value = withSpring(1, { 
        damping: 25, 
        stiffness: 350, 
        mass: 0.8 
      });
      valueTranslateY.value = withSpring(0, { 
        damping: 25, 
        stiffness: 350, 
        mass: 0.8 
      });
      
      // Percentage badge with slight delay
      percentageOpacity.value = withDelay(100, 
        withSpring(1, { 
          damping: 25, 
          stiffness: 350, 
          mass: 0.8 
        })
      );
      percentageTranslateY.value = withDelay(100, 
        withSpring(0, { 
          damping: 25, 
          stiffness: 350, 
          mass: 0.8 
        })
      );
      
      // Card list animates last with longer delay
      cardListOpacity.value = withDelay(150, 
        withSpring(1, { 
          damping: 20, 
          stiffness: 300, 
          mass: 0.8 
        })
      );
      cardListTranslateY.value = withDelay(150, 
        withSpring(0, { 
          damping: 20, 
          stiffness: 300, 
          mass: 0.8 
        })
      );
      
      hasMountedRef.current = true;
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Tab change animations
  useEffect(() => {
    // Skip animation on initial mount
    if (!hasMountedRef.current) return;
    
    // Reset scroll
    scrollX.value = 0;
    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
    
    // Quick fade out
    cardListOpacity.value = withTiming(0, { duration: 150 });
    valueOpacity.value = withTiming(0, { duration: 150 });
    percentageOpacity.value = withTiming(0, { duration: 150 });
    
    // Then animate in with spring after fade out completes
    setTimeout(() => {
      // Reset positions
      cardListTranslateY.value = 20;
      valueTranslateY.value = 20;
      percentageTranslateY.value = 20;
      
      // Animate net values first
      valueOpacity.value = withSpring(1, { 
        damping: 25, 
        stiffness: 350, 
        mass: 0.8 
      });
      valueTranslateY.value = withSpring(0, { 
        damping: 25, 
        stiffness: 350, 
        mass: 0.8 
      });
      
      // Percentage with slight delay
      percentageOpacity.value = withDelay(50, 
        withSpring(1, { 
          damping: 25, 
          stiffness: 350, 
          mass: 0.8 
        })
      );
      percentageTranslateY.value = withDelay(50, 
        withSpring(0, { 
          damping: 25, 
          stiffness: 350, 
          mass: 0.8 
        })
      );
      
      // Card list last
      cardListOpacity.value = withDelay(100, 
        withSpring(1, { 
          damping: 20, 
          stiffness: 300, 
          mass: 0.8 
        })
      );
      cardListTranslateY.value = withDelay(100, 
        withSpring(0, { 
          damping: 20, 
          stiffness: 300, 
          mass: 0.8 
        })
      );
    }, 150);
  }, [activeTab]);

  const renderItem = useCallback((item) => (
    <InvestmentCard key={item.id} item={item} type={activeTab} />
  ), [activeTab]);

  return (
    <Card variant="gradient" style={styles.investmentCard}>
      <View style={styles.investmentContent}>
        {/* Header */}
        <View style={styles.investmentHeader}>
          <View style={styles.investmentLabels}>
            <Typography variant="caption" color="textSecondary" weight="medium" style={styles.headerCaption}>
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

        {/* Tabs */}
        <View style={styles.tabContainer} onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
          <Reanimated.View style={[styles.tabIndicator, tabIndicatorStyle]} pointerEvents="none" />
          
          <TouchableOpacity
            style={styles.tabTouchable}
            onPress={() => handleTabChange('stocks')}
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
            onPress={() => handleTabChange('mutualFunds')}
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

        {/* Distribution Progress Bar */}
        <View style={styles.distributionContainer}>
          <DistributionProgressBar
            stockPercentage={distributionPercentages.stockPercentage}
            mutualFundPercentage={distributionPercentages.mutualFundPercentage}
            activeTab={activeTab}
          />
        </View>

        {/* Net Values */}
        <View style={styles.netValuesContainer}>
          <View style={styles.netValuesContent}>
            <Typography variant="bodySmall" color="textSecondary" weight="medium">
              Total Value
            </Typography>
            <View style={styles.valueAndBadgeContainer}>
              <Reanimated.View style={[styles.balanceText, valueStyle]}>
                <Typography variant="currency" color="textSecondary" size={14}>
                  ₹
                </Typography>
                <Typography variant="h3" color="textPrimary" weight="bold">
                  {formatCurrency(netValues.current)}
                </Typography>
              </Reanimated.View>
              <Reanimated.View style={percentageStyle}>
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
              </Reanimated.View>
            </View>
          </View>
        </View>

        {/* Cards List */}
        <Reanimated.View style={[styles.cardsContainer, cardListStyle]}>
          <View style={styles.scrollContainer}>
            <Reanimated.ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsScrollContent}
              snapToInterval={CARD_WIDTH + CARD_SPACING}
              decelerationRate="fast"
              bounces={true}
              scrollEventThrottle={16}
              onScroll={scrollHandler}
              onScrollEndDrag={handleScrollEndDrag}
            >
              {currentData.map(renderItem)}
            </Reanimated.ScrollView>
            
            <EdgeIndicator 
              position="right"
              scrollX={scrollX}
              maxScrollOffset={maxScrollOffset}
              onPress={handleRightPress}
              visible={activeTab === 'stocks'}
              label="Next"
            />
            
            <EdgeIndicator 
              position="left"
              scrollX={scrollX}
              maxScrollOffset={maxScrollOffset}
              onPress={handleLeftPress}
              visible={activeTab === 'mutualFunds'}
              label="Previous"
            />
          </View>
        </Reanimated.View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  investmentCard: {
    marginHorizontal: SPACING.sm,
    overflow: 'visible',
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
  headerCaption: {
    marginBottom: -4,
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
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
  },
  cardsContainer: {
    marginHorizontal: -SPACING.md,
  },
  scrollContainer: {
    position: 'relative',
  },
  cardsScrollContent: {
    paddingHorizontal: SPACING.md,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
  },
  investmentItemCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.xs,
  },
  darkCardContent: {
    // Empty - content styles
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
  logoImage: {
    width: 16,
    height: 16,
  },
  companyName: {
    flex: 1,
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
  edgeIndicator: {
    position: 'absolute',
    top: '50%',
    marginTop: -16,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  distributionContainer: {
    paddingHorizontal: SPACING.xs,
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
});

export default memo(InvestmentSection);