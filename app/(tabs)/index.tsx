import React from "react";
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

interface CardProps {
  title: string;
  iconName: string;
  imageCount: number;
}

const Card: React.FC<CardProps> = ({ title, iconName, imageCount }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <ThemedView style={styles.cardContainer}>
      <ThemedView style={[styles.card, isDarkMode && styles.cardDark]}>
        <ThemedView style={styles.cardHeader}>
          <Ionicons
            name={iconName as any}
            size={28}
            color={isDarkMode ? "#64D2FF" : "#007AFF"}
            style={styles.cardIcon}
          />
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
            {[...Array(imageCount)].map((_, index) => (
              <TouchableOpacity key={index}>
                <Image
                  source={{
                    uri: `https://cataas.com/cat/says/${title}${
                      index + 1
                    }?size=50&color=white`,
                  }}
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

  const categories = [
    {
      title: "Tops",
      iconName: "shirt-outline",
      imageCount: Math.floor(Math.random() * 6) + 3,
    },
    {
      title: "Bottoms",
      iconName: "cut-outline",
      imageCount: Math.floor(Math.random() * 4) + 2,
    },
    {
      title: "Shoes",
      iconName: "footsteps-outline",
      imageCount: Math.floor(Math.random() * 3) + 2,
    },
    {
      title: "Bags",
      iconName: "bag-handle-outline",
      imageCount: Math.floor(Math.random() * 3) + 2,
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Closet</ThemedText>
        <TouchableOpacity>
          <Ionicons
            name="search-outline"
            size={24}
            color={isDarkMode ? "#64D2FF" : "#007AFF"}
          />
        </TouchableOpacity>
      </ThemedView>

      {categories.map((category, index) => (
        <Card key={index} {...category} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 32,
  },
  cardContainer: {
    paddingHorizontal: 16,
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
