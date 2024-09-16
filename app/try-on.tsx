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
                    params: {
                      itemId: encodeURIComponent(JSON.stringify(item.id)),
                    },
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

export default function TryOnScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
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
      <Header title={"Try On"} hasGoBackBtn></Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        {categories.map((category, index) => (
          <Card key={index} {...category} />
        ))}
        <TouchableOpacity style={[styles.uploadButton]}>
          <ThemedText style={styles.uploadButtonText}>
            {"Try On Selected Items"}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
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
  uploadButton: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  uploadingButton: {
    opacity: 0.7,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
