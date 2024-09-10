import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
  Platform,
  Dimensions,
  Alert,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Item, useItems } from "@/hooks/useItems";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const { createItem } = useItems();

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const itemNameRef = useRef<any>(null);

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
        <View style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
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
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="subtitle" style={{ textAlign: "left" }}>
          Upload Outfit
        </ThemedText>
        {/* <TextInput
          ref={itemNameRef} // 設定 ref
          style={styles.input}
          placeholder="Enter item name"
          onChangeText={(e) => (itemNameRef.current.value = e)}
        /> */}

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
    display: "flex",
    justifyContent: "space-evenly",
    padding: 16,
  },
  scrollContainer: {
    padding: 8,
    gap: 16,
  },
  image: {
    width: Dimensions.get("window").width - 32,
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
    borderWidth: 1, // Added border width
    borderColor: "#ccc", // Added border color
    padding: 10, // Added padding
    borderRadius: 8, // Added border radius
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
});
