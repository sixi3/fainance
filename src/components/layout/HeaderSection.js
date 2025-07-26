import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Bell } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Typography from '../common/Typography';

const HeaderSection = ({ 
  userName = 'Anand',
  onNotificationPress,
  onProfilePress,
  profileImage = require('../../../assets/profile-picture.png')
}) => {
  return (
    <View style={styles.container}>
      {/* Main header content */}
      <View style={styles.headerContent}>
        <View style={styles.greetingContainer}>
          <Typography variant="body" color="textSecondary" weight="medium">
            Hello, {userName}
          </Typography>
          <Typography variant="h2" color="textPrimary" weight="bold">
            For You
          </Typography>
        </View>

        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.notificationButton}
            onPress={onNotificationPress}
          >
            <Bell size={28} color={COLORS.textSecondary} strokeWidth={2} />
          </Pressable>

          <Pressable
            style={styles.profileContainer}
            onPress={onProfilePress}
          >
            <View style={styles.profileImageContainer}>
              {profileImage ? (
                <View style={styles.profileImage}>
                  <Image source={profileImage} style={styles.profileImage} />
                </View>
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Typography variant="body" color="textPrimary" weight="semibold">
                    {userName.charAt(0).toUpperCase()}
                  </Typography>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs, // Reduced from sm to xs
  },
  greetingContainer: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  notificationButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    width: 40,
    height: 40,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeaderSection; 