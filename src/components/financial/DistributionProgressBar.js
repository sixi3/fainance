import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Typography from '../common/Typography';

const DistributionProgressBar = ({ 
  stockPercentage = 63, 
  mutualFundPercentage = 37, 
  activeTab = 'stocks' 
}) => {
  // Animated progress value
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const targetProgress = activeTab === 'stocks' ? stockPercentage : mutualFundPercentage;
    Animated.spring(progressAnim, {
      toValue: targetProgress,
      useNativeDriver: false,
      damping: 20,
      stiffness: 150,
    }).start();
  }, [activeTab, stockPercentage, mutualFundPercentage]);
  
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            { 
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: activeTab === 'stocks' ? COLORS.success : COLORS.investment,
            }
          ]} 
        />
      </View>
      <View style={styles.progressLabels}>
        <Typography variant="caption" color="textSecondary" weight="medium">
          Stocks {stockPercentage}%
        </Typography>
        <Typography variant="caption" color="textSecondary" weight="medium">
          MF {mutualFundPercentage}%
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    gap: SPACING.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default DistributionProgressBar; 