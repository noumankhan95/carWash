import { create } from 'zustand';
// @ts-ignore
import { db, storage } from '../firebase.js';
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { uploadBytes, ref } from 'firebase/storage';
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
    set((state) => {
      state.Service.services.push(QVal);
      return { ...state };
    });
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
  addToDb: async () => {
    set((state) => {
      console.log(state, 'staff');
      const images: { url: string }[] = [];

      const uploadPromises = state.StaffMember.file.map(async (file) => {
        if (file.url == typeof String) {
          return;
        } else if (file.url instanceof File) {
          let name = `staff/${state.StaffMember.Name}/${file.url.name}`;

          try {
            await uploadBytes(ref(storage, name), file.url);
            images.push({ url: name });
            console.log('File Uploaded');
          } catch (e) {
            alert(e);
            throw e;
          }
        }
      });

      // Wait for all file uploads to complete
      Promise.all(uploadPromises)
        .then((result) => {
          addDoc(collection(db, 'staff'), {
            Service: state.Service,
            ServingArea: state.ServingArea,
            StaffMember: { ...state.StaffMember, file: images },
            Timings: state.Timings,

            updatedAt: serverTimestamp(),
          })
            .then((r) => {
              console.log(r.id);
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));

      return { ...state };
    });
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
      await setDoc(doc(db, 'staff', state.isEditing.id), {
        Service: state.Service,
        ServingArea: state.ServingArea,
        StaffMember: state.StaffMember,
        Timings: state.Timings,
        updatedAt: serverTimestamp(),
      });
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
