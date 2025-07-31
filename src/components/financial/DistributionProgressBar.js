import React, { useEffect, memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, SPACING } from '../../constants/theme';
import Typography from '../common/Typography';

const DistributionProgressBar = memo(({ 
  stockPercentage = 30, 
  mutualFundPercentage = 70, 
  activeTab = 'stocks' 
}) => {
  // Reanimated values
  const stockBarHeight = useSharedValue(8);
  const mutualFundBarHeight = useSharedValue(8);
  const percentageOpacity = useSharedValue(1);
  const displayedPercentage = useSharedValue(stockPercentage);
  
  // Calculate target values
  const targetValues = useMemo(() => ({
    stockHeight: activeTab === 'stocks' ? 12 : 6,
    mutualFundHeight: activeTab === 'mutualFunds' ? 12 : 6,
    percentage: activeTab === 'stocks' ? stockPercentage : mutualFundPercentage,
  }), [activeTab, stockPercentage, mutualFundPercentage]);
  
  // Animated styles
  const stockBarStyle = useAnimatedStyle(() => ({
    height: stockBarHeight.value,
    flex: stockPercentage / 100,
    backgroundColor: activeTab === 'stocks' ? COLORS.stocks : COLORS.textTertiary,
    borderRadius: activeTab === 'stocks' ? 3 : 1,
  }));
  
  const mutualFundBarStyle = useAnimatedStyle(() => ({
    height: mutualFundBarHeight.value,
    flex: mutualFundPercentage / 100,
    backgroundColor: activeTab === 'mutualFunds' ? COLORS.mutualFunds : COLORS.textTertiary,
    borderRadius: activeTab === 'mutualFunds' ? 3 : 1,
  }));
  
  const percentageContainerStyle = useAnimatedStyle(() => ({
    opacity: percentageOpacity.value,
  }));
  
  // Percentage text - using derived value for display
  const percentageText = useMemo(() => 
    Math.round(targetValues.percentage).toString() + '%',
    [targetValues.percentage]
  );
  
  // Animation effect
  useEffect(() => {
    'worklet';
    
    // Animate bar heights
    stockBarHeight.value = withTiming(targetValues.stockHeight, { duration: 300 });
    mutualFundBarHeight.value = withTiming(targetValues.mutualFundHeight, { duration: 300 });
    
    // Animate percentage with fade transition
    percentageOpacity.value = withSequence(
      withTiming(0, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    
    // Update displayed percentage
    displayedPercentage.value = targetValues.percentage;
  }, [targetValues]);
  
  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {/* Stock Holdings Bar */}
        <Reanimated.View style={[styles.bar, stockBarStyle]} />
        
        {/* Percentage Display */}
        <Reanimated.View style={[styles.percentageContainer, percentageContainerStyle]}>
          <Typography variant="bodySmall" color="textPrimary" weight="bold">
            {percentageText}
          </Typography>
        </Reanimated.View>
        
        {/* Mutual Funds Bar */}
        <Reanimated.View style={[styles.bar, mutualFundBarStyle]} />
      </View>
    </View>
  );
});

DistributionProgressBar.displayName = 'DistributionProgressBar';

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xxs,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
  },
  bar: {
    minHeight: 2,
  },
  percentageContainer: {
    paddingHorizontal: SPACING.xxs,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DistributionProgressBar;