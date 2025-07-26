import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { View, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { Eye } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, ANIMATIONS } from '../../constants/theme';
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
    icon: require('../../../assets/KOTAK.png'),
    balance: 129230392.86,
  },
];

// Static constants to prevent recreation
const HIDDEN_BALANCE = '⛬ ⛬ ⛬ ⛬ ⛬ ⛬ ⛬ ⛬';

// Move BalanceDisplay outside the main component and memoize it
const BalanceDisplay = memo(({ 
  balance, 
  currency, 
  lastUpdated, 
  isVisible, 
  onToggle 
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { impact } = useHaptics();
  const isAnimatingRef = useRef(false);
  const [displayText, setDisplayText] = useState('');

  const formatBalance = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount).replace(/[^\d.,]/g, '');
  }, [currency]);

  // Initialize display text - removed hiddenBalance from dependencies
  useEffect(() => {
    setDisplayText(isVisible ? formatBalance(balance) : HIDDEN_BALANCE);
  }, [balance, formatBalance, isVisible]);

  const handleToggle = useCallback(() => {
    if (isAnimatingRef.current) return;
    
    isAnimatingRef.current = true;
    impact.light();
    
    // Start fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      // Change text when completely faded out
      const newText = isVisible ? HIDDEN_BALANCE : formatBalance(balance);
      setDisplayText(newText);
      onToggle();
      
      // Fade back in with new text
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        isAnimatingRef.current = false;
      });
    });
  }, [onToggle, impact, fadeAnim, isVisible, formatBalance, balance]);

  return (
    <View style={styles.balanceSection}>
      <View style={styles.balanceHeader}>
        <View>
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

// Alternative approach: Use a class component with aggressive prevention
class BankIconsDisplay extends React.Component {
  constructor(props) {
    super(props);
    console.log('BankIconsDisplay constructed');
  }

  shouldComponentUpdate() {
    console.log('BankIconsDisplay shouldComponentUpdate called - blocking update');
    return false; // Never update
  }

  componentDidMount() {
    console.log('BankIconsDisplay mounted');
  }

  handleBankPress = (bank) => {
    console.log('Bank pressed:', bank.name);
  };

  render() {
    console.log('BankIconsDisplay rendered');
    
    return (
      <View style={styles.bankIconsSection}>
        <View style={styles.bankIconsList}>
          {BANK_DATA.map((bank) => (
            <View key={bank.id} style={styles.bankIconWrapper}>
              <Pressable
                style={styles.bankIconButton}
                onPress={() => this.handleBankPress(bank)}
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
  }
}

// Main Combined Component
const BankBalanceSection = ({ 
  balance = 279230392.86,
  currency = 'INR',
  lastUpdated = '2 mins ago',
  onBalanceToggle,
  onBankPress 
}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const handleToggle = useCallback(() => {
    const newVisibility = !isBalanceVisible;
    setIsBalanceVisible(newVisibility);
    console.log('Balance visibility toggled:', newVisibility);
    onBalanceToggle?.(newVisibility);
  }, [isBalanceVisible, onBalanceToggle]);

  return (
    <Card 
      variant="gradient" 
      style={styles.container} 
      contentStyle={{ paddingVertical: 0, paddingHorizontal: 0 }}
    >
      <View style={styles.content}>
        <BalanceDisplay
          balance={balance}
          currency={currency}
          lastUpdated={lastUpdated}
          isVisible={isBalanceVisible}
          onToggle={handleToggle}
        />
        <BankIconsDisplay />
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