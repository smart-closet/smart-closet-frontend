import store from "@/store";
import { api } from "./api";
import { Item } from "./useItems";

export interface Outfit {
  id: number;
  name: string;
  items: Item[];
}

interface UseItemsReturn {
  createOutfit: (item_ids: number[]) => Promise<Outfit[]>;
  updateOutfit: (id: number, outfit: Outfit) => Promise<Outfit>;
  deleteOutfit: (id: number) => Promise<void>;
  getOutfit: (id: number) => Promise<Outfit>;
  getOutfits: () => Promise<Outfit[]>;
}

export const useOutfits = (): UseItemsReturn => {
  const createOutfit = async (item_ids: number[]) => {
    const outfit = await api.post("outfits", { item_ids })
    store.dispatch({ type: 'ADD_OUTFIT', payload: outfit });

    return outfit;
  };

  const updateOutfit = async (id: number, outfit: Outfit) => {
    return await api.put(`outfits/${id}`, outfit);
  };

  const deleteOutfit = async (id: number) => {
    return await api.delete(`outfits/${id}`);
  };

  const getOutfit = async (id: number) => {
    return await api.get(`outfits/${id}`);
  };

  const getOutfits = async () => {
    return await api.get("outfits");
  };

  return {
    createOutfit,
    updateOutfit,
    deleteOutfit,
    getOutfit,
    getOutfits,
  };
};
