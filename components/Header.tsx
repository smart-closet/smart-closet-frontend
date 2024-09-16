import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { useRouter } from "expo-router";

export default function Header({
  title,
  text,
  hasGoBackBtn,
}: {
  title: string;
  text?: string;
  hasGoBackBtn?: boolean;
}) {
  const router = useRouter();
  return (
    <>
      {hasGoBackBtn && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} />
          <ThemedText style={styles.backText}>Back</ThemedText>
        </TouchableOpacity>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name="search-outline" size={24} color="#000" />
      </View>
      {text && <Text style={styles.welcome}>{text}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  welcome: {
    fontSize: 16,
    marginTop: -14,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
  },
});
