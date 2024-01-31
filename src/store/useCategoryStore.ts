import { addDoc, collection } from 'firebase/firestore';
import { create } from 'zustand';
// @ts-ignore
import { db, storage } from '../firebase.js';
import { uploadBytes, ref } from 'firebase/storage';
const useCategoryStore = create<CategoryAddition>((set) => ({
  cat: { image: [], name: '' },
  setCategoryItems(c) {
    set((state) => ({ cat: { image: c.image, name: c.name } }));
  },
  async addCategoryTodb(c) {
    try {
      const images: { url: string }[] = [];

      const uploadPromises = c.image.map(async (file) => {
        console.log(file);
        if (typeof file.url === 'string') {
          return;
        } else if (file.url instanceof File) {
          let name = `categories/${c.name}/${file.url.name}`;

          try {
            await uploadBytes(ref(storage, name), file.url);
            images.push({ url: name });
            console.log('File Uploaded');
          } catch (e) {
            // alert(e);
            throw e;
          }
        }
      });

      // Wait for all file uploads to complete
      await Promise.all(uploadPromises);
      await addDoc(collection(db, 'categories'), {
        name: c.name,
        image: images,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
}));

export default useCategoryStore;
