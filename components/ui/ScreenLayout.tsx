import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: any;
}

export default function ScreenLayout({ children, style }: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }, style]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
