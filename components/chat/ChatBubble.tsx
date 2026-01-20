import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { Message } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      </View>
      <Text style={styles.timestamp}>
        {format(message.timestamp, 'HH:mm', { locale: fr })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    maxWidth: '85%',
  },
  containerUser: {
    alignSelf: 'flex-end',
  },
  containerAI: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: 20, // More rounded
    minWidth: 60,
  },
  bubbleUser: {
    backgroundColor: COLORS.bubbleUser,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: COLORS.bubbleAI,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  textUser: {
    color: COLORS.textPrimary,
  },
  textAI: {
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
    marginHorizontal: 4,
  },
});
