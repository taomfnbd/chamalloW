import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { ChatProvider, useChatContext } from '../contexts/ChatContext';
import Toast from '../components/ui/Toast';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) console.error("Font loading error:", error);
  }, [error]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SafeAreaProvider>
      <ChatProvider>
        <ThemeProvider value={DarkTheme}>
          <StatusBar style="light" />
          <AppContent />
        </ThemeProvider>
      </ChatProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { error } = useChatContext();
  
  // Structure responsive unifiée : 
  // Sur mobile : plein écran.
  // Sur desktop : plein écran aussi ("normal"), mais on peut limiter la largeur du contenu 
  // pour la lisibilité si nécessaire via les composants eux-mêmes, ou ici globalement.
  // Pour l'instant, on laisse plein écran comme demandé ("normal").
  
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Stack screenOptions={{
        headerShown: false,
        // Optionnel : Limiter la largeur max du contenu sur les très grands écrans
        // contentStyle: { maxWidth: 1200, width: '100%', alignSelf: 'center' } 
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toast message={error} />
    </View>
  );
}
