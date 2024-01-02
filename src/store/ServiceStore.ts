import { create } from 'zustand';
// @ts-ignore
import { db } from '../firebase.js';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
const useWorkerStore = create<StaffWorker>((set) => ({
  Service: { services: [] },
  isEditing: { value: false, id: '' },
  ServingArea: [],
  StaffMember: { ArabicName: '', file: [], Name: '', phone: '' },
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
      state.ServingArea.push(Qval);
      return { ...state };
    });
  },
  removeServingArea(Qval) {
    set((state) => {
      state.ServingArea = state.ServingArea.filter(
        (s) => s.Location !== Qval.Location,
      );
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
      addDoc(collection(db, 'staff'), {
        Service: state.Service,
        ServingArea: state.ServingArea,
        StaffMember: state.StaffMember,
        Timings: state.Timings,
      })
        .then((r) => {
          console.log(r.id);
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
      StaffMember: { ArabicName: '', file: [], Name: '', phone: '' },
      Timings: {
        Monday: { from: '', to: '', enabled: false },
        Tuesday: { from: '', to: '', enabled: false },
        Wednesday: { from: '', to: '', enabled: false },
        Thursday: { from: '', to: '', enabled: false },
        Friday: { from: '', to: '', enabled: false },
        Saturday: { from: '', to: '', enabled: false },
        Sunday: { from: '', to: '', enabled: false },
      },
    }));
  },
  setIsEditing(id: string) {
    set((state) => ({ ...state, isEditing: { value: !state.isEditing, id } }));
  },
  addEditedItemtoDb() {
    set((state) => {
      setDoc(doc(db, 'staff', state.isEditing.id), {
        Service: state.Service,
        ServingArea: state.ServingArea,
        StaffMember: state.StaffMember,
        Timings: state.Timings,
      });
      return { ...state };
    });
  },
}));

export default useWorkerStore;
