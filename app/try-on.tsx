import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Item, useItems } from "@/hooks/useItems";
import Header from "@/components/Header";
import { api } from "@/hooks/api";

interface CardProps {
  title: string;
  iconName: string;
  items: Item[];
  selected: Item | null;
  onSelect: React.Dispatch<React.SetStateAction<Item | null>>;
}

const Card: React.FC<CardProps> = ({
  title,
  iconName,
  items,
  selected,
  onSelect,
}) => {
  const colorScheme = useColorScheme();
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
              <TouchableOpacity key={index} onPress={() => onSelect(item)}>
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.cardImage}
                />
                {selected && selected.id == item.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#000000"
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
};

export default function TryOnScreen() {
  const { getItems } = useItems();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedTop, setSelectedTop] = useState<Item | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<Item | null>(null);

  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const categories = [
    {
      title: "Tops",
      iconName: "shirt-outline",
      items: items.filter((item) => item.category.name === "top"),
      onSelect: setSelectedTop,
      selected: selectedTop,
    },
    {
      title: "Bottoms",
      iconName: "cut-outline",
      items: items.filter((item) => item.category.name === "bottom"),
      onSelect: setSelectedBottom,
      selected: selectedBottom,
    },
  ];

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

  const tryOn = async () => {
    setLoading(true);
    const response = await api.post("try-on", [
      "https://scontent-atl3-1.cdninstagram.com/v/t51.29350-15/274634263_1377079109405972_1061633955932495662_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-atl3-1.cdninstagram.com&_nc_cat=108&_nc_ohc=VnYJmQeqZ0kQ7kNvgHBVlUB&_nc_gid=24297131248f4f6eb48f8284430d3ea3&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=Mjc4MTkxMjM5NzM5OTMxOTk3NA%3D%3D.3-ccb7-5&oh=00_AYBpyg_aa4IrfKrFPmFUMQ5-fyARNphTT7aAOcn-g7_2qA&oe=66EDC1DE&_nc_sid=10d13b",
      "https://cdn.beams.co.jp/img/goods/11241388995/L/11241388995_C_3.jpg",
    ]);
    setResult(response.result);
    setLoading(false);
  };

  if (result !== "") {
    return (
      <ThemedView style={styles.container}>
        <Header title={"Try On"} hasGoBackBtn></Header>
        <ThemedView style={styles.resultContainer}>
          <Image
            source={{ uri: "data:image/jpg;base64," + result }}
            style={{ width: "100%", height: 350, marginHorizontal: "auto" }}
          />
        </ThemedView>
        <TouchableOpacity
          style={[styles.uploadButton]}
          onPress={() => setResult("")}
        >
          <ThemedText style={styles.uploadButtonText}>
            {"Try On Another Items"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title={"Try On"} hasGoBackBtn></Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        {!loading && (
          <>
            {categories.map((category, index) => (
              <Card key={index} {...category} />
            ))}
            <TouchableOpacity
              style={[styles.uploadButton]}
              onPress={async () => await tryOn()}
              disabled={loading}
            >
              <ThemedText style={styles.uploadButtonText}>
                {"Try On Selected Items"}
              </ThemedText>
            </TouchableOpacity>
          </>
        )}

        {loading && (
          <ThemedView style={[styles.loadingContainer]}>
            <ActivityIndicator size="large" color="#000000" />
            <ThemedText style={styles.loadingText}>Loading...</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    display: "flex",
    height: 250,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
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
  checkIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 0,
  },
  uploadButton: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
