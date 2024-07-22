
import create from 'zustand';

interface ImageStore {
  selectedImage: string | null;
  setSelectedImage: (url: string) => void;
  clearSelectedImage: () => void
}

export const useImgStore = create<ImageStore>((set) => ({
  selectedImage: null,
  setSelectedImage: (url) => set({ selectedImage: url }),
   clearSelectedImage: () => set({ selectedImage: null }),
}));
