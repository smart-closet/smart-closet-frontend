import { api } from "./api";

// Define Item type
export interface Item {
  id: number;
  name: string;
  image_url: string;
  attributes?: Attribute[];
  category_id: number;
  category: Category;
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

interface OutfitPair {
  top: Item;
  bottom: Item;
  score: number;
}

interface OutfitSuggestionParams {
  city: string;
  place: string;
  consider_weather: boolean;
  user_occation: string;
}

// Define return types for the CRUD operations
interface UseItemsReturn {
  getItems: () => Promise<Item[]>;
  getItem: (id: number) => Promise<Item>;
  createItem: (item: Omit<Omit<Item, 'category'>, 'id'>) => Promise<Item>;
  updateItem: (id: number, item: Item) => Promise<Item>;
  deleteItem: (id: number) => Promise<void>;
  getOutfitSuggestions: (params: OutfitSuggestionParams) => Promise<OutfitPair[]>;
}

// Custom hook to handle item CRUD operations
export const useItems = (): UseItemsReturn => {
  const getItems = async () => {
    return await api.get("items");
  };

  const getItem = async (id: number) => {
    return await api.get(`items/${id}`);
  };

  const createItem = async (item: Omit<Omit<Item, 'category'>, 'id'>) => {
    console.log("item", item);
    return await api.post("items", item);
  };

  const updateItem = async (id: number, item: Item) => {
    return await api.put(`items/${id}`, item);
  };

  const deleteItem = async (id: number) => {
    return await api.delete(`items/${id}`);
  };

  const getOutfitSuggestions = async (params: OutfitSuggestionParams): Promise<OutfitPair[]> => {
    return await api.post(`rulebase/`, params);
  };

  return { getItems, getItem, createItem, updateItem, deleteItem, getOutfitSuggestions };
};
