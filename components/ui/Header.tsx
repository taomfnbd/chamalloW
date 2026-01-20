import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';

interface HeaderProps {
  platform?: string; // Deprecated but kept for compatibility
  onMenuPress: () => void;
  onPlanningPress?: () => void;
  onAgentPress?: () => void;
  showActions?: boolean;
}

export default function Header({ 
  platform, 
  onMenuPress, 
  onPlanningPress, 
  onAgentPress,
  showActions = true 
}: HeaderProps) {
  
  const handlePress = (action: () => void) => {
    Haptics.selectionAsync();
    action();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={() => handlePress(onMenuPress)}
          style={styles.iconButton}
        >
          <FontAwesome name="bars" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.logo}>chamallo<Text style={styles.logoW}>W</Text></Text>
        </View>

        <View style={styles.actions}>
          {showActions && (
            <>
              {onPlanningPress && (
                <TouchableOpacity 
                  onPress={() => handlePress(onPlanningPress)}
                  style={styles.actionButton}
                >
                  <FontAwesome name="calendar" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
              )}
              {onAgentPress && (
                <TouchableOpacity 
                  onPress={() => handlePress(onAgentPress)}
                  style={styles.actionButton}
                >
                  <FontAwesome name="bolt" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.backgroundSecondary,
    ...SHADOWS.small,
    zIndex: 100,
  },
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  iconButton: {
    padding: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  logoW: {
    color: COLORS.primary,
  },
  badge: {
    marginLeft: SPACING.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    transform: [{ translateY: 2 }],
  },
  badgeLinkedin: {
    backgroundColor: 'rgba(0, 119, 181, 0.15)',
    borderWidth: 1,
    borderColor: '#0077B5',
  },
  badgeInstagram: {
    backgroundColor: 'rgba(225, 48, 108, 0.15)',
    borderWidth: 1,
    borderColor: '#E1306C',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
});
