import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Closet</ThemedText>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.cardContainer}>
        <TouchableOpacity style={styles.card}>
          <Ionicons
            name="shirt-outline"
            size={28}
            color="#007AFF"
            style={styles.cardIcon}
          />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Tops
          </ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.cardContainer}>
        <TouchableOpacity style={styles.card}>
          <Ionicons
            name="cut-outline"
            size={28}
            color="#007AFF"
            style={styles.cardIcon}
          />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Bottoms
          </ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.cardContainer}>
        <TouchableOpacity style={styles.card}>
          <Ionicons
            name="footsteps-outline"
            size={28}
            color="#007AFF"
            style={styles.cardIcon}
          />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Shoes
          </ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 32,
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 16,
  },
  cardIcon: {
    marginRight: 16,
  },
  cardTitle: {
    flex: 1,
  },
});