import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { COLORS, SPACING, DEVICE } from '../constants/theme';
import HeaderSection from '../components/layout/HeaderSection';
import UpdatesSection from '../components/financial/UpdatesSection';
import BankBalanceSection from '../components/financial/BankBalanceSection';
import InvestmentSection from '../components/financial/InvestmentSection';

const HomeScreen = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Make all handlers stable with useCallback to prevent unnecessary re-renders
  const handleNotificationPress = useCallback(() => {
    console.log('Notification pressed');
  }, []);

  const handleProfilePress = useCallback(() => {
    console.log('Profile pressed');
  }, []);

  const handleUpdatePress = useCallback((update) => {
    console.log('Update pressed:', update);
  }, []);

  const handleSourcePress = useCallback((source) => {
    console.log('Source pressed:', source);
  }, []);

  // This was causing the BankBalanceSection to re-render
  const handleBalanceToggle = useCallback((isVisible) => {
    console.log('HomeScreen: Balance visibility toggled:', isVisible);
  }, []);

  const handleBankPress = useCallback((bank) => {
    console.log('HomeScreen: Bank pressed:', bank);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <HeaderSection
          userName="Anand"
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
        />

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Updates Section */}
          <View style={styles.section}>
            <UpdatesSection
              onUpdatePress={handleUpdatePress}
              onSourcePress={handleSourcePress}
            />
          </View>

          {/* Bank Balance Section */}
          <View style={[styles.section, styles.sectionWithPadding]}>
            <BankBalanceSection
              onBalanceToggle={handleBalanceToggle}
              onBankPress={handleBankPress}
            />
          </View>

          {/* Investment Section */}
          <View style={styles.section}>
            <InvestmentSection />
          </View>

          {/* Placeholder for Voice Assistant */}
          <View style={[styles.section, styles.sectionWithPadding]}>
            <View style={styles.assistantPlaceholder}>
              <View style={styles.assistantContent}>
                <View style={styles.assistantIcon} />
                <View style={styles.assistantText}>
                  <View style={styles.assistantTextLine} />
                  <View style={styles.assistantDivider} />
                  <View style={styles.assistantTextLine} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    width: '100%',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SPACING.xxs, // Reduced from lg to xs
    paddingBottom: SPACING.lg, // Reduced from 4xl to lg
    gap: SPACING.xs, // Reduced from sm to xs
  },
  section: {
    width: '100%',
  },
  sectionWithPadding: {
    paddingHorizontal: SPACING.sm,
  },

  assistantPlaceholder: {
    backgroundColor: COLORS.assistantGradient.from,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    padding: SPACING.md,
    minHeight: 120,
  },
  assistantContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  assistantIcon: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 32,
  },
  assistantText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  assistantTextLine: {
    width: 100,
    height: 12,
    backgroundColor: COLORS.secondary,
    borderRadius: 6,
  },
  assistantDivider: {
    width: 1,
    height: 10,
    backgroundColor: COLORS.border,
  },
});

export default HomeScreen; 