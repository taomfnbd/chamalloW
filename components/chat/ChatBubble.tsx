import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Message } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

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
          <FontAwesome name="bolt" size={12} color={COLORS.primary} />
        </View>
      )}
      
      {isUser ? (
        <LinearGradient
          colors={COLORS.bubbleUserGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.bubbleUser]}
        >
          <Text style={[styles.text, styles.textUser]}>
            {message.content}
          </Text>
          <Text style={styles.timestampUser}>
            {format(message.timestamp, 'HH:mm', { locale: fr })}
          </Text>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.bubbleAI]}>
          <Text style={[styles.text, styles.textAI]}>
            {message.content}
          </Text>
          <Text style={styles.timestampAI}>
            {format(message.timestamp, 'HH:mm', { locale: fr })}
          </Text>
        </View>
      )}

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
    marginVertical: SPACING.md,
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
    width: 32,
    height: 32,
    borderRadius: 12,
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
    backgroundColor: COLORS.backgroundTertiary, // Subtle for user avatar since bubble is colorful
    marginLeft: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: '75%',
    ...SHADOWS.small,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: 15, // Slightly smaller for modern feel
    lineHeight: 22,
  },
  textUser: {
    color: '#FFF',
  },
  textAI: {
    color: COLORS.textPrimary,
  },
  timestampUser: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampAI: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
});
