import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ActionSheetIOS } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

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

const getRandomCatImage = () => {
  const index = Math.floor(Math.random() * catImages.length);
  return catImages[index];
};

export default function OutfitScreen() {
  // theme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // context
  const occasions = ["Casual", "Formal", "Work", "Date", "Party"];
  const [occasion, setOccasion] = useState("Casual");
  const [weather, setWeather] = useState("");

  // image
  const [image, setImage] = useState<string | number | null>(null);
  const [outfit, setOutfit] = useState<{
    top: string;
    bottom: string;
    shoes: string;
    accessories: string;
    outfitImages: string[];
  } | null>(null);
  
  const [images, setImages] = useState<(string | number)[]>([catImages[0], catImages[2]]);
  const [showImages, setShowImages] = useState(false);

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImage = result.assets[0].uri;
      setImages([...images, newImage]);
      setImage(newImage);
      setShowImages(true);
    }
  };

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

  const generateOutfit = () => {
    if (!image) {
      Alert.alert(
        "No Image",
        "Please upload an image before generating an outfit.",
        [{ text: "OK", onPress: () => console.log("Alert closed") }]
      );
      return;
    }
    const newOutfit = {
      top: "White T-shirt",
      bottom: "Jeans",
      shoes: "Sneakers",
      accessories: "Baseball cap",
      outfitImages: [
        image,
        getRandomCatImage(),
        getRandomCatImage(),
        getRandomCatImage(),
      ]
    };
    setOutfit(newOutfit);
  };

  const toggleImageSection = () => {
    if (images.length > 0) {
      setShowImages(!showImages);
    } else {
      uploadImage();
    }
  };

  const buttonColor = isDarkMode ? "#EDEDED" : "#007AFF";

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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

          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, { borderColor: "#3e3e3e" }, styles.halfButton]} 
              onPress={uploadImage}
            >
              <ThemedText style={[styles.buttonText, { color: buttonColor }]}>Upload Image</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { borderColor: "#3e3e3e" }, styles.halfButton]} 
              onPress={toggleImageSection}
            >
              <ThemedText type="default" style={[styles.buttonText, { color: buttonColor }]}>
                {images.length > 0 ? (showImages ? "Hide Images" : "Show Images") : "Upload Image"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {showImages && images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.marginBottom}>
              <ThemedView style={styles.imageContainer}>
                {images.map((img, index) => (
                  <TouchableOpacity key={index} onPress={() => setImage(img)}>
                    <Image 
                      source={typeof img === 'string' ? { uri: img } : img} 
                      style={[
                        styles.thumbnailImage, 
                        img === image && styles.selectedThumbnail
                      ]} 
                    />
                  </TouchableOpacity>
                ))}
              </ThemedView>
            </ScrollView>
          )}

          {image && (
            <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.selectedImage} />
          )}

          <TouchableOpacity
            style={[styles.button, { borderColor: buttonColor }]}
            onPress={generateOutfit}
          >
            <ThemedText style={[styles.buttonText, { color: buttonColor }]}>Generate Outfit</ThemedText>
          </TouchableOpacity>

          {outfit && (
            <ThemedView style={[styles.outfitContainer, isDarkMode && styles.outfitContainerDark]}>
              <ThemedText type="subtitle">Recommended Outfit:</ThemedText>
              <ThemedText>Top: {outfit.top}</ThemedText>
              <ThemedText>Bottom: {outfit.bottom}</ThemedText>
              <ThemedText>Shoes: {outfit.shoes}</ThemedText>
              <ThemedText>Accessories: {outfit.accessories}</ThemedText>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.outfitImageContainer}>
                {outfit.outfitImages?.map((img, index) => (
                  <Image key={index} source={typeof img === 'string' ? { uri: img } : img} style={styles.outfitImage} />
                ))}
              </ScrollView>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
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
  input: {
    marginBottom: 16,
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
    padding: 12,
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  halfButton: {
    flex: 0.48,
  },
  marginBottom: {
    marginBottom: 16,
  },
});