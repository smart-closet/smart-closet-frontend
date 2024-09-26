import { api } from "./api";
import * as ImagePicker from "expo-image-picker";

// Define Item type
export interface Item {
  id: number;
  name: string;
  image_url: string;
  attributes?: Attribute[];
  category_id: number;
  category: Category;
  subcategory: Subcategory
}

interface Attribute {
  id: number;
  name: string;
  value: string;
}

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
}

interface OutfitPair {
  top: Item;
  bottom: Item;
  score: number;
}

interface OutfitSuggestionParams {
  consider_weather: boolean;
  user_occation: string;
  latitude: number;
  longitude: number;
  item_id?: number;
  voice_occasion?: string;
}

// Define return types for the CRUD operations
interface UseItemsReturn {
  getItems: () => Promise<Item[]>;
  getItem: (id: number) => Promise<Item>;
  createItem: (image: ImagePicker.ImagePickerAsset) => Promise<Item[]>;
  updateItem: (id: number, item: Item) => Promise<Item>;
  deleteItem: (id: number) => Promise<void>;
  getOutfitSuggestions: (
    params: OutfitSuggestionParams
    ) => Promise<OutfitPair[]>;
}

// Custom hook to handle item CRUD operations
export const useItems = (): UseItemsReturn => {
  const getItems = async () => {
    return await api.get("items");
  };

  const getItem = async (id: number) => {
    return await api.get(`items/${id}`);
  };

  const uriToBuffer = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const createItem = async (image: ImagePicker.ImagePickerAsset) => {
    const formData = new FormData();
    const imageBuffer = await uriToBuffer(image.uri);
    formData.append("image", imageBuffer, `${image.fileName}`);

    return await api.post("items", formData);
  };

  const updateItem = async (id: number, item: Item) => {
    return await api.put(`items/${id}`, item);
  };

  const deleteItem = async (id: number) => {
    return await api.delete(`items/${id}`);
  };

  const getOutfitSuggestions = async (
    params: OutfitSuggestionParams
  ): Promise<OutfitPair[]> => {
    const temp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${params.latitude}&lon=${params.longitude}&appid=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => data);

    return await api.post(`rulebase/`, {
      temperature: temp.main.feels_like,
      consider_weather: params.consider_weather,
      user_occation: params.user_occation,
      item_id: params.item_id,
      voice_occasion: params.voice_occasion,
    });
  };

  return {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    getOutfitSuggestions,
  };
};
