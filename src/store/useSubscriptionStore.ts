import { create } from 'zustand';
import { uploadBytes, ref } from 'firebase/storage';
//@ts-ignore
import { db, storage } from '../firebase';
import {
  doc,
  serverTimestamp,
  addDoc,
  updateDoc,
  collection,
} from 'firebase/firestore';
const useSubscription = create<SubscriptionStore>((set, get) => ({
  subscription: {
    first: { discount: 0, enabled: false },
    second: { discount: 0, enabled: false },
    third: { discount: 0, enabled: false },
    service: '',
    status: false,
  },
  isEditing: { id: '', value: false },
  async addSubscriptionTodb(c) {
    try {
      await addDoc(collection(db, 'subscription'), {
        ...c,
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
      await updateDoc(doc(db, 'subscription', c.id!), {
        ...c,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
}));

export default useSubscription;
