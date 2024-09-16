import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].text,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: 54,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          bottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? "home" : "home-outline"} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? "add-circle" : "add-circle-outline"} />
          ),
        }}
      />
      <Tabs.Screen
        name="outfit"
        options={{
          title: "Outfit",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? "shirt" : "shirt-outline"} />
          ),
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          title: "Closet",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "wardrobe" : "wardrobe-outline"}
              size={28}
            />
          ),
          tabBarIconStyle: { marginBottom: -4 },
        }}
      />
    </Tabs>
  );
}
