import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Message } from '../../types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

interface EditableMessageProps {
  message: Message;
  onUpdate: (id: string, newContent: string) => void;
  onRegenerate: (id: string) => void;
  onValidate: (id: string) => void;
}

export default function EditableMessage({ 
  message, 
  onUpdate, 
  onRegenerate, 
  onValidate 
}: EditableMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(message.content);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSave = () => {
    onUpdate(message.id, editContent);
    setIsEditing(false);
    Haptics.selectionAsync();
  };

  const handleCancel = () => {
    setEditContent(message.content);
    setIsEditing(false);
    Haptics.selectionAsync();
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            multiline
            value={editContent}
            onChangeText={setEditContent}
            textAlignVertical="top"
          />
          <View style={styles.editActions}>
            <TouchableOpacity onPress={handleCancel} style={styles.editButton}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.editButton, styles.saveButton]}>
              <Text style={styles.saveText}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.text}>{message.content}</Text>
          <TouchableOpacity 
            onPress={() => setIsEditing(true)} 
            style={styles.editIcon}
          >
            <FontAwesome name="pencil" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        {message.score !== undefined && (
          <View style={styles.scoreContainer}>
            <FontAwesome name="thumbs-up" size={14} color={COLORS.success} />
            <Text style={styles.scoreText}>{message.score}/100</Text>
          </View>
        )}
        
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onRegenerate(message.id)} style={styles.actionButton}>
            <FontAwesome name="refresh" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
            <FontAwesome name="clipboard" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => onValidate(message.id)} style={styles.actionButton}>
            <FontAwesome name="check-circle" size={18} color={COLORS.success} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bubbleAI,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    marginVertical: SPACING.xs,
    maxWidth: '90%',
    alignSelf: 'flex-start',
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  contentContainer: {
    padding: SPACING.md,
    paddingRight: SPACING.xl + SPACING.sm, // Extra space for edit icon
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
  },
  editIcon: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    padding: SPACING.xs,
  },
  editContainer: {
    padding: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.backgroundTertiary,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    fontSize: 16,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    minHeight: 100,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  editButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  saveText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.backgroundTertiary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    color: COLORS.success,
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    padding: 4,
  },
});
