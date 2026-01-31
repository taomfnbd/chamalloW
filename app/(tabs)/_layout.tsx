import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { COLORS, FONTS, GLASS } from '../../constants/theme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          ...GLASS.heavy,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.select({ ios: 85, default: 65 }),
          paddingBottom: Platform.select({ ios: 28, default: 8 }),
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.medium,
          fontSize: 12,
        },
        headerShown: false,
        tabBarBackground: () => (
          // This is handled by tabBarStyle for simple glass effect, 
          // or we could use BlurView if we had expo-blur installed.
          // For now, relying on theme's GLASS properties.
          null 
        ),
      }}>
      <Tabs.Screen
        name="linkedin"
        options={{
          title: 'LinkedIn',
          tabBarIcon: ({ color }) => <TabBarIcon name="linkedin-square" color={color} />,
        }}
      />
      <Tabs.Screen
        name="instagram"
        options={{
          title: 'Instagram',
          tabBarIcon: ({ color }) => <TabBarIcon name="instagram" color={color} />,
        }}
      />
      <Tabs.Screen
        name="images"
        options={{
          title: 'Images',
          tabBarIcon: ({ color }) => <TabBarIcon name="image" color={color} />,
        }}
      />
    </Tabs>
  );
}
