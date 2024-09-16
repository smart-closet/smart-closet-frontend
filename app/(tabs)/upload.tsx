import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
  Platform,
  Dimensions,
  Alert,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Item, useItems } from "@/hooks/useItems";
import { useRouter } from "expo-router";
import Header from "@/components/Header";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const { createItem } = useItems();

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [res, setRes] = useState<Item[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Sorry, we need camera roll permissions to make this work!"
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Please select an image first.");
      return;
    }

    setIsUploading(true);

    try {
      if (image) {
        const response = await createItem(image);
        setRes(response);
      } else {
        Alert.alert("Error", "Image data is not available.");
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  console.log(res);

  if (res.length !== 0) {
    res.sort((a, b) => b.id - a.id);
    return (
      <ThemedView style={styles.container}>
        <Header title="Upload Cloth" />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Ionicons name="checkmark-circle-outline" size={100} color="green" />
          <ThemedText type="subtitle" style={{ textAlign: "left" }}>
            Successfully Upload
          </ThemedText>
        </View>

        <ScrollView
          contentContainerStyle={styles.cardContainer}
          showsVerticalScrollIndicator={false}
        >
          {res.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/item-detail",
                  params: {
                    itemId: encodeURIComponent(JSON.stringify(item.id)),
                  },
                })
              }
            >
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>
                  {item.category.name}
                </ThemedText>
              </View>
              <Image
                source={{ uri: item.image_url }}
                style={{ width: 120, height: 120 }}
              />

              <View style={styles.cardText}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.uploadButton, isUploading && styles.uploadingButton]}
          onPress={() => setRes([])}
        >
          <ThemedText style={styles.uploadButtonText}>
            {isUploading ? "Uploading..." : "Upload More Items"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="Upload Cloth" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoContainer}>
          <ThemedText style={styles.infoTitle}>📌 How it works</ThemedText>
          <ThemedText style={styles.infoText}>
            1. Accept any photo with clothes.
          </ThemedText>
          <ThemedText style={styles.infoText}>
            2. Crop them into individual items.
          </ThemedText>
          <ThemedText style={styles.infoText}>
            3. Remove BG and auto-scaling.
          </ThemedText>
          <ThemedText style={styles.infoText}>
            4. Name and tag items.
          </ThemedText>
          <ThemedText style={styles.infoText}>
            5. Saved all items to your closet.
          </ThemedText>
        </View>

        {image && <Image source={{ uri: image.uri }} style={styles.image} />}

        <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
          <Ionicons
            name="images-outline"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
          <ThemedText style={styles.pickButtonText}>Choose Image</ThemedText>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity
            style={[styles.uploadButton, isUploading && styles.uploadingButton]}
            onPress={uploadImage}
            disabled={isUploading}
          >
            <ThemedText style={styles.uploadButtonText}>
              {isUploading ? "Uploading..." : "Upload Image"}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  scrollContainer: {
    gap: 16,
  },
  image: {
    width: Dimensions.get("window").width - 100,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 8,
    alignSelf: "center",
  },
  pickButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F5",
    padding: 16,
    borderRadius: 12,
  },
  pickButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  optionButton: {
    padding: 8,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedOption: {
    backgroundColor: "#efefef",
  },
  uploadButton: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  uploadingButton: {
    opacity: 0.7,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "48%",
    alignItems: "center",
  },
  cardText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 8,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  badge: {
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    paddingVertical: 2,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: "#F0F0F5",
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 18,
  },
  infoText: {
    marginBottom: 4,
    fontSize: 14,
  },
});
