import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface PostPreviewProps {
  platform: 'linkedin' | 'instagram';
  content: string;
  imageUri?: string;
}

// Placeholder for Rudy's profile picture
const PROFILE_PIC = require('../../assets/images/rudy.jpeg');

export default function PostPreview({ platform, content, imageUri }: PostPreviewProps) {
  if (platform === 'linkedin') {
    return <LinkedInPreview content={content} imageUri={imageUri} />;
  } else if (platform === 'instagram') {
    return <InstagramPreview content={content} imageUri={imageUri} />;
  }
  return null;
}

const LinkedInPreview = ({ content, imageUri }: { content: string, imageUri?: string }) => (
  <View style={styles.liContainer}>
    {/* Header */}
    <View style={styles.liHeader}>
      <Image source={PROFILE_PIC} style={styles.avatarImage} />
      <View style={styles.liMeta}>
        <Text style={styles.liName}>Rudy Morel</Text>
        <Text style={styles.liHeadline}>Coach Sportif 🚀 | Transformation Physique & Mentale</Text>
        <Text style={styles.liTime}>1h • <FontAwesome name="globe" size={10} /></Text>
      </View>
    </View>

    {/* Content */}
    <Text style={styles.liContent}>
      {content}
    </Text>

    {/* Image if any */}
    {imageUri && (
      <View style={styles.imagePlaceholder}>
        <Text style={{color: '#999'}}>Image du post</Text>
      </View>
    )}

    {/* Footer */}
    <View style={styles.liFooter}>
      <View style={styles.liStat}>
        <FontAwesome name="thumbs-up" size={12} color="#0077B5" />
        <Text style={styles.liStatText}> 42</Text>
      </View>
      <View style={styles.liActions}>
        <Action icon="thumbs-o-up" label="J'aime" />
        <Action icon="comment-o" label="Commenter" />
        <Action icon="share" label="Diffuser" />
        <Action icon="send-o" label="Envoyer" />
      </View>
    </View>
  </View>
);

const InstagramPreview = ({ content, imageUri }: { content: string, imageUri?: string }) => (
  <View style={styles.igContainer}>
    {/* Header */}
    <View style={styles.igHeader}>
      <View style={styles.row}>
        <Image source={PROFILE_PIC} style={styles.avatarImageSmall} />
        <Text style={styles.igName}>rudy_morel</Text>
      </View>
      <FontAwesome name="ellipsis-h" size={12} color={COLORS.textPrimary} />
    </View>

    {/* Image Area */}
    <View style={styles.igImage}>
       <FontAwesome name="image" size={48} color={COLORS.border} />
    </View>

    {/* Actions */}
    <View style={styles.igActions}>
      <View style={styles.row}>
        <FontAwesome name="heart-o" size={22} color={COLORS.textPrimary} style={styles.igIcon} />
        <FontAwesome name="comment-o" size={22} color={COLORS.textPrimary} style={styles.igIcon} />
        <FontAwesome name="paper-plane-o" size={22} color={COLORS.textPrimary} style={styles.igIcon} />
      </View>
      <FontAwesome name="bookmark-o" size={22} color={COLORS.textPrimary} />
    </View>

    {/* Likes */}
    <Text style={styles.igLikes}>Aimé par athlete_pro et autres</Text>

    {/* Caption */}
    <Text style={styles.igCaption}>
      <Text style={styles.igName}>rudy_morel</Text> {content}
    </Text>
  </View>
);

const Action = ({ icon, label }: any) => (
  <View style={styles.liAction}>
    <FontAwesome name={icon} size={14} color="#666" />
    <Text style={styles.liActionText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  // LinkedIn Styles
  liContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    width: '100%',
  },
  liHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
    backgroundColor: '#E0E0E0',
  },
  liMeta: {
    justifyContent: 'center',
    flex: 1,
  },
  liName: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#000',
  },
  liHeadline: {
    fontSize: 11,
    color: '#666',
  },
  liTime: {
    fontSize: 10,
    color: '#666',
  },
  liContent: {
    fontSize: 13,
    color: '#000',
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  liFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: SPACING.sm,
  },
  liStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  liStatText: {
    fontSize: 11,
    color: '#666',
  },
  liActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
  },
  liAction: {
    alignItems: 'center',
  },
  liActionText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    fontFamily: FONTS.medium,
  },

  // Instagram Styles
  igContainer: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingBottom: SPACING.md,
    marginTop: SPACING.sm,
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
  },
  igHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImageSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: SPACING.xs,
    backgroundColor: '#333',
  },
  igName: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  igImage: {
    height: 200,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  igActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.sm,
  },
  igIcon: {
    marginRight: SPACING.md,
  },
  igLikes: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontSize: 12,
    paddingHorizontal: SPACING.sm,
    marginBottom: 4,
  },
  igCaption: {
    color: '#FFF',
    fontSize: 12,
    paddingHorizontal: SPACING.sm,
    lineHeight: 16,
  },
});
