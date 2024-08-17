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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useStorage  from "@/hooks/useStorage";


export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const options = ["Clothing", "Electronics", "Furniture", "Other"];
  const { createFile } = useStorage();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Sorry, we need camera roll permissions to make this work!");
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
    if (!selectedOption) {
      Alert.alert("Please select an option for the item type.");
      return;
    }

    setIsUploading(true);

    try {
      // Ensure image.base64 is defined before creating a File
      if (image) {
        await createFile({ file: image, category_id: 1 });
        Alert.alert("Success", "Image uploaded successfully!");
      } else {
        Alert.alert("Error", "Image data is not available.");
      }
      
      // setImage(undefined);
      // setSelectedOption("");
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {image ? (
          <>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <ThemedText type="subtitle" style={{ textAlign: 'left' }}>
              What kind of item is this?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    selectedOption === option && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedOption(option)}
                >
                  <ThemedText>{option}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : null}

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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  optionButton: {
    padding: 8,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  uploadingButton: {
    opacity: 0.7,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});