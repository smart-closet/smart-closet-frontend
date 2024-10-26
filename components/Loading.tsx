import { StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function Loading() {
  const [currentJokeIndex, setCurrentJokeIndex] = useState(0);

  const jokes = [
    "Why don't designers like working from home?\nBecause they're suited for the office! 👔",
    "What did the tie say to the bowtie?\nHang in there! 🎀",
    "Why did the belt go to therapy?\nIt had too many loose ends! 🤔",
    "What's a shoe's favorite drink?\nSneak-ers! 👟",
    "Why did the sock go to the doctor?\nIt had a hole in it! 🧦",
    "What did one hat say to another?\nYou stay here, I'll go on ahead! 🎩",
    "Why don't shoes like shopping?\nThey've already got sole! 👞",
    "What's a fashionista's favorite subject?\nGeometry, because they love all the different patterns! 📐",
    "Why did the scarf feel left out?\nBecause everyone kept giving it the cold shoulder! 🧣",
    "What did the shirt say to the iron?\nYou're pressing your luck! 👕",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJokeIndex((prevIndex) =>
        prevIndex === jokes.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#000000" />
      <ThemedText style={styles.loadingText}>
        {jokes[currentJokeIndex]}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 18,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
