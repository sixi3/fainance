import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, DEVICE } from '../constants/theme';
import HeaderSection from '../components/layout/HeaderSection';
import UpdatesSection from '../components/financial/UpdatesSection';
import BankBalanceSection from '../components/financial/BankBalanceSection';
import InvestmentSection from '../components/financial/InvestmentSection';
import VoiceAssistant from '../components/assistant/VoiceAssistant';

const HomeScreen = () => {
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

  const handleBalanceToggle = useCallback((isVisible) => {
    console.log('HomeScreen: Balance visibility toggled:', isVisible);
  }, []);

  const handleBankPress = useCallback((bank) => {
    console.log('HomeScreen: Bank pressed:', bank);
  }, []);

  const handleVoicePress = useCallback((action) => {
    console.log('HomeScreen: Voice action:', action);
  }, []);

  const handleKeyboardPress = useCallback(() => {
    console.log('HomeScreen: Keyboard pressed');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        {/* Header Section */}
        <HeaderSection
          userName="Anand"
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
        />

        {/* Main Body Container - This is the key change */}
        <View style={styles.bodyContainer}>
          {/* Scrollable Content */}
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
          </ScrollView>

          {/* Voice Assistant Container - Now inside bodyContainer */}
          <View style={styles.voiceAssistantWrapper}>
            <VoiceAssistant
              onVoicePress={handleVoicePress}
              onKeyboardPress={handleKeyboardPress}
            />
          </View>
        </View>
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
  // New container that holds both ScrollView and VoiceAssistant
  bodyContainer: {
    flex: 1,
    justifyContent: 'space-between', // This ensures VoiceAssistant stays at bottom
  },
  scrollView: {
    flex: 0, // Don't let ScrollView take all space
    flexGrow: 0, // Prevent ScrollView from growing
    flexShrink: 1, // Allow ScrollView to shrink if needed
  },
  scrollContent: {
    paddingTop: SPACING.xxs,
    paddingBottom: SPACING.sm, // Reduced padding since we have space between sections
    gap: SPACING.xs,
  },
  section: {
    width: '100%',
  },
  sectionWithPadding: {
    paddingHorizontal: SPACING.sm,
  },
  // Voice Assistant wrapper that expands to fill available space
  voiceAssistantWrapper: {
    flex: 1, // Take up remaining space
    justifyContent: 'flex-end', // Align content to bottom
    minHeight: 120, // Minimum height to ensure VoiceAssistant is always visible
    maxHeight: 300, // Optional: prevent it from becoming too tall on very large screens
  },
});

export default HomeScreen;