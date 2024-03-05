import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { create } from 'zustand';
//@ts-ignore
import { db } from '../firebase.js';
const useRoleStore = create<RoleStore>((set, get) => ({
  roles: {},
  async addtoDb() {
    try {
      const { roles } = get();
      console.log('The roles', roles);
      await setDoc(doc(db, 'roles', '4Zph9NyNOpV7rRKN300F'), {
        ...roles,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  setAppRoles(r) {
    console.log('Setting roles', r);
    set((state) => ({ ...state, roles: r }));
  },
}));

export default useRoleStore;
