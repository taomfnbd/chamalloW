export const COLORS = {
  // Brand Colors
  primary: '#FF5722', // Deep Orange - High Energy
  primaryDark: '#E64A19',
  primaryLight: '#FF8A65',
  accent: '#2979FF', // Electric Blue for contrast

  // Backgrounds
  background: '#0F1115', // Very dark blue/grey
  backgroundSecondary: '#181B21', // Card background
  backgroundTertiary: '#23262E', // Input/Hover background
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A3BD',
  textMuted: '#6E7191',
  textInverse: '#0F1115',
  
  // Status
  success: '#00C853',
  error: '#FF3D00',
  warning: '#FFD600',
  info: '#2979FF',
  
  // Chat
  bubbleUser: '#FF5722',
  bubbleAI: '#23262E',
  
  // UI Elements
  border: '#2E323B',
  borderLight: '#3F4451',
  overlay: 'rgba(15, 17, 21, 0.85)',
};

export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  gutter: 20, // Standard screen padding
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
  primary: {
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10, // Android (color shadow not supported natively well but elevation works)
  }
};
