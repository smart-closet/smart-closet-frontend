import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Item, useItems } from "@/hooks/useItems";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

interface CardProps {
  title: string;
  iconName: string;
  items: Item[];
}

const Card: React.FC<CardProps> = ({ title, iconName, items }) => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isDarkMode = colorScheme === "dark";

  return (
    <ThemedView style={styles.cardContainer}>
      <ThemedView style={[styles.card, isDarkMode && styles.cardDark]}>
        <ThemedView style={styles.cardHeader}>
          <Ionicons name={iconName as any} size={28} style={styles.cardIcon} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            {title}
          </ThemedText>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDarkMode ? "#A1A1A6" : "#8E8E93"}
          />
        </ThemedView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ThemedView style={styles.imageContainer}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  router.push({
                    pathname: "/item-detail",
                    params: { itemId: encodeURIComponent(JSON.stringify(item.id)) },
                  })
                }
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.cardImage}
                />
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const items = useSelector((state: RootState) => state.items);

  const categories = [
    {
      title: "Tops",
      iconName: "shirt-outline",
      items: items.filter((item) => item.category.name === "top"),
    },
    {
      title: "Bottoms",
      iconName: "cut-outline",
      items: items.filter((item) => item.category.name === "bottom"),
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Header title="My Closet" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {categories.map((category, index) => (
          <Card key={index} {...category} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  },
  cardContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#F0F0F5",
    borderRadius: 12,
    padding: 16,
  },
  cardDark: {
    backgroundColor: "#1C1C1E",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  cardIcon: {
    marginRight: 16,
  },
  cardTitle: {
    flex: 1,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    gap: 8,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 0,
  },
});
