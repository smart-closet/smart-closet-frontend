import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
  View,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [image, setImage] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets.map((asset) => asset.uri)[0]);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {image ? (
          <>
            <Image source={{ uri: image }} style={styles.image} />
            <ThemedText type="subtitle" style={{ textAlign: 'left' }}>
              What kind of item is this?
            </ThemedText>
          </>
        ) : null}

        <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
          <Ionicons
            name="images-outline"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
          <ThemedText style={styles.pickButtonText}>Choose Images</ThemedText>
        </TouchableOpacity>
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
});