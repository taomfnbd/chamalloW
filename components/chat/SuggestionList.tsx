import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface SuggestionListProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export default function SuggestionList({ suggestions, onSelect }: SuggestionListProps) {
  const handlePress = (text: string) => {
    Haptics.selectionAsync();
    onSelect(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {suggestions.map((text, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.chip} 
            activeOpacity={0.7}
            onPress={() => handlePress(text)}
          >
            <Text style={styles.text}>✨ {text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    width: '100%',
  },
  title: {
    color: COLORS.textMuted,
    fontFamily: FONTS.medium,
    fontSize: 12,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  text: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
});
