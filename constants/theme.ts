import { Platform } from 'react-native';

export const COLORS = {
  // Brand Colors - Modern & Vibrant
  primary: '#F05A28', // Core Orange
  primaryLight: '#FF8A65',
  primaryDark: '#D64010',
  primaryGradient: ['#FF6B35', '#F05A28'], // Warmer, smoother gradient
  
  accent: '#3B82F6', // Modern Blue
  secondaryAccent: '#8B5CF6', // Purple
  tertiaryAccent: '#10B981', // Emerald

  // Backgrounds - Deep Premium Dark (Zinc-based)
  background: '#09090B', // Zinc-950 - Richer dark
  backgroundSecondary: '#18181B', // Zinc-900 - Cards/Surfaces
  backgroundTertiary: '#27272A', // Zinc-800 - Inputs/Hovers
  backgroundModal: '#121214',
  
  // Text
  textPrimary: '#FAFAFA', // Zinc-50 - Crisp white
  textSecondary: '#A1A1AA', // Zinc-400 - Readable gray
  textMuted: '#71717A', // Zinc-500 - Subtler
  textInverse: '#FFFFFF',
  
  // Status
  success: '#10B981', // Emerald-500
  error: '#EF4444', // Red-500
  warning: '#F59E0B', // Amber-500
  info: '#3B82F6', // Blue-500
  
  // Chat Specifics
  bubbleUserGradient: ['#FF6B35', '#F05A28'], 
  bubbleUser: '#F05A28', // Fallback solid color
  bubbleAI: 'rgba(39, 39, 42, 0.6)', // Zinc-800 with opacity
  
  // UI Elements
  border: 'rgba(255, 255, 255, 0.08)', 
  borderLight: 'rgba(255, 255, 255, 0.12)',
  overlay: 'rgba(9, 9, 11, 0.8)',
};

export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  gutter: 20, 
};

export const BORDER_RADIUS = {
  xs: 8, 
  sm: 12,
  md: 16, // Standardized to 16 for cards
  lg: 24,
  xl: 32,
  xxl: 48,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  primary: {
    shadowColor: '#F05A28',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  }
};

// Premium Glassmorphism - Refined
export const GLASS = {
  default: {
    backgroundColor: 'rgba(24, 24, 27, 0.7)', // Based on Zinc-900
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      },
      default: {}
    }),
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
  },
  heavy: {
    backgroundColor: 'rgba(9, 9, 11, 0.85)', // Based on Zinc-950
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      },
      default: {}
    }),
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
  },
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      },
      default: {}
    }),
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
  },
  pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      },
      default: {}
    }),
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
  }
};
