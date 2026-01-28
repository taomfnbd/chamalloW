import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Message } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[
      styles.container,
      isUser ? styles.containerUser : styles.containerAI
    ]}>
      {!isUser && (
        <View style={[styles.avatar, styles.avatarAI]}>
          <FontAwesome name="bolt" size={14} color={COLORS.primary} />
        </View>
      )}
      
      <View style={[
        styles.bubble,
        isUser ? styles.bubbleUser : styles.bubbleAI
      ]}>
        <Text style={[
          styles.text,
          isUser ? styles.textUser : styles.textAI
        ]}>
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isUser ? { color: 'rgba(255,255,255,0.7)' } : {}]}>
          {format(message.timestamp, 'HH:mm', { locale: fr })}
        </Text>
      </View>

      {isUser && (
        <View style={[styles.avatar, styles.avatarUser]}>
          <Text style={styles.avatarText}>R</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md, // More spacing for modern look
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '100%',
  },
  containerUser: {
    justifyContent: 'flex-end',
  },
  containerAI: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...SHADOWS.small,
  },
  avatarAI: {
    backgroundColor: COLORS.backgroundSecondary,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarUser: {
    backgroundColor: COLORS.primary, // Make user avatar pop
    marginLeft: SPACING.sm,
  },
  avatarText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  bubble: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 24,
    maxWidth: '78%',
    ...SHADOWS.medium, // Better shadow depth
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4, // Subtle tail
  },
  bubbleAI: {
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomLeftRadius: 4, // Subtle tail
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  textUser: {
    color: '#FFF',
  },
  textAI: {
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 6,
    alignSelf: 'flex-end',
    opacity: 0.8,
  },
});
