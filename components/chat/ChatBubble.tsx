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
    marginVertical: SPACING.sm, // Tighter vertical spacing
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '100%',
    paddingHorizontal: SPACING.xs, // Slight breathing room
  },
  containerUser: {
    justifyContent: 'flex-end',
  },
  containerAI: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36, // Slightly larger
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    ...SHADOWS.small,
  },
  avatarAI: {
    backgroundColor: COLORS.backgroundSecondary,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  avatarUser: {
    backgroundColor: COLORS.backgroundTertiary,
    marginLeft: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  avatarText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    maxWidth: '78%', // Slightly wider
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
    fontSize: 15,
    lineHeight: 23, // Better readability
    letterSpacing: 0.2,
  },
  textUser: {
    color: COLORS.textInverse,
    fontWeight: '500', // Slightly bolder for contrast
  },
  textAI: {
    color: COLORS.textPrimary,
  },
  timestampUser: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
    alignSelf: 'flex-end',
    fontFamily: FONTS.medium,
  },
  timestampAI: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
    alignSelf: 'flex-start',
    fontFamily: FONTS.medium,
  },
});
