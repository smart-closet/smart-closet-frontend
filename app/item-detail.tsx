import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Item, useItems } from "@/hooks/useItems";

const ImageDetailScreen = () => {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { getItem } = useItems();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const fetchedItem = await getItem(parseInt(itemId, 10));
        setItem(fetchedItem);
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [itemId]);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!item) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          Failed to load item details.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} />
        <ThemedText style={styles.backText}>Back</ThemedText>
      </TouchableOpacity>

      <Image source={{ uri: item.image_url }} style={styles.image} />
      <ThemedText style={styles.title}>{item.name}</ThemedText>

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoLabel}>Category</ThemedText>
        <ThemedText style={styles.infoValue}>{item.category.name}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoLabel}>Attributes</ThemedText>
        {item.attributes && item.attributes.length > 0 && (
          <ThemedView>
            <View style={styles.badgeContainer}>
              {item.attributes.map((attribute, index) => (
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
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
