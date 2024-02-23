import { create } from 'zustand';
// @ts-ignore
import { db, storage } from '../firebase.js';
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  arrayUnion,
} from 'firebase/firestore';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
const useWorkerStore = create<StaffWorker>((set, get) => ({
  userAuth: { email: '', password: '' },
  Service: { services: [] },
  isEditing: { value: false, id: '' },
  ServingArea: [],
  StaffMember: {
    ArabicName: '',
    file: [],
    Name: '',
    phone: '',
    email: '',
    permissions: [],
  },
  Timings: {
    Monday: { from: '', to: '', enabled: false },
    Tuesday: { from: '', to: '', enabled: false },
    Wednesday: { from: '', to: '', enabled: false },
    Thursday: { from: '', to: '', enabled: false },
    Friday: { from: '', to: '', enabled: false },
    Saturday: { from: '', to: '', enabled: false },
    Sunday: { from: '', to: '', enabled: false },
  },
  setServiceValue(QVal) {
    try {
      set((state) => {
        const v = state.Service.services.findIndex(
          (e) => e.serviceName === QVal.serviceName,
        );
        if (v == -1) {
          state.Service.services.push(QVal);
        } else {
          state.Service.services[v].Modifiers = QVal.Modifiers;
        }
        console.log('State,service ind ', state.Service.services[v]);

        console.log('State,service ', state.Service.services);
        return { ...state };
      });
    } catch (e) {
      console.log(e);
    }
  },
  removeServiceValue(Qval) {
    set((state) => {
      state.Service.services = state.Service.services.filter((v) => v !== Qval);
      return { ...state };
    });
  },
  addServingArea(Qval) {
    set((state) => {
      // state.ServingArea.push(Qval);
      return { ...state, ServingArea: Qval };
    });
  },
  removeServingArea(Qval) {
    set((state) => {
      // state.ServingArea = state.ServingArea.filter(
      //   (s) => s.Location !== Qval.Location,
      // );
      return { ...state };
    });
  },

  updateStaffMember(Qval) {
    set((state) => {
      return { ...state, StaffMember: Qval };
    });
  },
  updateTimings(timings) {
    set((state) => {
      return { ...state, Timings: timings };
    });
  },
  addToDb: async (uid: string) => {
    try {
      const state = get();
      console.log(state, 'staff');
      const images: { url: string }[] = [];

      const uploadPromises = state.StaffMember.file.map(async (file) => {
        if (file.url == typeof String) {
          return;
        } else if (file.url instanceof File) {
          let name = `staff/${state.StaffMember.Name}/${file.url.name}`;

          try {
            await uploadBytes(ref(storage, name), file.url);
            const constructedURL = await getDownloadURL(ref(storage, name));
            images.push({ url: constructedURL });
            console.log('File Uploaded');
          } catch (e) {
            alert(e);
            throw e;
          }
        }
      });

      // Wait for all file uploads to complete
      await Promise.all(uploadPromises);
      await setDoc(doc(db, 'staff', uid), {
        Service: state.Service,
        ServingArea: state.ServingArea,
        StaffMember: { ...state.StaffMember, file: arrayUnion(...images) },
        Timings: state.Timings,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  EditItem(Qval) {
    set((state) => {
      return {
        ...state,
        Service: Qval.Service,
        ServingArea: Qval.ServingArea,
        StaffMember: Qval.StaffMember,
        Timings: Qval.Timings,
      };
    });
  },
  EmptyFields() {
    set((state) => ({
      Service: { services: [] },
      ServingArea: [],
      StaffMember: {
        ArabicName: '',
        file: [],
        Name: '',
        phone: '',
        email: '',
        permissions: [],
      },
      Timings: {
        Monday: { from: '', to: '', enabled: false },
        Tuesday: { from: '', to: '', enabled: false },
        Wednesday: { from: '', to: '', enabled: false },
        Thursday: { from: '', to: '', enabled: false },
        Friday: { from: '', to: '', enabled: false },
        Saturday: { from: '', to: '', enabled: false },
        Sunday: { from: '', to: '', enabled: false },
      },
      userAuth: { email: '', password: '' },
    }));
  },
  setIsEditing(id: string) {
    set((state) => ({
      ...state,
      isEditing: { value: true, id },
    }));
  },
  addEditedItemtoDb: async () => {
    // const timeStamp = db.firestore.FieldValue.serverTimestamp();
    try {
      const state = get();
      const images: { url: string }[] = [];

      const uploadPromises = state.StaffMember.file.map(async (file) => {
        if (file.url == typeof String) {
          return;
        } else if (file.url instanceof File) {
          let name = `staff/${state.StaffMember.Name}/${file.url.name}`;

          try {
            await uploadBytes(ref(storage, name), file.url);
            const constructedURL = await getDownloadURL(ref(storage, name));
            images.push({ url: constructedURL });
            console.log('File Uploaded');
          } catch (e) {
            alert(e);
            throw e;
          }
        }
      });

      // Wait for all file uploads to complete
      await Promise.all(uploadPromises);
      await setDoc(doc(db, 'staff', state.isEditing.id), {
        Service: state.Service,
        ServingArea: state.ServingArea,
        StaffMember: { ...state.StaffMember, file: arrayUnion(...images) },
        Timings: state.Timings,
        updatedAt: serverTimestamp(),
      });

      return { ...state };
    } catch (e) {
      console.log('e');
      throw e;
    }
  },
  setIsNotEditing() {
    set((state) => ({ ...state, isEditing: { value: false, id: '' } }));
  },
  setUserAuth(email, password) {
    set((state) => ({ ...state, userAuth: { email, password } }));
  },
}));

export default useWorkerStore;
