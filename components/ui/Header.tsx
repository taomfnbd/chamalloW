import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, GLASS } from '../../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';

interface HeaderProps {
  platform?: string;
  onMenuPress: () => void;
  onAgentPress?: () => void;
  showActions?: boolean;
}

export default function Header({ 
  platform, 
  onMenuPress, 
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
          <FontAwesome name="bars" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.logo}>chamallo<Text style={styles.logoW}>W</Text></Text>
        </View>

        <View style={styles.actions}>
          {showActions && (
            <>
              {onAgentPress && (
                <TouchableOpacity 
                  onPress={() => handlePress(onAgentPress)}
                  style={styles.actionButton}
                >
                  <FontAwesome name="bolt" size={18} color={COLORS.primary} />
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
    ...GLASS.heavy,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
    zIndex: 100,
  },
  container: {
    height: 56, // Slightly more compact
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  logoW: {
    color: COLORS.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: BORDER_RADIUS.full,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
});
