import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Eye } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Typography from '../common/Typography';
import Card from '../common/Card';

const BankBalanceSection = ({ 
  balance = 279230392.86,
  currency = 'INR',
  lastUpdated = '2 mins ago',
  banks = [],
  onBalanceToggle,
  onBankPress 
}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const defaultBanks = [
    {
      id: '1',
      name: 'Bank of Baroda',
      icon: 'BOB',
      color: COLORS.bankOfBaroda,
      balance: 15000000,
    },
    {
      id: '2',
      name: 'Kotak Bank',
      icon: 'KOTAK',
      color: COLORS.kotakBank,
      balance: 129230392.86,
    },
  ];

  const displayBanks = banks.length > 0 ? banks : defaultBanks;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatBalance = (amount) => {
    if (!isBalanceVisible) {
      return '••••••••••••••••';
    }
    
    const formatted = formatCurrency(amount);
    // Remove currency symbol and format with Indian numbering system
    const numericPart = formatted.replace(/[^\d.,]/g, '');
    return numericPart;
  };

  const handleBalanceToggle = () => {
    setIsBalanceVisible(!isBalanceVisible);
    onBalanceToggle?.(!isBalanceVisible);
  };

  const renderBankIcon = (bank) => (
    <Pressable
      key={bank.id}
      style={styles.bankIconContainer}
      onPress={() => onBankPress?.(bank)}
    >
      <View style={[styles.bankIconCircle, { borderColor: COLORS.border }]}>
        <View style={[styles.bankIconInner, { backgroundColor: COLORS.surface }]}>
          <Typography variant="caption" color="textPrimary" weight="regular">
            {bank.icon}
          </Typography>
        </View>
      </View>
    </Pressable>
  );

  return (
    <Card variant="gradient" style={styles.container} contentStyle={{ paddingVertical: 0, paddingHorizontal: 0 }}>
      <View style={styles.content}>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceTitleContainer}>
              <Typography variant="caption" color="textSecondary" weight="medium">
                Bank
              </Typography>
              <Typography variant="h4" color="textPrimary" weight="bold">
                Balance
              </Typography>
            </View>
            
            <Typography variant="caption" color="secondary" weight="light">
              Updates {lastUpdated}
            </Typography>
          </View>

          <View style={styles.balanceAmountContainer}>
            <View style={styles.balanceAmountTextContainer}>
              <Typography variant="currency" color="textSecondary" size={14}>
                ₹
              </Typography>
              <Typography variant="h1" color="textSecondary" weight="regular">
                {formatBalance(balance)}
              </Typography>
            </View>
            
            <Pressable
              style={styles.eyeButton}
              onPress={handleBalanceToggle}
            >
              <Eye size={18} color={COLORS.textPrimary} strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        <View style={styles.bankIconsContainer}>
          <View style={styles.bankIcons}>
            {displayBanks.map(renderBankIcon)}
            <View style={styles.bankIconContainer}>
              <View style={[styles.bankIconCircle, { borderColor: COLORS.border }]}>
                <View style={[styles.bankIconInner, { backgroundColor: COLORS.dot }]}>
                  <Typography variant="caption" color="textPrimary" weight="regular">
                    +2
                  </Typography>
                </View>
              </View>
            </View>
          </View>
        </View>
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
    gap: 52,
  },
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 6,
  },
  balanceAmountTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankIconInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BankBalanceSection; 