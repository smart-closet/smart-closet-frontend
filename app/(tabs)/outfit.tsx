import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Platform,
  ActivityIndicator,
  Switch,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useItems } from "@/hooks/useItems";
import { Picker } from "@react-native-picker/picker";
import Header from "@/components/Header";

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
  const [considerWeather, setConsiderWeather] = useState(true);

  // image
  const [outfitSuggestions, setOutfitSuggestions] = useState<
    OutfitSuggestion[]
  >([]);
  const [images, setImages] = useState<string[]>([]);
  const [considerItem, setConsiderItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { getItems, getOutfitSuggestions } = useItems();

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("未獲得位置權限");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const temp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&appid=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}&units=metric`
      )
        .then((response) => response.json())
        .then((data) => data);

      setWeatherData(temp);
      console.log("Weather:", temp);
    })();
  }, []);

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

  const generateOutfit = async () => {
    try {
      setLoading(true);
      setOutfitSuggestions([]);

      let latitude = location?.coords.latitude;
      let longitude = location?.coords.longitude;

      const suggestions = await getOutfitSuggestions({
        consider_weather: considerWeather,
        user_occation: occasion,
        latitude: latitude ?? 0,
        longitude: longitude ?? 0,
      });

      console.log("Suggestions:", suggestions);

      if (suggestions.length > 0) {
        let filteredSuggestions = suggestions;

        // Only filter if an item is selected
        if (selectedItem && considerItem) {
          filteredSuggestions = suggestions.filter(
            (suggestion) =>
              suggestion.top.image_url === selectedItem ||
              suggestion.bottom.image_url === selectedItem
          );
        }

        const topFiveSuggestions = filteredSuggestions
          .slice(0, 5)
          .map((suggestion) => ({
            top: suggestion.top.name,
            bottom: suggestion.bottom.name,
            outfitImages: [
              suggestion.top.image_url,
              suggestion.bottom.image_url,
            ],
            score: suggestion.score,
          }));
        setOutfitSuggestions(topFiveSuggestions);

        if (topFiveSuggestions.length === 0) {
          setOutfitSuggestions([
            { top: "", bottom: "", outfitImages: [], score: 0 },
          ]);
        }
      } else {
        setOutfitSuggestions([
          { top: "", bottom: "", outfitImages: [], score: 0 },
        ]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error generating outfit:", error);
      setOutfitSuggestions([
        { top: "", bottom: "", outfitImages: [], score: 0 },
      ]);
    }
  };

  const buttonColor = isDarkMode ? "#FFFFFF" : "#000000"; // 修改按鈕顏色為黑白

  return (
    <ThemedView style={{ flex: 1, padding: 24 }}>
      <Header title="Outfit" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView>
          <Text style={styles.sectionTitle}>📌  Choose Occasion</Text>
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

          <ThemedView style={styles.toggleContainer}>
            <ThemedText style={[styles.sectionTitle, { marginBottom: 0 }]}>
              📌 Consider Weather
            </ThemedText>
            <Switch
              value={considerWeather}
              onValueChange={setConsiderWeather}
              thumbColor={"#CCCCCC"}
              {...Platform.select({
                web: {
                  activeThumbColor: "black",
                },
              })}
              trackColor={{ false: "#CCCCCC", true: "#CCCCCC" }}
            />
          </ThemedView>

          {weatherData && (
            <ThemedView
              style={[
                styles.card,
                styles.weatherCard,
                isDarkMode && styles.cardDark,
              ]}
            >
              <ThemedView style={styles.weatherHeader}>
                <ThemedView>
                  <ThemedText style={styles.weatherTitle}>
                    {weatherData.weather[0].description}
                  </ThemedText>
                  <ThemedText>{weatherData.main.feels_like} °C</ThemedText>
                </ThemedView>
                <Image
                  source={{
                    uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
                  }}
                  style={styles.weatherIcon}
                />
              </ThemedView>
              {/* <ThemedText>體感溫度: {weatherData.main.feels_like}°C</ThemedText> */}
              {/* <ThemedText>濕度: {weatherData.main.humidity}%</ThemedText> */}
            </ThemedView>
          )}

          <ThemedView style={styles.buttonContainer}>
            <Text style={styles.sectionTitle}>📌  Specify Top or Bottom</Text>
            <Switch
              value={considerItem}
              onValueChange={setConsiderItem}
              thumbColor={"#CCCCCC"}
              {...Platform.select({
                web: {
                  activeThumbColor: "black",
                },
              })}
              trackColor={{ false: "#CCCCCC", true: "#CCCCCC" }}
            />
          </ThemedView>

          {considerItem && images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 16 }}
            >
              <ThemedView style={styles.imageContainer}>
                {images.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      setSelectedItem(img === selectedItem ? null : img)
                    }
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

          {selectedItem && considerItem && (
            <ThemedView style={styles.selectedImageContainer}>
              <Image
                source={{ uri: selectedItem }}
                style={styles.selectedImage}
              />
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSelectedItem(null)}
              >
                <Ionicons
                  name="close-circle"
                  size={30}
                  color={isDarkMode ? "#FFFFFF" : "#000000"}
                />
              </TouchableOpacity>
            </ThemedView>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPress={generateOutfit}
          >
            <ThemedText style={[{ color: "white" }]}>
              Generate Outfit
            </ThemedText>
          </TouchableOpacity>

          {loading && (
            <ThemedView style={[styles.loadingContainer]}>
              <ActivityIndicator size="large" color="#000000" />
              <ThemedText style={styles.loadingText}>Loading...</ThemedText>
            </ThemedView>
          )}

          {errorMsg ?? (
            <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
          )}

          {outfitSuggestions.length > 0 && (
            <ThemedView
              style={[
                styles.outfitContainer,
                isDarkMode && styles.outfitContainerDark,
              ]}
            >
              {outfitSuggestions[0].top === "" &&
              outfitSuggestions[0].bottom === "" ? (
                <ThemedText style={styles.noSuggestionsText}>
                  Try get more cloth
                </ThemedText>
              ) : (
                outfitSuggestions.map((suggestion, index) => (
                  <ThemedView key={index} style={styles.suggestionItem}>
                    <ThemedView style={styles.suggestionHeader}>
                      <ThemedText style={styles.outfitNumber}>
                        Outfit {index + 1}
                      </ThemedText>
                      <ThemedView style={styles.scoreContainer}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <ThemedText style={styles.scoreText}>
                          {(suggestion.score * 100).toFixed(0)}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                    <ThemedView style={styles.outfitDetails}>
                      <ThemedView style={styles.outfitItemContainer}>
                        <Image
                          source={{ uri: suggestion.outfitImages[0] }}
                          style={styles.outfitImage}
                        />
                        <ThemedText style={styles.itemName}>
                          {suggestion.top}
                        </ThemedText>
                      </ThemedView>
                      <ThemedView style={styles.outfitItemContainer}>
                        <Image
                          source={{ uri: suggestion.outfitImages[1] }}
                          style={styles.outfitImage}
                        />
                        <ThemedText style={styles.itemName}>
                          {suggestion.bottom}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                ))
              )}
            </ThemedView>
          )}
        </ThemedView>
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
    borderWidth: 1,
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
  input: {
    marginBottom: 24,
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
    fontSize: 18,
    fontWeight: "semibold",
    marginBottom: 14,
  },
  suggestionItem: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingBottom: 16,
  },
  suggestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  outfitNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  scoreText: {
    marginLeft: 4,
    fontWeight: "bold",
    fontSize: 12,
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
  selectedImageContainer: {
    position: "relative",
    margin: 16,
  },
  clearButton: {
    position: "absolute",
    top: -12,
    right: -12,
    borderRadius: 15,
    padding: 5,
  },
  noSuggestionsText: {
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  locationText: {
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    verticalAlign: "middle",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  weatherCard: {
    paddingHorizontal: 24,
    borderWidth: 1,
    marginBottom: 24,
  },
  weatherHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  weatherInfo: {
    gap: 4,
  },
});
