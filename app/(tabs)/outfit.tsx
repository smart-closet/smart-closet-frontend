import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  ScrollView,
  Alert,
  Platform,
  View,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useItems } from "@/hooks/useItems";
import { Picker } from "@react-native-picker/picker";

interface OutfitSuggestion {
  top: string;
  bottom: string;
  outfitImages: string[];
  score: number;
}

export default function OutfitScreen() {
  // theme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // context
  const occasions = [
    "Dating",
    "Daily_Work_and_Conference",
    "Travel",
    "Sports",
    "Prom",
    "Party",
    "Shopping",
    "School",
    "Wedding_Guest",
  ];
  const [occasion, setOccasion] = useState("Daily_Work_and_Conference");
  // const outfitStyles = ["American", "Japanese", "Korean"];
  // const [outfitStyle, setOutfitStyle] = useState("Japanese");

  const [weather, setWeather] = useState("");

  // image
  const [image, setImage] = useState<string | null>(null);
  const [outfitSuggestions, setOutfitSuggestions] = useState<OutfitSuggestion[]>([]);

  const [images, setImages] = useState<string[]>([]);
  const [showImages, setShowImages] = useState(false);

  const { getItems, getOutfitSuggestions } = useItems();
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getItems();
        if (fetchedItems) {
          setImages(fetchedItems.map((item) => item.image_url));
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    return randomImage;
  };

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const generateOutfit = async () => {
    try {
      const suggestions = await getOutfitSuggestions({
        city: "臺北市",
        place: "中正區",
        consider_weather: true,
        user_occation: occasion,
      });

      console.log("Suggestions:", suggestions);

      if (suggestions.length > 0) {
        let filteredSuggestions = suggestions;
        
        // Only filter if an item is selected
        if (selectedItem) {
          filteredSuggestions = suggestions.filter(suggestion => 
            suggestion.top.image_url === selectedItem || suggestion.bottom.image_url === selectedItem
          );
        }

        const topFiveSuggestions = filteredSuggestions.slice(0, 5).map(suggestion => ({
          top: suggestion.top.name,
          bottom: suggestion.bottom.name,
          outfitImages: [suggestion.top.image_url, suggestion.bottom.image_url],
          score: suggestion.score
        }));
        setOutfitSuggestions(topFiveSuggestions);

        if (topFiveSuggestions.length === 0) {
          setOutfitSuggestions([{ top: "", bottom: "", outfitImages: [], score: 0 }]);
        }
      } else {
        setOutfitSuggestions([{ top: "", bottom: "", outfitImages: [], score: 0 }]);
      }
    } catch (error) {
      console.error("Error generating outfit:", error);
      setOutfitSuggestions([{ top: "", bottom: "", outfitImages: [], score: 0 }]);
    }
  };

  const toggleImageSection = () => {
    if (images.length > 0) {
      setShowImages(!showImages);
    }
  };

  const buttonColor = isDarkMode ? "#FFFFFF" : "#000000"; // 修改按鈕顏色為黑白

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.cardContainer}>
          <ThemedView style={[styles.card, isDarkMode && styles.cardDark]}>
            <Picker
              dropdownIconColor={isDarkMode ? "#FFFFFF" : "#000000"}
              selectedValue={occasion}
              onValueChange={(itemValue) => setOccasion(itemValue)}
              style={[styles.input, isDarkMode && styles.inputDark]}
            >
              {occasions.map((occ) => (
                <Picker.Item key={occ} label={occ} value={occ} />
              ))}
            </Picker>

            {/* <Picker
              selectedValue={outfitStyle}
              onValueChange={(itemValue) => setOutfitStyle(itemValue)}
              style={[styles.input, isDarkMode && styles.inputDark]}
            >
              {outfitStyles.map((style) => (
                <Picker.Item key={style} label={style} value={style} />
              ))}
            </Picker> */}

            <TextInput
              placeholder="Weather (e.g., sunny, rainy)"
              value={weather}
              onChangeText={setWeather}
              style={[styles.input, isDarkMode && styles.inputDark]}
              placeholderTextColor={isDarkMode ? "#999999" : "#666666"}
            />

            <ThemedView style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { borderColor: buttonColor },
                  styles.halfButton,
                ]}
                onPress={toggleImageSection}
              >
                <ThemedText
                  type="default"
                  style={[styles.buttonText, { color: buttonColor }]}
                >
                  {showImages ? "Hide Items" : "Select Item (Optional)"}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {showImages && images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.marginBottom}
              >
                <ThemedView style={styles.imageContainer}>
                  {images.map((img, index) => (
                    <TouchableOpacity 
                      key={index} 
                      onPress={() => setSelectedItem(img === selectedItem ? null : img)}
                    >
                      <Image
                        source={{ uri: img }}
                        style={[
                          styles.thumbnailImage,
                          img === selectedItem && styles.selectedThumbnail,
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              </ScrollView>
            )}

            {selectedItem && (
              <ThemedView style={styles.selectedImageContainer}>
                <Image
                  source={{ uri: selectedItem }}
                  style={styles.selectedImage}
                />
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setSelectedItem(null)}
                >
                  <Ionicons name="close-circle" size={30} color={isDarkMode ? "#FFFFFF" : "#000000"} />
                </TouchableOpacity>
              </ThemedView>
            )}

            <TouchableOpacity
              style={[styles.button, { borderColor: buttonColor }]}
              onPress={generateOutfit}
            >
              <ThemedText style={[styles.buttonText, { color: buttonColor }]}>
                Generate Outfit
              </ThemedText>
            </TouchableOpacity>

            {outfitSuggestions.length > 0 && (
              <ThemedView
                style={[
                  styles.outfitContainer,
                  isDarkMode && styles.outfitContainerDark,
                ]}
              >
                {outfitSuggestions[0].top === "" && outfitSuggestions[0].bottom === "" ? (
                  <ThemedText style={styles.noSuggestionsText}>Try get more cloth</ThemedText>
                ) : (
                  outfitSuggestions.map((suggestion, index) => (
                    <ThemedView key={index} style={styles.suggestionItem}>
                      <ThemedView style={styles.suggestionHeader}>
                        <ThemedText style={styles.outfitNumber}>Outfit {index + 1}</ThemedText>
                        <ThemedView style={styles.scoreContainer}>
                          <Ionicons name="star" size={12} color="#FFD700" />
                          <ThemedText style={styles.scoreText}>{(suggestion.score * 100).toFixed(0)}</ThemedText>
                        </ThemedView>
                      </ThemedView>
                      <ThemedView style={styles.outfitDetails}>
                        <ThemedView style={styles.outfitItemContainer}>
                          <Image
                            source={{ uri: suggestion.outfitImages[0] }}
                            style={styles.outfitImage}
                          />
                          <ThemedText style={styles.itemName}>{suggestion.top}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.outfitItemContainer}>
                          <Image
                            source={{ uri: suggestion.outfitImages[1] }}
                            style={styles.outfitImage}
                          />
                          <ThemedText style={styles.itemName}>{suggestion.bottom}</ThemedText>
                        </ThemedView>
                      </ThemedView>
                    </ThemedView>
                  ))
                )}
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "transparent", // 移除灰色背景
    borderRadius: 12,
    padding: 16,
  },
  cardDark: {
    backgroundColor: "transparent", // 移除灰色背景
  },
  button: {
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1, // Added border width
  },
  buttonText: {
    fontSize: 16,
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  outfitContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
  },
  outfitContainerDark: {
    backgroundColor: "#1C1C1E",
  },
  outfitImageContainer: {
    marginTop: 16,
  },
  outfitImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 8,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    gap: 8,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  halfButton: {
    flex: 1,
  },
  marginBottom: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    padding: Platform.OS === "ios" ? 10 : 0,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    color: "#000000",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  inputDark: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
    borderColor: "#555555",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  suggestionItem: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingBottom: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  outfitNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  scoreText: {
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 12
  },
  outfitDetails: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  outfitItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  selectedImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  clearButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    borderRadius: 15,
    padding: 5,
  },
  noSuggestionsText: {
    textAlign: 'center',
    fontSize: 16,
  },
});
