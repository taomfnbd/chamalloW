import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../../constants/theme';
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
    <View style={styles.headerWrapper}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: 'rgba(26, 29, 38, 0.85)', // Slightly translucent
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 100,
    // Web-specific blur would go here if using a platform-specific file or library
  },
  container: {
    height: 64, // Taller header
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    maxWidth: 1200, // Constrain width on large screens
    width: '100%',
    alignSelf: 'center',
  },
  iconButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  logoW: {
    color: COLORS.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: BORDER_RADIUS.full,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
