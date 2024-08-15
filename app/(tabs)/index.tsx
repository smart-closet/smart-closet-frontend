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

// 預定義貓咪圖片數組
const catImages = [
  require('@/assets/images/cat-1.jpg'),
  require('@/assets/images/cat-2.jpg'),
  require('@/assets/images/cat-3.jpg'),
  require('@/assets/images/cat-4.jpg'),
  require('@/assets/images/cat-5.jpg'),
  require('@/assets/images/cat-6.jpg'),
  require('@/assets/images/cat-7.jpg'),
  require('@/assets/images/cat-8.jpg'),
  require('@/assets/images/cat-9.jpg'),
  require('@/assets/images/cat-10.jpg'),
  require('@/assets/images/cat-11.jpg'),
  require('@/assets/images/cat-12.jpg'),
  require('@/assets/images/cat-13.jpg'),
  require('@/assets/images/cat-14.jpg'),
  require('@/assets/images/cat-15.jpg'),
  require('@/assets/images/cat-16.jpg'),
  require('@/assets/images/cat-17.jpg'),
  require('@/assets/images/cat-18.jpg'),
  require('@/assets/images/cat-19.jpg'),
  require('@/assets/images/cat-20.jpg'),
];

// 修改 getRandomCatImage 函數
const getRandomCatImage = () => {
  const index = Math.floor(Math.random() * catImages.length);
  return catImages[index];
};

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
                  source={getRandomCatImage()}
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
      {categories.map((category, index) => (
        <Card key={index} {...category} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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