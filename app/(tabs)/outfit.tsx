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
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useItems } from "@/hooks/useItems";
import { Picker } from "@react-native-picker/picker";

export default function OutfitScreen() {
  // theme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // context
  const occasions = [
    "Conference",
    "Daily Work",
    "Dating",
    "Party",
    "Prom",
    "School",
    "Shopping",
    "Sport",
    "Travel",
    "Wedding Guest",
  ];
  const [occasion, setOccasion] = useState("Casual");
  const outfitStyles = ["American", "Japanese", "Korean"];
  const [outfitStyle, setOutfitStyle] = useState("Japanese");

  const [weather, setWeather] = useState("");

  // image
  const [image, setImage] = useState<string | null>(null);
  const [outfit, setOutfit] = useState<{
    top: string;
    bottom: string;
    shoes: string;
    accessories: string;
    outfitImages: string[];
  } | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [showImages, setShowImages] = useState(false);

  const { getItems } = useItems();
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

  const uploadImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

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

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    return randomImage;
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
        getRandomImage(),
        getRandomImage(),
        getRandomImage(),
      ],
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

            <Picker
              selectedValue={outfitStyle}
              onValueChange={(itemValue) => setOutfitStyle(itemValue)}
              style={[styles.input, isDarkMode && styles.inputDark]}
            >
              {outfitStyles.map((style) => (
                <Picker.Item key={style} label={style} value={style} />
              ))}
            </Picker>

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
                  { borderColor: "#3e3e3e" },
                  styles.halfButton,
                ]}
                onPress={toggleImageSection}
              >
                <ThemedText
                  type="default"
                  style={[styles.buttonText, { color: buttonColor }]}
                >
                  {images.length > 0
                    ? showImages
                      ? "Hide Images"
                      : "Show Images"
                    : "Upload Image"}
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
                    <TouchableOpacity key={index} onPress={() => setImage(img)}>
                      <Image
                        source={typeof img === "string" ? { uri: img } : img}
                        style={[
                          styles.thumbnailImage,
                          img === image && styles.selectedThumbnail,
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              </ScrollView>
            )}

            {image && (
              <Image
                source={typeof image === "string" ? { uri: image } : image}
                style={styles.selectedImage}
              />
            )}

            <TouchableOpacity
              style={[styles.button, { borderColor: buttonColor }]} // 使用 buttonColor
              onPress={generateOutfit}
            >
              <ThemedText style={[styles.buttonText, { color: buttonColor }]}>
                Generate Outfit
              </ThemedText>
            </TouchableOpacity>

            {outfit && (
              <ThemedView
                style={[
                  styles.outfitContainer,
                  isDarkMode && styles.outfitContainerDark,
                ]}
              >
                <ThemedText type="subtitle">Recommended Outfit:</ThemedText>
                <ThemedText>Top: {outfit.top}</ThemedText>
                <ThemedText>Bottom: {outfit.bottom}</ThemedText>
                <ThemedText>Shoes: {outfit.shoes}</ThemedText>
                <ThemedText>Accessories: {outfit.accessories}</ThemedText>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.outfitImageContainer}
                >
                  {outfit.outfitImages?.map((img, index) => (
                    <Image
                      key={index}
                      source={typeof img === "string" ? { uri: img } : img}
                      style={styles.outfitImage}
                    />
                  ))}
                </ScrollView>
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
    backgroundColor: "#F0F0F5",
    borderRadius: 12,
    padding: 16,
  },
  cardDark: {
    backgroundColor: "#1C1C1E",
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
});
