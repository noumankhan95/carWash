import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
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
      await updateDoc(doc(db, 'roles', '4Zph9NyNOpV7rRKN300F'), {
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
