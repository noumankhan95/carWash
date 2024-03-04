import { create } from 'zustand';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
//@ts-ignore
import { db, storage } from '../firebase';
import {
  doc,
  serverTimestamp,
  addDoc,
  updateDoc,
  collection,
  arrayUnion,
} from 'firebase/firestore';
const useUpselling = create<upsellingStore>((set, get) => ({
  item: {
    arabicName: '',
    name: '',
    price: '',
    type: '',
    file: [],
    modifiers: [],
    service: {
      arabicDescription: '',
      bookingType: '',
      category: '',
      description: '',
      file: [],
      name: '',
    },
  },
  isEditing: { id: '', value: false },
  async addUpsellingTodb(c) {
    try {
      const images: { url: string }[] = [];

      const uploadPromises = c.file.map(async (f) => {
        console.log(f);
        if (typeof f.url === 'string') {
          return;
        } else if (f.url instanceof File) {
          let name = `upsellings/${c.name}/${f.url.name}`;

          try {
            await uploadBytes(ref(storage, name), f.url);
            const constructedURL = await getDownloadURL(ref(storage, name));
            images.push({ url: constructedURL });
            console.log('File Uploaded');
          } catch (e) {
            // alert(e);
            throw e;
          }
        }
      });

      // Wait for all file uploads to complete
      await Promise.all(uploadPromises);
      await addDoc(collection(db, 'upsellings'), {
        name: c.name,
        arabicName: c.arabicName,
        service: c.service,
        modifiers: c.type === 'Service' ? c.modifiers : [],
        type: c.type,
        price: c.type === 'Product' ? c.price : 0,
        file: images,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  setIsEditing(c) {
    set((state) => ({ ...state, isEditing: { value: true, id: c } }));
  },
  setIsNotEditing() {
    set((state) => ({ ...state, isEditing: { value: false, id: '' } }));
  },
  setUpsellingItem(c) {
    set((state) => ({
      ...state,
      item: {
        arabicName: c.arabicName,
        file: c.file,
        name: c.name,
        price: c.price,
        type: c.type,
        id: c.id,
        modifiers: c.modifiers,
        service: c.service,
        
      },
    }));
  },

  async updateinDb(c) {
    try {
      const images: { url: string }[] = [];

      const uploadPromises = c.file.map(async (f) => {
        console.log(f);
        if (typeof f.url === 'string') {
          return;
        } else if (f.url instanceof File) {
          let name = `upsellings/${c.name}/${f.url.name}`;

          try {
            await uploadBytes(ref(storage, name), f.url);
            const constructedURL = await getDownloadURL(ref(storage, name));
            images.push({ url: constructedURL });
            console.log('File Uploaded');
          } catch (e) {
            // alert(e);
            throw e;
          }
        }
      });

      // Wait for all file uploads to complete
      await Promise.all(uploadPromises);
      await updateDoc(doc(db, 'upsellings', c.id!), {
        name: c.name,
        arabicName: c.arabicName,
        type: c.type,
        modifiers: c.type === 'Service' ? c.modifiers : [],
        price: c.type === 'Product' ? c.price : 0,
        file: arrayUnion(...images),
        service: c.service,

        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
}));

export default useUpselling;
