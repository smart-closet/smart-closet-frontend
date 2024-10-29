import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Provider } from "react-redux";
import store from "@/store";
import { useItems } from "@/hooks/useItems";
import { useMyImages } from "@/hooks/useMyImages";
import { useOutfits } from "@/hooks/useOutfits";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { getItems } = useItems();
  const { getMyImages } = useMyImages();
  const { getOutfits } = useOutfits();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getItems();
        const fetchedMyImages = await getMyImages();
        const fetchedOutfits = await getOutfits();
        store.dispatch({ type: 'SET_ITEMS', payload: fetchedItems });
        store.dispatch({ type: 'SET_MY_IMAGES', payload: fetchedMyImages });
        store.dispatch({ type: 'SET_OUTFITS', payload: fetchedOutfits });
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="item-detail" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}
