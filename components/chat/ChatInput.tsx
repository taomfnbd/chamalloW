import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, Text, ScrollView, Keyboard } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONTS, SHADOWS, GLASS } from '../../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

interface Attachment {
  type: 'image' | 'document' | 'audio';
  uri: string;
  name: string;
  mimeType?: string;
  duration?: number;
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
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  // Web recording refs
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<any[]>([]);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      setRecordingDuration(0);
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);

  const stopRecording = async () => {
    if (Platform.OS === 'web') {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
      return;
    }

    if (!recording) return;
    
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const status = await recording.getStatusAsync();
      // @ts-ignore
      const duration = status.isLoaded ? status.durationMillis / 1000 : 0;

      setRecording(null);
      
      if (uri) {
        onSend('🎤 Message vocal', [{
          type: 'audio',
          uri,
          name: 'voice_message.m4a',
          mimeType: 'audio/m4a',
          duration
        }]);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const startRecording = async () => {
    if (Platform.OS === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        mediaRecorderRef.current.ondataavailable = (event: any) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // webm is safer for web
            const audioUrl = URL.createObjectURL(audioBlob);
            
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
              const base64data = (reader.result as string).split(',')[1];
              onSend('🎤 Message vocal', [{
                type: 'audio',
                uri: audioUrl,
                name: 'voice_message.webm',
                mimeType: 'audio/webm',
                duration: 0,
                // @ts-ignore
                base64: base64data 
              }]);
            };
          } catch (e) {
            console.error("Blob processing failed", e);
            onSend('Error: Could not process audio', []);
          }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Web recording error", err);
        alert("Erreur: Impossible d'accéder au microphone.");
      }
      return;
    }

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        
        setRecording(recording);
        setIsRecording(true);
      } else {
        alert("Permission microphone refusée");
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const handleSend = () => {
    if ((text.trim().length === 0 && attachments.length === 0) || isLoading) return;
    onSend(text.trim(), attachments);
    setText('');
    setAttachments([]);
    setInputHeight(50);
  };

  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const cancelRecording = async () => {
    if (Platform.OS === 'web') {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = null; // Prevent sending
        mediaRecorderRef.current.stop();
      }
    } else {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }
    }
    setIsRecording(false);
    setRecording(null);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      style={[styles.wrapper, { paddingBottom: isKeyboardVisible ? 12 : 90 }]}
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
          {isRecording ? (
            <TouchableOpacity onPress={cancelRecording} style={styles.iconButton}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <FontAwesome name="trash" size={16} color="#EF4444" />
              </View>
            </TouchableOpacity>
          ) : (
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
          )}
          
          {isRecording ? (
            <View style={styles.recordingContainer}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTimer}>{formatDuration(recordingDuration)}</Text>
              <Text style={styles.recordingHint}>Glisser pour annuler</Text>
            </View>
          ) : (
            <TextInput
              style={[
                styles.input,
                { height: Math.max(50, Math.min(inputHeight, 120)) },
                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
              ]}
              placeholder="Décris le post que tu veux..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              value={text}
              onChangeText={setText}
              onChange={(e) => {
                if (Platform.OS === 'web') {
                  const target = e.nativeEvent.target as any;
                  if (target) {
                    target.style.height = 'auto';
                    const newHeight = target.scrollHeight;
                    setInputHeight(newHeight);
                  }
                }
              }}
              onContentSizeChange={(e) => {
                if (Platform.OS !== 'web') {
                  setInputHeight(e.nativeEvent.contentSize.height);
                }
              }}
            />
          )}
          
          <TouchableOpacity 
            onPress={text.trim().length > 0 || attachments.length > 0 ? handleSend : handleMicPress}
            activeOpacity={0.8}
            style={styles.sendButtonWrapper}
          >
            {(text.trim().length > 0 || attachments.length > 0 || isRecording) ? (
              <LinearGradient
                colors={COLORS.primaryGradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButton}
              >
                <FontAwesome 
                  name={isLoading ? "circle-o-notch" : (isRecording ? "arrow-up" : "arrow-up")} 
                  size={16} 
                  color="#FFF" 
                />
              </LinearGradient>
            ) : (
              <View style={[styles.sendButton, styles.micButton]}>
                <FontAwesome 
                  name="microphone"
                  size={16} 
                  color={COLORS.textSecondary} 
                />
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
    paddingTop: SPACING.xs,
    backgroundColor: 'transparent',
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  attachmentPreview: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  attachmentContent: {
    gap: SPACING.sm,
    paddingRight: SPACING.md,
  },
  attachmentItem: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.backgroundTertiary,
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
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachMenu: {
    position: 'absolute',
    bottom: 90, 
    left: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xs,
    ...SHADOWS.large,
    zIndex: 100,
    minWidth: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  container: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 6,
  },
  iconButton: {
    padding: 4,
    marginBottom: 4,
    marginLeft: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
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
    paddingHorizontal: SPACING.md,
    paddingTop: 14,
    paddingBottom: 14,
    marginHorizontal: 4,
    // minHeight/maxHeight handled via props
  },
  sendButtonWrapper: {
    marginBottom: 4,
    marginRight: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    ...SHADOWS.primary,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    elevation: 0,
    shadowOpacity: 0,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: SPACING.sm,
  },
  recordingTimer: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginRight: SPACING.md,
    fontVariant: ['tabular-nums'],
  },
  recordingHint: {
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
  micButton: {
    backgroundColor: COLORS.backgroundTertiary,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
});
