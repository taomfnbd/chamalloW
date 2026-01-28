import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface DaySelectorProps {
  schedule: Record<number, { active: boolean }>;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

const DAYS = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];

export default function DaySelector({ schedule, currentDay, onSelectDay }: DaySelectorProps) {
  return (
    <View style={styles.container}>
      {DAYS.map((day, index) => {
        const isActive = schedule[index]?.active;
        const isSelected = currentDay === index;
        
        return (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton, 
              isSelected && styles.dayButtonSelected,
              isActive && !isSelected && styles.dayButtonActive
            ]}
            onPress={() => onSelectDay(index)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.dayText, 
              isSelected && styles.dayTextSelected,
              isActive && !isSelected && styles.dayTextActive
            ]}>
              {day}
            </Text>
            {isActive && <View style={[styles.dot, isSelected && styles.dotSelected]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.full,
    padding: SPACING.xs,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 54,
    borderRadius: 22,
  },
  dayButtonSelected: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  dayButtonActive: {
    backgroundColor: COLORS.backgroundTertiary,
  },
  dayText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.medium,
    fontSize: 11,
    marginBottom: 4,
  },
  dayTextSelected: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
  },
  dayTextActive: {
    color: COLORS.primaryLight,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
  dotSelected: {
    backgroundColor: COLORS.textPrimary,
  },
});
