export const COLORS = {
  // Brand Colors
  primary: '#F05A28', // Modern Orange
  primaryGradient: ['#FF8C42', '#F05A28'], // For LinearGradient
  accent: '#3B82F6', // Modern Blue

  // Backgrounds - Deep Space Theme
  background: '#0B0D12', // Deepest dark
  backgroundSecondary: '#161922', // Card / Sidebar
  backgroundTertiary: '#212530', // Inputs / Hovers
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#949BA6',
  textMuted: '#5E6573',
  textInverse: '#FFFFFF',
  
  // Status
  success: '#10B981', // Emerald
  error: '#EF4444', // Red 500
  warning: '#F59E0B', // Amber
  info: '#3B82F6', // Blue 500
  
  // Chat
  bubbleUserGradient: ['#FF8C42', '#F05A28'],
  bubbleAI: '#1E222B',
  
  // UI Elements
  border: '#2A2E38',
  borderLight: '#363B47',
  overlay: 'rgba(11, 13, 18, 0.85)',
};

export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 50,
  gutter: 20, 
};

export const BORDER_RADIUS = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 16,
  },
  primary: {
    shadowColor: '#F05A28',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  }
};
