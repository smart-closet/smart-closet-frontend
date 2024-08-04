import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  ScrollView,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ActionSheetIOS } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

export default function OutfitScreen() {
  const [occasion, setOccasion] = useState("Casual");
  const [weather, setWeather] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [outfit, setOutfit] = useState<{
    top: string;
    bottom: string;
    shoes: string;
    accessories: string;
  } | null>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const occasions = ["Casual", "Formal", "Work", "Date", "Party"];

  const showOccasionPicker = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...occasions, "Cancel"],
        cancelButtonIndex: occasions.length,
        title: "Select Occasion",
      },
      (buttonIndex) => {
        if (buttonIndex !== occasions.length) {
          setOccasion(occasions[buttonIndex]);
        }
      }
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const generateOutfit = () => {
    // This should call an AI model or backend API to generate the outfit
    // For now, we're just simulating a result
    setOutfit({
      top: "White T-shirt",
      bottom: "Jeans",
      shoes: "Sneakers",
      accessories: "Baseball cap",
    });
  };

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

      <ThemedView style={styles.cardContainer}>
        <ThemedView style={[styles.card, isDarkMode && styles.cardDark]}>
          <TouchableOpacity
            style={[styles.input, isDarkMode && styles.inputDark]}
            onPress={showOccasionPicker}
          >
            <ThemedText>{occasion}</ThemedText>
            <Ionicons
              name="chevron-down"
              size={20}
              color={isDarkMode ? "#FFFFFF" : "#000000"}
            />
          </TouchableOpacity>

          <TextInput
            placeholder="Weather (e.g., sunny, rainy)"
            value={weather}
            onChangeText={setWeather}
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholderTextColor={isDarkMode ? "#999999" : "#666666"}
          />

          <TouchableOpacity style={[styles.button, isDarkMode && styles.buttonDark]} onPress={pickImage}>
            <ThemedText style={[styles.buttonText, isDarkMode && styles.buttonTextDark]}>Choose Image</ThemedText>
          </TouchableOpacity>

          {image && <Image source={{ uri: image }} style={styles.image} />}

          <TouchableOpacity
            style={[styles.button, isDarkMode && styles.buttonDark]}
            onPress={generateOutfit}
          >
            <ThemedText style={[styles.buttonText, isDarkMode && styles.buttonTextDark]}>Generate Outfit</ThemedText>
          </TouchableOpacity>

          {outfit && (
            <ThemedView style={styles.outfitContainer}>
              <ThemedText type="subtitle">Recommended Outfit:</ThemedText>
              <ThemedText>Top: {outfit.top}</ThemedText>
              <ThemedText>Bottom: {outfit.bottom}</ThemedText>
              <ThemedText>Shoes: {outfit.shoes}</ThemedText>
              <ThemedText>Accessories: {outfit.accessories}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
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
  input: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    color: "#000000",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputDark: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
    borderColor: "#555555",
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonDark: {
    backgroundColor: '#0A84FF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDark: {
    color: '#FFFFFF',
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  outfitContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
  },
});