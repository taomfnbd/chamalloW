import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, Platform, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { PlanningConfig } from '../../types';
import DaySelector from './DaySelector';
import Button from '../ui/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

interface PlanningModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (config: PlanningConfig) => void;
  platform: 'linkedin' | 'instagram' | 'images';
}

const CONTENT_TYPES = [
  { label: 'Motivation du jour', value: 'motivation', icon: 'bolt' },
  { label: 'Conseil fitness', value: 'conseil', icon: 'graduation-cap' },
  { label: 'Témoignage client', value: 'temoignage', icon: 'star' },
  { label: 'Promotion service', value: 'promo', icon: 'bullhorn' },
  { label: 'Aléatoire', value: 'random', icon: 'random' },
];

const DAYS_LABELS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

interface DaySchedule {
  active: boolean;
  time: Date;
  contentType: string;
}

export default function PlanningModal({ visible, onClose, onSave, platform }: PlanningModalProps) {
  // Initialize schedule with default active days (Mon, Wed, Fri)
  const [schedule, setSchedule] = useState<Record<number, DaySchedule>>(() => {
    const initial: Record<number, DaySchedule> = {};
    for (let i = 0; i < 7; i++) {
      initial[i] = {
        active: [1, 3, 5].includes(i),
        time: new Date(new Date().setHours(9, 0, 0, 0)),
        contentType: 'conseil',
      };
    }
    return initial;
  });

  const [currentDay, setCurrentDay] = useState<number>(1); // Start with Monday
  const [notifyOnReady, setNotifyOnReady] = useState(true);
  const [requireValidation, setRequireValidation] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = () => {
    const activeDays = Object.keys(schedule)
      .map(Number)
      .filter(day => schedule[day].active);

    onSave({
      platform,
      days: activeDays,
      time: format(schedule[currentDay].time, 'HH:mm'), // This is lossy but fits the type
      contentType: schedule[currentDay].contentType as any, // Lossy
      notifyOnReady,
      requireValidation,
    });
    console.log('Detailed Schedule:', schedule);
    onClose();
  };

  const updateDaySchedule = (updates: Partial<DaySchedule>) => {
    setSchedule(prev => ({
      ...prev,
      [currentDay]: { ...prev[currentDay], ...updates }
    }));
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      updateDaySchedule({ time: selectedDate });
    }
  };

  const currentConfig = schedule[currentDay];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.subtitle}>Stratégie de Contenu</Text>
              <Text style={styles.title}>Planning {platform}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <DaySelector 
            schedule={schedule} 
            currentDay={currentDay} 
            onSelectDay={setCurrentDay} 
          />

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.dayTitle}>{DAYS_LABELS[currentDay]}</Text>
            
            <View style={styles.card}>
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.switchLabel}>Publication active</Text>
                  <Text style={styles.switchSubLabel}>Poster ce jour-là</Text>
                </View>
                <Switch
                  value={currentConfig.active}
                  onValueChange={(val) => updateDaySchedule({ active: val })}
                  trackColor={{ false: COLORS.backgroundTertiary, true: COLORS.primary }}
                  thumbColor={Platform.OS === 'ios' ? '#FFF' : '#FFF'}
                />
              </View>

              {currentConfig.active && (
                <View style={styles.daySettings}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Heure de publication</Text>
                    {Platform.OS === 'android' && (
                      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeButton}>
                        <Text style={styles.timeText}>{format(currentConfig.time, 'HH:mm')}</Text>
                      </TouchableOpacity>
                    )}
                    {(Platform.OS === 'ios' || showTimePicker) && (
                      <DateTimePicker
                        value={currentConfig.time}
                        mode="time"
                        display="default"
                        onChange={handleTimeChange}
                        style={{ width: 80 }}
                        textColor={COLORS.textPrimary}
                        themeVariant="dark"
                      />
                    )}
                  </View>

                  <Text style={[styles.label, { marginTop: SPACING.md, marginBottom: SPACING.sm }]}>Type de contenu</Text>
                  <View style={styles.typesGrid}>
                    {CONTENT_TYPES.map(type => (
                      <TouchableOpacity
                        key={type.value}
                        style={[
                          styles.typeCard,
                          currentConfig.contentType === type.value && styles.typeCardActive
                        ]}
                        onPress={() => updateDaySchedule({ contentType: type.value })}
                        activeOpacity={0.7}
                      >
                        <FontAwesome 
                          name={type.icon as any} 
                          size={16} 
                          color={currentConfig.contentType === type.value ? COLORS.textPrimary : COLORS.textSecondary} 
                          style={{ marginBottom: 4 }}
                        />
                        <Text style={[
                          styles.typeLabel, 
                          currentConfig.contentType === type.value && styles.typeLabelActive
                        ]}>
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            <Text style={styles.sectionTitle}>Préférences Globales</Text>
            <View style={styles.card}>
              <View style={[styles.switchRow, { borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: SPACING.md, marginBottom: SPACING.md }]}>
                <Text style={styles.switchLabel}>Notification "Prêt à poster"</Text>
                <Switch
                  value={notifyOnReady}
                  onValueChange={setNotifyOnReady}
                  trackColor={{ false: COLORS.backgroundTertiary, true: COLORS.primary }}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Validation manuelle requise</Text>
                <Switch
                  value={requireValidation}
                  onValueChange={setRequireValidation}
                  trackColor={{ false: COLORS.backgroundTertiary, true: COLORS.primary }}
                />
              </View>
            </View>
          </ScrollView>

          <Button title="SAUVEGARDER LE PLANNING" onPress={handleSave} style={styles.saveButton} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background, // Darker background
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    height: '92%',
    ...SHADOWS.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: SPACING.xs,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.full,
  },
  content: {
    flex: 1,
    marginTop: SPACING.md,
  },
  dayTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  daySettings: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  label: {
    fontFamily: FONTS.semiBold,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeButton: {
    backgroundColor: COLORS.backgroundTertiary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  typeCard: {
    width: '48%',
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  typeCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  typeLabelActive: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  switchSubLabel: {
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
    fontSize: 12,
    marginTop: 2,
  },
  saveButton: {
    marginBottom: SPACING.xl,
    marginTop: SPACING.sm,
  },
});
