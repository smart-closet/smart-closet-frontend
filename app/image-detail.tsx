import React from "react";
import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Item } from "@/hooks/useItems";

const ImageDetailScreen = () => {
  const router = useRouter();
  const { item } = useLocalSearchParams<{ item: string }>();
  const parsedItem: Item = JSON.parse(decodeURIComponent(item));

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} />
        <ThemedText style={styles.backText}>Back</ThemedText>
      </TouchableOpacity>

      
      <Image source={{ uri: parsedItem.image_url }} style={styles.image} />
      <ThemedText style={styles.title}>{parsedItem.name}</ThemedText>

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoLabel}>Category</ThemedText>
        <ThemedText style={styles.infoValue}>
          {parsedItem.category.name}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoLabel}>Attributes</ThemedText>
        {parsedItem.attributes && parsedItem.attributes.length > 0 && (
          <ThemedView>
            <View style={styles.badgeContainer}>
              {parsedItem.attributes.map((attribute, index) => (
                <View key={index} style={styles.badge}>
                  <ThemedText style={styles.badgeText}>
                    {attribute.value}
                  </ThemedText>
                </View>
              ))}
            </View>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  infoValue: {
    fontSize: 16,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontSize: 14,
  },
});

export default ImageDetailScreen;
