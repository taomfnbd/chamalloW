import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Message } from '../../types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
// import PostPreview from './PostPreview'; // Disabled as per user request

interface EditableMessageProps {
  message: Message;
  onUpdate: (id: string, newContent: string) => void;
  onRegenerate: (id: string) => void;
  onValidate: (id: string) => void;
  onGenerateImage?: (content: string) => void;
  platform?: 'linkedin' | 'instagram';
}

export default function EditableMessage({ 
  message, 
  onUpdate, 
  onRegenerate, 
  onValidate,
  onGenerateImage,
  platform
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
    <View style={styles.wrapper}>
      <View style={styles.avatar}>
        <FontAwesome name="bolt" size={14} color={COLORS.textSecondary} />
      </View>
      
      <View style={styles.contentColumn}>
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
          <Text style={styles.text}>{message.content}</Text>
        )}

        {!isEditing && (
          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={handleCopy} style={styles.actionButton} activeOpacity={0.7}>
              <FontAwesome name="clipboard" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => onRegenerate(message.id)} style={styles.actionButton} activeOpacity={0.7}>
              <FontAwesome name="refresh" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.actionButton} activeOpacity={0.7}>
              <FontAwesome name="pencil" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>

            {onGenerateImage && (
              <TouchableOpacity onPress={() => onGenerateImage(message.content)} style={styles.actionButton} activeOpacity={0.7}>
                <FontAwesome name="image" size={14} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start', // Top alignment for ChatGPT style
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15, // Circle
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contentColumn: {
    flex: 1,
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    lineHeight: 26, // Better readability
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: 4,
  },
  actionButton: {
    padding: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  // Editing Styles
  editContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  input: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    fontSize: 16,
    minHeight: 100,
    padding: SPACING.xs,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.sm,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  saveText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
});
