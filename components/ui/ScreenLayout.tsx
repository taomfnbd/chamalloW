import React from 'react';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { COLORS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: any;
}

export default function ScreenLayout({ children, style }: ScreenLayoutProps) {
  // On web, we might not want top safe area if we want to go edge-to-edge
  // or if the browser chrome is already handling spacing.
  // However, usually SafeAreaView handles web correctly if configured.
  // We'll keep it but ensure style overrides are possible and valid.
  return (
    <SafeAreaView 
      edges={Platform.OS === 'web' ? ['left', 'right'] : ['top', 'left', 'right']} 
      style={[
        styles.container, 
        Platform.OS === 'web' ? { paddingTop: 'env(safe-area-inset-top)' } : {},
        style
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  },
});
