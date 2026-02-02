import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, GLASS } from '../../constants/theme';
import { Message } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import VoiceMessagePlayer from './VoiceMessagePlayer';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const isEmptyResponse = message.content === '{}' || message.content === '[{}]' || message.content === '[]';
  const displayContent = isEmptyResponse ? "⚠️ Réponse vide du serveur. Vérifiez n8n." : message.content;

  return (
    <View style={[
      styles.container,
      isUser ? styles.containerUser : styles.containerAI
    ]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.avatarImage} 
            resizeMode="contain"
          />
        </View>
      )}
      
      {isUser ? (
        <LinearGradient
          colors={COLORS.bubbleUserGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.bubbleUser]}
        >
          {(message.attachments?.length && (message.attachments.find(a => a.type === 'audio') || message.content === '🎤 Message vocal')) ? (
            <VoiceMessagePlayer 
              uri={message.attachments.find(a => a.type === 'audio')?.uri || message.attachments[0].uri} 
              duration={message.attachments.find(a => a.type === 'audio')?.duration || message.attachments[0].duration}
              isUser={isUser}
            />
          ) : (
            <View>
              <Text style={[styles.text, styles.textUser]}>
                {displayContent}
              </Text>
              {message.content === '🎤 Message vocal' && !message.attachments?.length && (
                <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontStyle: 'italic' }}>
                  (Audio manquant - Réessayez)
                </Text>
              )}
            </View>
          )}
          <Text style={styles.timestampUser}>
            {format(message.timestamp, 'HH:mm', { locale: fr })}
          </Text>
        </LinearGradient>
      ) : (
        <View style={styles.contentAI}>
          <Text style={[styles.text, styles.textAI, isEmptyResponse && styles.textError]}>
            {displayContent}
          </Text>
          {/* AI messages might not need visible timestamp in ChatGPT style, or it can be subtle below */}
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
    marginVertical: 12, // More breathing room
    flexDirection: 'row',
    maxWidth: '100%',
    paddingHorizontal: SPACING.md,
  },
  containerUser: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  containerAI: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarAI: {
    // Deprecated style kept for safety if needed, but replaced by avatarContainer
    width: 32,
    height: 32,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 20,
    height: 20,
  },
  avatarUser: {
    backgroundColor: 'rgba(240, 90, 40, 0.1)',
    marginLeft: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(240, 90, 40, 0.2)',
    borderRadius: 14, // Squircle-ish
  },
  avatarText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  bubble: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 22,
    maxWidth: '85%',
    ...SHADOWS.small,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2, // Slightly stronger shadow
    shadowRadius: 8,
  },
  contentAI: {
    flex: 1,
    paddingVertical: 4,
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 26, // Better readability
    letterSpacing: 0.3,
  },
  textUser: {
    color: '#FFF',
    fontWeight: '500',
  },
  textAI: {
    color: COLORS.textPrimary,
  },
  textError: {
    color: COLORS.error,
    fontStyle: 'italic',
  },
  timestampUser: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
    fontFamily: FONTS.medium,
  },
  timestampAI: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    alignSelf: 'flex-start',
    fontFamily: FONTS.medium,
  },
});
