import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";

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
        header: ({ navigation }) => (
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 30,
              paddingVertical: 12,
              backgroundColor: Colors[colorScheme ?? "light"].background,
            }}
          >
            <ThemedText type="title" style={{ fontSize: 20, display: "flex", gap: 6, alignContent: "center" }}>
              Smart Closet
              <MaterialCommunityIcons
                name="wardrobe-outline"
                size={24}
                color="black"
              />
            </ThemedText>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              
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
            <MaterialCommunityIcons name={focused ? "wardrobe" : "wardrobe-outline"} size={28} />
          ),
          tabBarIconStyle: { marginBottom: -4 },
        }}
      />
    </Tabs>
  );
}
