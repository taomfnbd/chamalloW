import React from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { GeneratedImage } from '../../types';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  selectedId?: string;
}

export default function ImageGallery({ images, onSelect, selectedId }: ImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {images.map(image => (
          <TouchableOpacity
            key={image.id}
            onPress={() => onSelect(image)}
            style={[styles.item, selectedId === image.id && styles.itemSelected]}
          >
            <Image source={{ uri: image.uri }} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  item: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.small,
  },
  itemSelected: {
    borderColor: COLORS.primary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
