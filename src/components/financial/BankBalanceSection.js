import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { View, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { Eye } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Typography from '../common/Typography';
import Card from '../common/Card';
import { useHaptics } from '../../hooks/useHaptics';

// Static bank data outside component
const BANK_DATA = [
  {
    id: 'bob',
    name: 'Bank of Baroda',
    icon: require('../../../assets/BoB.png'),
    balance: 15000000,
  },
  {
    id: 'kotak',
    name: 'Kotak Bank', 
    icon: require('../../../assets/kotak.png'),
    balance: 129230392.86,
  },
];

// Static constants
const HIDDEN_BALANCE = '⛬ ⛬ ⛬ ⛬ ⛬ ⛬ ⛬ ⛬';
const ANIMATION_DURATION = 120;

// Utility function for formatting balance
const formatBalance = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace(/[^\d.,]/g, '');
};

// Memoized Bank Icon Component
const BankIcon = memo(({ bank, onPress }) => {
  const handlePress = useCallback(() => {
    onPress?.(bank);
  }, [bank, onPress]);

  return (
    <View style={styles.bankIconWrapper}>
      <Pressable
        style={styles.bankIconButton}
        onPress={handlePress}
      >
        <View style={styles.bankIconCircle}>
          <Image 
            source={bank.icon}
            style={styles.bankIcon}
            resizeMode="contain"
          />
        </View>
      </Pressable>
    </View>
  );
});

BankIcon.displayName = 'BankIcon';

// Memoized Bank Icons Display
const BankIconsDisplay = memo(({ onBankPress }) => {
  console.log('BankIconsDisplay rendered');
  
  return (
    <View style={styles.bankIconsSection}>
      <View style={styles.bankIconsList}>
        {BANK_DATA.map((bank) => (
          <BankIcon 
            key={bank.id} 
            bank={bank} 
            onPress={onBankPress}
          />
        ))}
        
        <View style={styles.bankIconWrapper}>
          <View style={[styles.bankIconCircle, styles.moreIconCircle]}>
            <Typography variant="caption" color="textPrimary" weight="regular">
              +2
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );
});

BankIconsDisplay.displayName = 'BankIconsDisplay';

// Balance Display with standard Animated API for stability
const BalanceDisplay = memo(({ 
  balance, 
  currency, 
  lastUpdated, 
  isVisible, 
  onToggle 
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { impact } = useHaptics();
  const [displayText, setDisplayText] = useState(() => 
    isVisible ? formatBalance(balance, currency) : HIDDEN_BALANCE
  );
  const isAnimatingRef = useRef(false);

  // Update display text when visibility or balance changes (without animation)
  useEffect(() => {
    if (!isAnimatingRef.current) {
      setDisplayText(isVisible ? formatBalance(balance, currency) : HIDDEN_BALANCE);
    }
  }, [balance, currency, isVisible]);

  const handleToggle = useCallback(() => {
    if (isAnimatingRef.current) return;
    
    isAnimatingRef.current = true;
    impact.light();
    
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      // Update text when faded out
      const newText = isVisible ? HIDDEN_BALANCE : formatBalance(balance, currency);
      setDisplayText(newText);
      onToggle();
      
      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => {
        isAnimatingRef.current = false;
      });
    });
  }, [onToggle, impact, fadeAnim, isVisible, balance, currency]);

  return (
    <View style={styles.balanceSection}>
      <View style={styles.balanceHeader}>
        <View>
          <Typography variant="caption" color="textSecondary" weight="medium">
            Bank
          </Typography>
          <Typography variant="h4" color="textPrimary" weight="bold" style={styles.balanceTitle}>
            Balance
          </Typography>
        </View>
        <Typography variant="caption" color="secondary" weight="light">
          Updates {lastUpdated}
        </Typography>
      </View>

      <View style={styles.balanceRow}>
        <Animated.View style={[styles.balanceText, { opacity: fadeAnim }]}>
          <Typography variant="currency" color="textSecondary" size={14}>
            ₹
          </Typography>
          <Typography variant="h2" color="textSecondary" weight="bold">
            {displayText}
          </Typography>
        </Animated.View>
        
        <Pressable style={styles.eyeButton} onPress={handleToggle}>
          <Eye size={18} color={COLORS.textPrimary} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
});

BalanceDisplay.displayName = 'BalanceDisplay';

// Main Component - Optimized to prevent unnecessary re-renders
const BankBalanceSection = memo(({ 
  balance = 279230392.86,
  currency = 'INR',
  lastUpdated = '2 mins ago',
  onBalanceToggle,
  onBankPress 
}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // Memoized handlers
  const handleToggle = useCallback(() => {
    setIsBalanceVisible(prev => {
      const newVisibility = !prev;
      console.log('Balance visibility toggled:', newVisibility);
      onBalanceToggle?.(newVisibility);
      return newVisibility;
    });
  }, [onBalanceToggle]);

  const handleBankPress = useCallback((bank) => {
    console.log('Bank pressed:', bank.name);
    onBankPress?.(bank);
  }, [onBankPress]);

  // Split the content into separate memoized components
  return (
    <Card 
      variant="gradient" 
      style={styles.container} 
      contentStyle={styles.cardContent}
    >
      <View style={styles.content}>
        <BalanceDisplay
          balance={balance}
          currency={currency}
          lastUpdated={lastUpdated}
          isVisible={isBalanceVisible}
          onToggle={handleToggle}
        />
        <BankIconsDisplay onBankPress={handleBankPress} />
      </View>
    </Card>
  );
});

BankBalanceSection.displayName = 'BankBalanceSection';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cardContent: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  
  // Balance Section Styles
  balanceSection: {
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
  balanceTitle: {
    marginTop: -2,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceText: {
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
  
  // Bank Icons Section Styles
  bankIconsSection: {
    width: 55,
    backgroundColor: COLORS.dot,
    borderColor: COLORS.border,
    borderLeftWidth: 1,
    borderTopRightRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  bankIconsList: {
    flex: 1,
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  bankIconWrapper: {
    alignItems: 'center',
  },
  bankIconButton: {
    width: 30,
    height: 30,
  },
  bankIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIconCircle: {
    backgroundColor: COLORS.surfaceSecondary,
    borderColor: 'transparent',
  },
  bankIcon: {
    width: 18,
    height: 18,
  },
});

export default BankBalanceSection;