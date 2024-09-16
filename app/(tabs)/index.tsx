import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Header from "@/components/Header";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <Header title="My Home" text="Hi, welcome home Mrs. Chen!"></Header>

        <Text style={styles.sectionTitle}>💡 Ideas</Text>
        <View style={styles.mainFunctions}>
          <TouchableOpacity
            style={styles.functionButton}
            onPress={() => router.push("/(tabs)/outfit")}
          >
            <Ionicons name="shirt-outline" size={24} color="#000" />
            <Text>Outfit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.functionButton}
            onPress={() => router.push("/try-on")}
          >
            <Ionicons name="camera-outline" size={24} color="#000" />
            <Text>Try-on</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.functionButton} onPress={() => router.push("/analysis")}>
            <Ionicons name="analytics-outline" size={24} color="#000" />
            <Text>Analysis</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>🤟 My Place</Text>
        <View style={styles.updateFunctions}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => router.push("/closet")}
          >
            <MaterialCommunityIcons
              name="wardrobe-outline"
              size={24}
              color="#000"
            />
            <Text>My Closet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.updateButton} onPress={() => router.push("/upload")}>
            <Ionicons name="cloud-upload-outline" size={24} color="#000" />
            <Text>Upload Cloth</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => router.push("/upload-my-image")}
          >
            <Ionicons name="person-outline" size={24} color="#000" />
            <Text>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton}>
            <Ionicons name="person-circle-outline" size={24} color="#000" />
            <Text>Personal Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  mainFunctions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  functionButton: {
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    width: "32%",
    gap: 8,
  },
  updateFunctions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  updateButton: {
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    width: "49%",
    marginBottom: 8,
    gap: 8,
  },
});
