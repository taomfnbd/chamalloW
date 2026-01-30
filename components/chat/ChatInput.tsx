import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, Text, ScrollView, Alert } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';

interface Attachment {
  type: 'image' | 'document';
  uri: string;
  name: string;
  mimeType?: string;
}

interface ChatInputProps {
  onSend: (message: string, attachments?: Attachment[]) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(50);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const handleSend = () => {
    if ((text.trim().length === 0 && attachments.length === 0) || isLoading) return;
    onSend(text.trim(), attachments);
    setText('');
    setAttachments([]);
    setInputHeight(50);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setAttachments(prev => [...prev, {
        type: 'image',
        uri: asset.uri,
        name: asset.fileName || 'image.jpg',
        mimeType: asset.mimeType
      }]);
      setShowAttachMenu(false);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setAttachments(prev => [...prev, {
        type: 'document',
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType
      }]);
      setShowAttachMenu(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.wrapper}
    >
      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <ScrollView horizontal style={styles.attachmentPreview} contentContainerStyle={styles.attachmentContent}>
          {attachments.map((att, index) => (
            <View key={index} style={styles.attachmentItem}>
              {att.type === 'image' ? (
                <Image source={{ uri: att.uri }} style={styles.thumb} />
              ) : (
                <View style={styles.docThumb}>
                  <FontAwesome name="file-text-o" size={24} color={COLORS.textPrimary} />
                </View>
              )}
              <TouchableOpacity 
                style={styles.removeButton} 
                onPress={() => removeAttachment(index)}
              >
                <FontAwesome name="times" size={10} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Attachment Menu */}
      {showAttachMenu && (
        <View style={styles.attachMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={pickImage}>
            <View style={[styles.menuIcon, { backgroundColor: '#E1306C' }]}>
              <FontAwesome name="image" size={16} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={pickDocument}>
            <View style={[styles.menuIcon, { backgroundColor: '#0077B5' }]}>
              <FontAwesome name="file-text" size={16} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Document</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.container}>
        <View style={styles.inputRow}>
          <TouchableOpacity 
            onPress={() => setShowAttachMenu(!showAttachMenu)} 
            style={styles.iconButton}
          >
            <View style={[styles.iconCircle, showAttachMenu && styles.iconCircleActive]}>
              <FontAwesome 
                name={showAttachMenu ? "times" : "plus"} 
                size={16} 
                color={showAttachMenu ? COLORS.textPrimary : COLORS.textSecondary} 
              />
            </View>
          </TouchableOpacity>
          
          <TextInput
            style={[styles.input, { height: Math.max(50, Math.min(inputHeight, 120)) }]}
            placeholder="Décris le post que tu veux..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            value={text}
            onChangeText={setText}
            onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)}
          />
          
          <TouchableOpacity 
            onPress={handleSend} 
            disabled={(text.trim().length === 0 && attachments.length === 0) || isLoading}
            activeOpacity={0.8}
            style={styles.sendButtonWrapper}
          >
            {(text.trim().length > 0 || attachments.length > 0) ? (
              <LinearGradient
                colors={COLORS.primaryGradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButton}
              >
                <FontAwesome 
                  name={isLoading ? "circle-o-notch" : "arrow-up"} 
                  size={16} 
                  color="#FFF" 
                />
              </LinearGradient>
            ) : (
              <View style={[styles.sendButton, styles.sendButtonDisabled]}>
                <FontAwesome name="arrow-up" size={16} color={COLORS.textMuted} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: 'transparent',
  },
  attachmentPreview: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
    marginLeft: SPACING.md,
  },
  attachmentContent: {
    gap: SPACING.sm,
    paddingRight: SPACING.md,
  },
  attachmentItem: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundSecondary,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  docThumb: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachMenu: {
    position: 'absolute',
    bottom: 70, // Above input
    left: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  menuIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: 14,
    minWidth: 80,
  },
  container: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.xs,
  },
  iconButton: {
    padding: SPACING.xs,
    marginBottom: 4,
    marginLeft: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: COLORS.textPrimary,
    transform: [{ rotate: '45deg' }]
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    fontSize: 16,
    paddingHorizontal: SPACING.sm,
    paddingTop: 14,
    paddingBottom: 14,
    marginHorizontal: 4,
  },
  sendButtonWrapper: {
    marginBottom: 4,
    marginRight: 4,
  },
  sendButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    ...SHADOWS.primary,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.backgroundTertiary,
    elevation: 0,
    shadowOpacity: 0,
  },
});
