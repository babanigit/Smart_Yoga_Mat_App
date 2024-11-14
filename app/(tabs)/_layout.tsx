// app/(tabs)_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute", // transparent background for iOS
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ControlPanel"
        options={{
          title: "Control Panel",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="settings-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Music"
        options={{
          title: "Music",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="musical-notes-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ProductShowcase"
        options={{
          title: "Product Showcase",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="pricetag-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Connect"
        options={{
          title: "Connect",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="wifi-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="AnalyticsOverview"
        options={{
          title: "Analytics Overview",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="bar-chart-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="OTAUpdate"
        options={{
          title: "OTA Updates",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="cloud-download-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
