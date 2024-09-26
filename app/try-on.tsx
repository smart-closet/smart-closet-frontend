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
import { useSelector } from "react-redux";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Item } from "@/hooks/useItems";
import Header from "@/components/Header";
import { api } from "@/hooks/api";
import { MyImage } from "@/hooks/useMyImages";
import { Outfit, RootState } from "@/store";

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
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (selected && selected.id == item.id) {
                    onSelect(null);
                  } else {
                    onSelect(item);
                  }
                }}
              >
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
  const items = useSelector((state: RootState) => state.items);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const myImages = useSelector((state: RootState) => state.myImages);
  const outfits = useSelector((state: RootState) => state.outfits);

  const [selectedTop, setSelectedTop] = useState<Item | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<Item | null>(null);
  const [selectedMyImage, setSelectedMyImage] = useState<MyImage | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);

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

  const tryOn = async () => {
    setLoading(true);
    const topAndBottom = selectedOutfit
      ? selectedOutfit.items
          .sort((a, b) => a.category_id - b.category_id)
          .map((item) => item.image_url)
      : [selectedTop, selectedBottom].filter(Boolean);

    const response = await api.post(
      "try-on",
      [...topAndBottom, selectedMyImage && selectedMyImage.image_url].filter(
        Boolean
      )
    );
    console.log("Try on response:", response);
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

            <ThemedView style={styles.cardContainer}>
              <ThemedView style={[styles.card, isDarkMode && styles.cardDark]}>
                <ThemedView style={styles.cardHeader}>
                  <Ionicons
                    name={"shirt-outline"}
                    size={28}
                    style={styles.cardIcon}
                  />
                  <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                    Outfits
                  </ThemedText>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDarkMode ? "#A1A1A6" : "#8E8E93"}
                  />
                </ThemedView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <ThemedView style={styles.imageContainer}>
                    {outfits.map((outfit, index) => (
                      <ThemedView key={index}>
                        {outfit.items
                          .sort((a, b) => a.category_id - b.category_id)
                          .map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => {
                                if (
                                  selectedOutfit &&
                                  selectedOutfit.id == outfit.id
                                ) {
                                  setSelectedOutfit(null);
                                } else {
                                  setSelectedOutfit(outfit);
                                }
                              }}
                            >
                              {selectedOutfit &&
                                selectedOutfit.id == outfit.id && (
                                  <Ionicons
                                    name="checkmark-circle"
                                    size={20}
                                    color="#000000"
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      right: 0,
                                      zIndex: 1,
                                    }}
                                  />
                                )}
                              <Image
                                source={{ uri: item.image_url }}
                                style={styles.cardImage}
                              />
                            </TouchableOpacity>
                          ))}
                      </ThemedView>
                    ))}
                  </ThemedView>
                </ScrollView>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.cardContainer}>
              <ThemedView style={[styles.card, isDarkMode && styles.cardDark]}>
                <ThemedView style={styles.cardHeader}>
                  <Ionicons
                    name={"man-outline"}
                    size={28}
                    style={styles.cardIcon}
                  />
                  <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                    {"My Images"}
                  </ThemedText>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDarkMode ? "#A1A1A6" : "#8E8E93"}
                  />
                </ThemedView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <ThemedView style={styles.imageContainer}>
                    {myImages.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          if (
                            selectedMyImage &&
                            selectedMyImage.id == item.id
                          ) {
                            setSelectedMyImage(null);
                          } else {
                            setSelectedMyImage(item);
                          }
                        }}
                      >
                        <Image
                          source={{ uri: item.image_url }}
                          style={styles.cardImage}
                        />
                        {selectedMyImage && selectedMyImage.id == item.id && (
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
