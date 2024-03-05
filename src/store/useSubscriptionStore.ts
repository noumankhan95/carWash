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
const useSubscription = create<SubscriptionStore>((set, get) => ({
  subscription: {
    Discount: 0,
    file: [],
    showInApp: false,
    Service: {
      arabicDescription: '',
      bookingType: '',
      category: '',
      description: '',
      file: [],
      name: '',
    },
  },
  isEditing: { id: '', value: false },
  async addSubscriptionTodb(c) {
    try {
      const images: { url: string }[] = [];

      const uploadPromises = c.file.map(async (f) => {
        console.log(f);
        if (typeof f.url === 'string') {
          return;
        } else if (f.url instanceof File) {
          let name = `offers/${c.file}/${f.url.name}`;

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

      await Promise.all(uploadPromises);
      await addDoc(collection(db, 'offers'), {
        Discount: c.Discount,
        file: arrayUnion(...images),

        showInApp: c.showInApp,
        Service: c.Service,

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
  setSubscriptionItem(c) {
    set((state) => ({
      ...state,
      subscription: c,
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
          let name = `offers/${c.file}/${f.url.name}`;

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

      await Promise.all(uploadPromises);
      await updateDoc(doc(db, 'offers', c.id!), {
        Discount: c.Discount,
        file: arrayUnion(...images),
        showInApp: c.showInApp,
        Service: c.Service,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
}));

export default useSubscription;
