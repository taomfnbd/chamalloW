import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface SuggestionListProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export default function SuggestionList({ suggestions, onSelect }: SuggestionListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {suggestions.map((text, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.chip} 
            onPress={() => onSelect(text)}
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
    backgroundColor: COLORS.backgroundTertiary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    fontSize: 13,
  },
});
