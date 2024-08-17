import { useState } from "react";

import { signInAnonymously } from "firebase/auth";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type StorageError,
} from "firebase/storage";

import firebaseInstance from "@/lib/storage";
import { useItems } from "./useItems";
import * as ImagePicker from "expo-image-picker";

export default function useStorage() {
  const [progress, setProgess] = useState(0);
  const { createItem } = useItems();
  const { storage, auth } = firebaseInstance();

  const createFile = async ({
    category_id,
    file,
  }: {
    category_id: number;
    file: ImagePicker.ImagePickerAsset;
  }) => {
    const uriToBuffer = async (uri: string) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    };

    signInAnonymously(auth).then(async () => {
      // User is signed in anonymously
      const storageRef = ref(storage, `items/${file.fileName}`);
      const imageBuffer = await uriToBuffer(file.uri);
      const uploadTask = uploadBytesResumable(storageRef, imageBuffer, {
        contentType: file.mimeType,
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgess((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error: StorageError) => {
          console.error("Upload failed", error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL: string) => {
              try {
                const res = await createItem({
                  name: `${file.fileName}`,
                  image_url: downloadURL,
                  category_id,
                });
              } catch (error) {
                console.log(error);
              }
            }
          );
        }
      );
    });
  };

  return {
    createFile,
    progress,
  };
}
