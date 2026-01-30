import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
});
