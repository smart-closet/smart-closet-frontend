import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { Item, useItems } from "@/hooks/useItems";
import { ThemedText } from "@/components/ThemedText";

export default function AnalysisScreen() {
  const router = useRouter();
  const { getItems } = useItems();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title="My Home" hasGoBackBtn></Header>

        <Text style={styles.sectionTitle}>👍 Top 5 Frequently Wear Clothes</Text>

        {items.slice(0, 3).map((item, index) => (
          <ThemedView key={index} style={styles.suggestionItem}>
            <ThemedView style={styles.outfitDetails}>
              <ThemedView style={styles.outfitItemContainer}>
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.outfitImage}
                />
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        ))}

        <Text style={styles.sectionTitle}>😿 Top 5 Unworn Clothes</Text>
        {items.slice(items.length - 4, items.length - 1).map((item, index) => (
          <ThemedView key={index} style={styles.suggestionItem}>
            <ThemedView style={styles.outfitDetails}>
              <ThemedView style={styles.outfitItemContainer}>
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.outfitImage}
                />
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  suggestionItem: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingBottom: 16,
  },
  outfitDetails: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  outfitItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  outfitImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 8,
  },
});
