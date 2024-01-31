import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { create } from 'zustand';
// @ts-ignore
import { db, storage } from '../firebase.js';
import { uploadBytes, ref } from 'firebase/storage';
const useCategoryStore = create<CategoryAddition>((set, get) => ({
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
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  isEditing: { id: '', value: false },
  setIsEditing(c) {
    set((state) => ({ ...state, isEditing: { value: true, id: c } }));
  },
  async updateinDb(c) {
    {
      try {
        const st = get();
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
        await updateDoc(doc(db, 'categories', st.isEditing.id), {
          name: c.name,
          image: arrayUnion(...images),
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  },
  setIsNotEditing() {
    set((state) => ({ ...state, isEditing: { value: false, id: '' } }));
  },
}));

export default useCategoryStore;
