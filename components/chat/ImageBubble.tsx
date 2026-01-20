import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ImageBubbleProps {
  uri?: string;
  isLoading?: boolean;
  isUser?: boolean;
  onPress?: () => void;
}

export default function ImageBubble({ uri, isLoading, isUser, onPress }: ImageBubbleProps) {
  return (
    <View style={[styles.container, isUser ? styles.containerUser : styles.containerAI]}>
      <TouchableOpacity 
        style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]} 
        onPress={onPress}
        activeOpacity={0.9}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.textPrimary} />
            <Text style={styles.loadingText}>Génération...</Text>
          </View>
        ) : (
          uri && <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    maxWidth: '80%',
  },
  containerUser: {
    alignSelf: 'flex-end',
  },
  containerAI: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
    backgroundColor: COLORS.bubbleUser,
  },
  bubbleAI: {
    borderBottomLeftRadius: 4,
    backgroundColor: COLORS.bubbleAI,
  },
  image: {
    width: 250,
    height: 250,
  },
  loadingContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundTertiary,
  },
  loadingText: {
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    fontSize: 12,
  },
});
