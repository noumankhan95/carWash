import { create } from 'zustand';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
//@ts-ignore
import { db, storage } from '../firebase';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
const useServiceAdditionStore = create<ServiceAddition>((set, get) => ({
  serviceItem: {
    description: '',
    file: [],
    name: '',
    category: '',
    arabicDescription: '',
  },
  isEditing: { value: false, id: '' },
  setIsNotEditing() {
    set((state) => ({ ...state, isEditing: { value: false, id: '' } }));
  },
  setIsEditing(c) {
    set((state) => ({ ...state, isEditing: { value: true, id: c } }));
  },
  setServiceAdditionItem(c) {
    set((state) => ({ ...state, serviceItem: c }));
  },
  async addServiceTodb(c) {
    try {
      const fs: { url: string }[] = [];
      const pdocs = await getDocs(
        query(collection(db, 'categories'), where('name', '==', c.name)),
      );
      if (!pdocs.empty) throw 'Category Already Exists';
      const uploadPromises = c.file.map(async (f) => {
        console.log(f);
        if (typeof f.url === 'string') {
          return;
        } else if (f.url instanceof File) {
          let name = `services/${c.name}/${f.url.name}`;

          try {
            const r = await uploadBytes(ref(storage, name), f.url);
            const constructedURL = await getDownloadURL(ref(storage, name));
            fs.push({ url: constructedURL });
            console.log('f Uploaded');
          } catch (e) {
            // alert(e);
            throw e;
          }
        }
      });

      // Wait for all file uploads to complete
      await Promise.all(uploadPromises);
      await addDoc(collection(db, 'services'), {
        name: c.name,
        description: c.description,
        arabicDescription: c.arabicDescription,
        file: fs,
        category: c.category,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  async updateinDb(c) {
    try {
      const fs: { url: string }[] = [];
      const st = get();
      const uploadPromises = c.file.map(async (f) => {
        console.log(f);
        if (typeof f.url === 'string') {
          return;
        } else if (f.url instanceof File) {
          let name = `services/${c.name}/${f.url.name}`;

          try {
            await uploadBytes(ref(storage, name), f.url);
            const constructedURL = await getDownloadURL(ref(storage, name));
            fs.push({ url: constructedURL });
            console.log('f Uploaded');
          } catch (e) {
            // alert(e);
            throw e;
          }
        }
      });

      // Wait for all file uploads to complete
      await Promise.all(uploadPromises);
      await updateDoc(doc(db, 'services', st.isEditing.id), {
        name: c.name,
        description: c.description,
        arabicDescription: c.arabicDescription,

        file: arrayUnion(...fs),
        category: c.category,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
}));

export default useServiceAdditionStore;
