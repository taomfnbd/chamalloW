import React from 'react';
import { StyleSheet, StatusBar, Platform, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: any;
}

export default function ScreenLayout({ children, style }: ScreenLayoutProps) {
  return (
    <View style={styles.backgroundWrapper}>
      {/* Subtle background glow */}
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundModal]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
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
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundWrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    width: '100%',
  },
});
