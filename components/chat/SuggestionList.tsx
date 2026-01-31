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
    backgroundColor: 'rgba(255,255,255,0.03)', // Subtle glass-like fill
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 4,
  },
  text: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
});
