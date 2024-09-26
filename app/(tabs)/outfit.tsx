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
  View,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as Location from "expo-location";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Item, useItems } from "@/hooks/useItems";
import { Picker } from "@react-native-picker/picker";
import Header from "@/components/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useOutfits } from "@/hooks/useOutfits";
import { router } from "expo-router";

interface OutfitSuggestion {
  top: Item;
  bottom: Item;
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
  const [considerWeather, setConsiderWeather] = useState(true);

  // image
  const [outfitSuggestions, setOutfitSuggestions] = useState<
    OutfitSuggestion[]
  >([]);
  const items = useSelector((state: RootState) => state.items);
  const outfits = useSelector((state: RootState) => state.outfits);
  const [considerItem, setConsiderItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);

  const { getOutfitSuggestions } = useItems();
  const { createOutfit } = useOutfits();

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [weatherData, setWeatherData] = useState<any>(null);

  //處理聲音的程式碼
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [result, setResult] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      Alert.alert("Sorry, your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "zh-TW";

    const clearPreviousTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    };

    const handleResult = (event: SpeechRecognitionEvent) => {
      clearPreviousTimeout();

      // Make sure to append the latest result
      const transcript = event.results[event.resultIndex][0].transcript;
      setResult((prevResult) => prevResult + transcript);

      // Set timeout for stopping the recognition after 2 seconds of inactivity
      const newTimeoutId = setTimeout(() => {
        recognition.stop();
        setIsRecognizing(false);
      }, 2000); // 2 seconds
      setTimeoutId(newTimeoutId);
    };

    recognition.onresult = handleResult;
    recognition.onend = () => {
      clearPreviousTimeout();
      setIsRecognizing(false);
      console.log("Recognition ended.");
    };

    if (isRecognizing) {
      recognition.start();
      console.log("Microphone started.");
    } else {
      recognition.stop();
      console.log("Microphone stopped.");
    }

    return () => {
      recognition.stop();
      clearPreviousTimeout();
    };
  }, [isRecognizing, timeoutId]);

  const handleMicrophonePress = () => {
    if (!isRecognizing) {
      setIsRecognizing(true);
    }
  };

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

  const generateOutfit = async () => {
    setLoading(true);
    setOutfitSuggestions([]);

    let latitude = location?.coords.latitude;
    let longitude = location?.coords.longitude;

    const suggestions = await getOutfitSuggestions({
      consider_weather: considerWeather,
      user_occation: occasion,
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      item_id: selectedItem ? selectedItem.id : undefined,
      voice_occasion: result,
    });

    console.log("Suggestions:", suggestions);

    if (suggestions.length > 0) {
      let filteredSuggestions = suggestions;
      const topFiveSuggestions = filteredSuggestions
        .slice(0, 5)
        .map((suggestion) => ({
          ...suggestion,
          outfitImages: [suggestion.top.image_url, suggestion.bottom.image_url],
          score: suggestion.score,
        }));
      setOutfitSuggestions(topFiveSuggestions);
    }

    setLoading(false);
  };

  const checkIfOutfitExists = (suggestion: OutfitSuggestion) => {
    const outfitIds = outfits.map((outfit) =>
      outfit.items.map((item) => item.id)
    );
    return outfitIds.some(
      (outfit) =>
        outfit.includes(suggestion.top.id) &&
        outfit.includes(suggestion.bottom.id)
    );
  };

  const buttonColor = isDarkMode ? "#FFFFFF" : "#000000"; // 修改按鈕顏色為黑白

  return (
    <ThemedView style={{ flex: 1, padding: 24 }}>
      <Header title="Outfit" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText
          type="subtitle"
          lightColor="#000"
          darkColor="#fff"
          style={{ marginVertical: 20 }}
        >
          AI voice Assistent
        </ThemedText>
        <ThemedView>
          <View style={styles.inputBlock}>
            <View style={styles.ScenarioContainer}>
              <TextInput
                style={styles.speech_input}
                placeholder="Say or enter something..."
                value={result}
                onChangeText={setResult}
              />
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={handleMicrophonePress}
              >
                <FontAwesome5 name="microphone" size={18} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPress={generateOutfit}
          >
            <ThemedText style={[{ color: "white" }]}>
              Generate Outfit
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView>
          <ThemedText
            type="subtitle"
            lightColor="#000"
            darkColor="#fff"
            style={{ marginVertical: 20 }}
          >
            Self-selection
          </ThemedText>
          <View
            style={[
              styles.rowContainer,
              { flexDirection: "row", alignItems: "flex-start" },
            ]}
          >
            <MaterialIcons
              name="filter-1"
              size={16}
              color="black"
              style={{ marginRight: 5 }}
            />
            <Text style={[styles.sectionTitle, { lineHeight: 16 }]}>
              {" "}
              Choose Occasion
            </Text>
          </View>

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
              <MaterialIcons
                name="filter-2"
                size={16}
                color="black"
                style={{ marginRight: 5 }}
              />{" "}
              Consider Weather
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
            </ThemedView>
          )}

          <ThemedView style={styles.buttonContainer}>
            <Text style={styles.sectionTitle}>
              <MaterialIcons
                name="filter-3"
                size={16}
                color="black"
                style={{ marginRight: 5 }}
              />{" "}
              Specify Top or Bottom
            </Text>
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

          {considerItem && items.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 16 }}
            >
              <ThemedView style={styles.imageContainer}>
                {items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      setSelectedItem(item === selectedItem ? null : item)
                    }
                  >
                    <Image
                      source={{ uri: item.image_url }}
                      style={[
                        styles.thumbnailImage,
                        item === selectedItem && styles.selectedThumbnail,
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
                source={{ uri: selectedItem.image_url }}
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
              {outfitSuggestions.length === 0 ? (
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

                      <ThemedView style={styles.suggestionHeader}>
                        <ThemedView style={styles.scoreContainer}>
                          <TouchableOpacity
                            style={styles.scoreText}
                            onPress={() => {
                              if (checkIfOutfitExists(suggestion)) {
                                router.push("/try-on");
                              } else {
                                createOutfit([
                                  suggestion.top.id,
                                  suggestion.bottom.id,
                                ]);
                              }
                            }}
                          >
                            <ThemedText style={{ fontSize: 12 }}>
                              {checkIfOutfitExists(suggestion)
                                ? "try on"
                                : "add"}
                            </ThemedText>
                          </TouchableOpacity>
                        </ThemedView>

                        <ThemedView style={styles.scoreContainer}>
                          <Ionicons name="star" size={12} color="#FFD700" />
                          <ThemedText style={styles.scoreText}>
                            {(suggestion.score * 100).toFixed(0)}
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>
                    </ThemedView>
                    <ThemedView style={styles.outfitDetails}>
                      <ThemedView style={styles.outfitItemContainer}>
                        <Image
                          source={{ uri: suggestion.outfitImages[0] }}
                          style={styles.outfitImage}
                        />
                        <ThemedText style={styles.itemName}>
                          {suggestion.top.name}
                        </ThemedText>
                      </ThemedView>
                      <ThemedView style={styles.outfitItemContainer}>
                        <Image
                          source={{ uri: suggestion.outfitImages[1] }}
                          style={styles.outfitImage}
                        />
                        <ThemedText style={styles.itemName}>
                          {suggestion.bottom.name}
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
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
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
    gap: 8,
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
  inputBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flex: 1,
  },
  speech_input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    left: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  subHeaderStyle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 4,
  },
  ScenarioContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  button2: {
    paddingVertical: 10,
    paddingHorizontal: 12,

    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 8,
    backgroundColor: "#007AFF",
  },
});
