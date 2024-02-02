import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { create } from 'zustand';
//@ts-ignore
import { db } from '../firebase.js';
const useOrderStore = create<OrderStore>((set) => ({
  order: {
    appointmentDate: '',
    customer: '',
    id: '',
    orderNumber: '',
    paymentMethod: '',
    selectedDate: '',
    service: '',
    status: '',
    total: 0,
    type: '',
    uid: '',
    worker: '',
  },
  isEditing: { id: '', value: false },
  setIsEditing(c) {
    set((state) => ({ ...state, isEditing: { value: true, id: c } }));
  },
  setIsNotEditing() {
    set((state) => ({ ...state, isEditing: { value: false, id: '' } }));
  },
  async addOrdersTodb(c) {
    try {
      await addDoc(collection(db, 'orders'), {
        ...c,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  setOrdersItem(c) {},
}));

export default useOrderStore;
