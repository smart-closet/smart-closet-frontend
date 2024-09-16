import { api } from "./api";
import * as ImagePicker from "expo-image-picker";

// Define MyImage type
export interface MyImage {
  id: number;
  user_id: number;
  image_url: string;
}

// Define return types for the CRUD operations
interface UseMyImagesReturn {
  getMyImages: () => Promise<MyImage[]>;
  getMyImage: (id: number) => Promise<MyImage>;
  createMyImage: (image: ImagePicker.ImagePickerAsset) => Promise<MyImage>;
  updateMyImage: (id: number, MyImage: MyImage) => Promise<MyImage>;
  deleteMyImage: (id: number) => Promise<void>;
}

export const useMyImages = (): UseMyImagesReturn => {
  const getMyImages = async () => {
    return await api.get("my-images");
  };

  const getMyImage = async (id: number) => {
    return await api.get(`my-images/${id}`);
  };

  const uriToBuffer = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const createMyImage = async (image: ImagePicker.ImagePickerAsset) => {
    const formData = new FormData();
    const imageBuffer = await uriToBuffer(image.uri);
    formData.append("image", imageBuffer, `${image.fileName}`);

    return await api.post("my-images", formData);
  };

  const updateMyImage = async (id: number, MyImage: MyImage) => {
    return await api.put(`my-images/${id}`, MyImage);
  };

  const deleteMyImage = async (id: number) => {
    return await api.delete(`my-images/${id}`);
  };

  return {
    getMyImages,
    getMyImage,
    createMyImage,
    updateMyImage,
    deleteMyImage,
  };
};
