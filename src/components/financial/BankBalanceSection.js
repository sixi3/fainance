import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { View, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { Eye } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, ANIMATIONS } from '../../constants/theme';
import Typography from '../common/Typography';
import Card from '../common/Card';
import { useHaptics } from '../../hooks/useHaptics';

// Separate memoized component for bank icons with debug logging
const BankIcons = memo(({ banks, onBankPress }) => {
  // Debug: Log when this component re-renders
  console.log('BankIcons re-rendered');

  const renderBankIcon = useCallback((bank) => (
    <Pressable
      key={bank.id}
      style={styles.bankIconContainer}
      onPress={() => onBankPress?.(bank)}
    >
      <View style={[styles.bankIconCircle, { borderColor: COLORS.primary }]}>
        <Image 
          source={bank.icon} 
          style={styles.bankIconImage}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  ), [onBankPress]);

  return (
    <View style={styles.bankIconsContainer}>
      <View style={styles.bankIcons}>
        {banks.map(renderBankIcon)}
        <View style={styles.bankIconContainer}>
          <View style={[styles.bankIconCircle, { backgroundColor: COLORS.surfaceSecondary }]}>
            <Typography variant="caption" color="textPrimary" weight="regular">
              +2
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  const banksChanged = prevProps.banks !== nextProps.banks;
  const onBankPressChanged = prevProps.onBankPress !== nextProps.onBankPress;
  
  console.log('BankIcons memo comparison:', {
    banksChanged,
    onBankPressChanged,
    prevBanks: prevProps.banks?.length || 'undefined',
    nextBanks: nextProps.banks?.length || 'undefined',
    shouldRerender: banksChanged || onBankPressChanged
  });
  
  // Return true if props are equal (don't re-render), false if they've changed (re-render)
  return !banksChanged && !onBankPressChanged;
});

const BankBalanceSection = ({ 
  balance = 279230392.86,
  currency = 'INR',
  lastUpdated = '2 mins ago',
  banks = [],
  onBalanceToggle,
  onBankPress 
}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { impact } = useHaptics();

  // Create completely stable banks reference
  const defaultBanksRef = useRef([
    {
      id: '1',
      name: 'Bank of Baroda',
      icon: require('../../../assets/BoB.png'),
      color: COLORS.bankOfBaroda,
      balance: 15000000,
    },
    {
      id: '2',
      name: 'Kotak Bank',
      icon: require('../../../assets/KOTAK.png'),
      color: COLORS.kotakBank,
      balance: 129230392.86,
    },
  ]);

  // Create a stable displayBanks that only changes when banks prop actually changes content
  const displayBanksRef = useRef(banks.length > 0 ? banks : defaultBanksRef.current);
  
  // Only update if banks content has actually changed
  const currentBanksString = JSON.stringify(banks);
  const lastBanksString = useRef(currentBanksString);
  
  if (lastBanksString.current !== currentBanksString) {
    console.log('Banks content changed, updating displayBanks');
    displayBanksRef.current = banks.length > 0 ? banks : defaultBanksRef.current;
    lastBanksString.current = currentBanksString;
  }

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, [currency]);

  const formattedBalance = useMemo(() => {
    const formatted = formatCurrency(balance);
    return formatted.replace(/[^\d.,]/g, '');
  }, [balance, formatCurrency]);

  const hiddenBalance = '⛬ ⛬ ⛬ ⛬ ⛬ ⛬ ⛬ ⛬';

  const handleBalanceToggle = useCallback(() => {
    // Trigger haptic feedback
    impact.light();
    
    // Change state immediately
    const newVisibility = !isBalanceVisible;
    setIsBalanceVisible(newVisibility);
    onBalanceToggle?.(newVisibility);
    
    // Animate the transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATIONS.duration.fast / 2,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATIONS.duration.fast / 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isBalanceVisible, impact, onBalanceToggle, fadeAnim]);

  // Memoize onBankPress to prevent BankIcons from re-rendering
  // Use useRef to ensure the callback is completely stable
  const memoizedOnBankPress = useRef(onBankPress);
  memoizedOnBankPress.current = onBankPress;
  
  const stableOnBankPress = useCallback((bank) => {
    memoizedOnBankPress.current?.(bank);
  }, []); // Empty dependency array - never changes

  return (
    <Card variant="gradient" style={styles.container} contentStyle={{ paddingVertical: 0, paddingHorizontal: 0 }}>
      <View style={styles.content}>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceTitleContainer}>
              <Typography variant="caption" color="textSecondary" weight="medium">
                Bank
              </Typography>
              <Typography variant="h4" color="textPrimary" weight="bold" style={{ marginTop: -2 }}>
                Balance
              </Typography>
            </View>
            
            <Typography variant="caption" color="secondary" weight="light">
              Updates {lastUpdated}
            </Typography>
          </View>

          <View style={styles.balanceAmountContainer}>
            <Animated.View 
              style={[
                styles.balanceAmountTextContainer,
                { opacity: fadeAnim }
              ]}
            >
              <Typography variant="currency" color="textSecondary" size={14}>
                ₹
              </Typography>
              <Typography variant="h2" color="textSecondary" weight="bold">
                {isBalanceVisible ? formattedBalance : hiddenBalance}
              </Typography>
            </Animated.View>
            
            <Pressable
              style={styles.eyeButton}
              onPress={handleBalanceToggle}
            >
              <Eye size={18} color={COLORS.textPrimary} strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        <BankIcons banks={displayBanksRef.current} onBankPress={stableOnBankPress} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  balanceContainer: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 44,
    padding: SPACING.md,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceAmountTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 1,
  },
  eyeButton: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankIconsContainer: {
    width: 55,
    backgroundColor: COLORS.dot,
    borderColor: COLORS.border,
    borderLeftWidth: 1,
    borderTopRightRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  bankIcons: {
    flex: 1,
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  bankIconContainer: {
    alignItems: 'center',
  },
  bankIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: COLORS.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankIconImage: {
    width: 18,
    height: 18,
  },
});

export default BankBalanceSection; 