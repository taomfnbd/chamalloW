import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { GeneratedImage } from '../../types';
import Button from '../ui/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ImageGeneratorProps {
  onGenerate: (prompt: string, style: string, format: string) => void;
  isGenerating: boolean;
  currentImage?: GeneratedImage;
}

const STYLES = ['Réaliste', 'Artistique', 'Minimaliste', 'Cyberpunk', 'Studio'];
const FORMATS = [
  { label: 'Carré', value: '1:1', icon: 'square-o' },
  { label: 'Portrait', value: '4:5', icon: 'mobile' },
  { label: 'Paysage', value: '16:9', icon: 'desktop' },
];

export default function ImageGenerator({ onGenerate, isGenerating, currentImage }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0].value);

  const handleGenerate = () => {
    if (prompt.trim().length === 0) return;
    onGenerate(prompt, selectedStyle, selectedFormat);
  };

  return (
    <View style={styles.container}>
      {/* Main Image Display */}
      <View style={styles.imageDisplay}>
        {currentImage ? (
          <Image source={{ uri: currentImage.uri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <FontAwesome name="image" size={48} color={COLORS.textMuted} />
            <Text style={styles.placeholderText}>Générez une image pour commencer</Text>
          </View>
        )}
        {isGenerating && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Création en cours...</Text>
          </View>
        )}
        {currentImage && (
          <View style={styles.imageInfo}>
            <Text style={styles.dimensions}>
              {selectedFormat === '1:1' ? '1024 x 1024' : selectedFormat === '4:5' ? '1080 x 1350' : '1920 x 1080'}
            </Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.settingsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleScroll}>
            {STYLES.map(style => (
              <TouchableOpacity
                key={style}
                style={[styles.styleChip, selectedStyle === style && styles.styleChipActive]}
                onPress={() => setSelectedStyle(style)}
              >
                <Text style={[styles.styleText, selectedStyle === style && styles.styleTextActive]}>
                  {style}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formatRow}>
          {FORMATS.map(format => (
            <TouchableOpacity
              key={format.value}
              style={[styles.formatButton, selectedFormat === format.value && styles.formatButtonActive]}
              onPress={() => setSelectedFormat(format.value)}
            >
              <FontAwesome 
                name={format.icon as any} 
                size={16} 
                color={selectedFormat === format.value ? COLORS.textPrimary : COLORS.textSecondary} 
              />
              <Text style={[styles.formatText, selectedFormat === format.value && styles.formatTextActive]}>
                {format.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Un coach musclé avec kettlebell..."
            placeholderTextColor={COLORS.textMuted}
            value={prompt}
            onChangeText={setPrompt}
            multiline
          />
          <TouchableOpacity 
            style={[styles.generateButton, (!prompt.trim() || isGenerating) && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            <FontAwesome name="magic" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageDisplay: {
    aspectRatio: 1, // Default square
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: BORDER_RADIUS.lg,
    margin: SPACING.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  placeholderText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.medium,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.primary,
    marginTop: SPACING.md,
    fontFamily: FONTS.bold,
  },
  imageInfo: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  dimensions: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  controls: {
    padding: SPACING.md,
  },
  settingsRow: {
    marginBottom: SPACING.md,
  },
  styleScroll: {
    flexGrow: 0,
  },
  styleChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.backgroundTertiary,
  },
  styleChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  styleText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  styleTextActive: {
    color: COLORS.textPrimary,
  },
  formatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
  },
  formatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.xs,
  },
  formatButtonActive: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  formatText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  formatTextActive: {
    color: COLORS.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    minHeight: 50,
  },
  generateButton: {
    backgroundColor: COLORS.primary,
    width: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: COLORS.backgroundTertiary,
    opacity: 0.5,
  },
});
