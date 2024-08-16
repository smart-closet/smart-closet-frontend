import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
          backgroundColor: Colors[colorScheme ?? "light"].background,
          // borderTopWidth: 0,
          height: 40
        },
        header: ({ navigation }) => (
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: Colors[colorScheme ?? "light"].background,
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
