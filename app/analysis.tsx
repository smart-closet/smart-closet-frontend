import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function AnalysisScreen() {
  const items = useSelector((state: RootState) => state.items);

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
