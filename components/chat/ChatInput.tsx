import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ChatInputProps {
  onSend: (message: string) => void;
  onAttach?: () => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, onAttach, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim().length === 0 || isLoading) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={onAttach} style={styles.attachButton}>
          <FontAwesome name="paperclip" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Écris ton message..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          value={text}
          onChangeText={setText}
        />
        
        <TouchableOpacity 
          onPress={handleSend} 
          style={[
            styles.sendButton,
            text.trim().length > 0 ? styles.sendButtonActive : {}
          ]}
          disabled={text.trim().length === 0 || isLoading}
        >
          <FontAwesome 
            name="paper-plane" 
            size={18} 
            color={text.trim().length > 0 ? COLORS.textPrimary : COLORS.textMuted} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    padding: SPACING.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.xs,
    paddingRight: SPACING.sm,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  attachButton: {
    padding: SPACING.sm,
    marginRight: 0,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingTop: SPACING.sm, // Fix for multiline vertical alignment
    fontFamily: FONTS.regular,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.backgroundTertiary,
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
});
