import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

export default function Header({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  return (
    <>
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
});
