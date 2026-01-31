import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Platform, Alert, Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ImageBubbleProps {
  uri?: string;
  isLoading?: boolean;
  isUser?: boolean;
  onPress?: () => void;
}

export default function ImageBubble({ uri, isLoading, isUser, onPress }: ImageBubbleProps) {
  const handleCopy = async () => {
    if (!uri) return;
    try {
      if (Platform.OS === 'web') {
        await Clipboard.setStringAsync(uri);
        // @ts-ignore
        if (window.confirm) window.confirm('Lien de l\'image copié !');
      } else {
        const filename = uri.split('/').pop() || 'image.jpg';
        // Check if cacheDirectory is available (it should be on native)
        // @ts-ignore
        if (FileSystem.cacheDirectory) {
            // @ts-ignore
            const localUri = FileSystem.cacheDirectory + filename;
            await FileSystem.downloadAsync(uri, localUri);
            const base64 = await FileSystem.readAsStringAsync(localUri, { encoding: 'base64' });
            await Clipboard.setImageAsync(base64);
            Alert.alert('Succès', 'Image copiée');
        } else {
             // Fallback if cacheDirectory is somehow missing
             await Clipboard.setStringAsync(uri);
             Alert.alert('Copié', 'Lien de l\'image copié');
        }
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de copier l\'image');
    }
  };

  const handleDownload = async () => {
    if (!uri) return;
    try {
      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = uri;
        link.download = 'generated-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback to opening URL in browser for saving
        Linking.openURL(uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de télécharger');
    }
  };

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
          uri && (
            <View>
              <Image source={{ uri }} style={styles.image} resizeMode="cover" />
              <View style={styles.actionsBar}>
                <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
                  <FontAwesome name="copy" size={16} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDownload} style={styles.actionButton}>
                  <FontAwesome name="download" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          )
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
  actionsBar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  actionButton: {
    padding: 8,
    marginLeft: SPACING.xs,
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
