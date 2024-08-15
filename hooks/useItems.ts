import { api } from "./api";

// Define Item type
export interface Item {
  id: number;
  name: string;
  image_url?: string;
  attributes?: Attribute[];
}

interface Attribute {
  id: number;
  name: string;
  value: string;
}

// Define return types for the CRUD operations
interface UseItemsReturn {
  getItems: () => Promise<Item[]>;
  getItem: (id: number) => Promise<Item>;
  createItem: (item: Item) => Promise<Item>;
  updateItem: (id: number, item: Item) => Promise<Item>;
  deleteItem: (id: number) => Promise<void>;
}

// Custom hook to handle item CRUD operations
export const useItems = (): UseItemsReturn => {
    const getItems = async (): Promise<Item[]> => {
        return await api.get("items");
    };
    
    const getItem = async (id: number): Promise<Item> => {
        return await api.get(`items/${id}`);
    };
    
    const createItem = async (item: Item): Promise<Item> => {
        return await api.post("items", item);
    };
    
    const updateItem = async (id: number, item: Item): Promise<Item> => {
        return await api.put(`items/${id}`, item);
    };
    
    const deleteItem = async (id: number): Promise<void> => {
        return await api.delete(`items/${id}`);
    };
    
    return { getItems, getItem, createItem, updateItem, deleteItem };
};