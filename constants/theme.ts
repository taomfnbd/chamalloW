export const COLORS = {
  // Brand Colors
  primary: '#F05A28', // Modern Orange
  primaryGradient: ['#FF8C42', '#F05A28'], // For LinearGradient
  accent: '#3B82F6', // Modern Blue
  secondaryAccent: '#8B5CF6', // Violet for variety

  // Backgrounds - Deep Space Theme
  background: '#0F1117', // Richer dark
  backgroundSecondary: '#1A1D26', // Card / Sidebar
  backgroundTertiary: '#242835', // Inputs / Hovers
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF', // Cool gray
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',
  
  // Status
  success: '#10B981', // Emerald
  error: '#EF4444', // Red 500
  warning: '#F59E0B', // Amber
  info: '#3B82F6', // Blue 500
  
  // Chat
  bubbleUserGradient: ['#F05A28', '#E04F1F'], // Slightly more subtle gradient
  bubbleAI: '#1A1D26',
  
  // UI Elements
  border: '#2E3340',
  borderLight: '#374151',
  overlay: 'rgba(15, 17, 23, 0.85)',
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
  gutter: 20, 
};

export const BORDER_RADIUS = {
  xs: 6,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  primary: {
    shadowColor: '#F05A28',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  }
};

// Glassmorphism helper for Web/CSS
export const GLASS = {
  default: {
    backgroundColor: 'rgba(26, 29, 38, 0.7)',
    backdropFilter: 'blur(10px)', // Web only
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
  },
  heavy: {
    backgroundColor: 'rgba(15, 17, 23, 0.9)',
    backdropFilter: 'blur(20px)', // Web only
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
  }
};
