import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].text,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: useThemeColor(
            {
              light: Colors["light"].background,
              dark: Colors["dark"].background,
            },
            "background"
          ),
          borderTopWidth: 0,
        },
        header: ({ navigation }) => (
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: useThemeColor(
                {
                  light: Colors["light"].background,
                  dark: Colors["dark"].background,
                },
                "background"
              ),
            }}
          >
            <ThemedText type="title" style={{fontSize: 20}}>My Closet</ThemedText>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Ionicons
                name="search-outline"
                size={24}
              />
            </TouchableOpacity>
          </ThemedView>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="outfit"
        options={{
          title: "Outfit",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "shirt" : "shirt-outline"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
