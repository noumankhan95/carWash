import { create } from 'zustand';
//@ts-ignore
import { db } from '../firebase.js';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
const useProviderStore = create<ProviderInformation>((set) => ({
  providerInfo: { arabicDetails: '', arabicname: '', details: '', name: '' },
  providerAccountInfo: { callCenter: '', email: '', number: '' },
  providerAddressInfo: {
    address: '',
    arabicAddress: '',
    arabicArea: '',
    area: '',
    location: { lat: 37, lng: 40 },
  },
  isEditing: { id: '', value: false },
  Subscriptions: [],
  addToDb: async () => {
    set((state) => {
      addDoc(collection(db, 'providers'), {
        providerInfo: state.providerInfo,
        providerAccountInfo: state.providerAccountInfo,
        providerAddressInfo: state.providerAddressInfo,
        Subscriptions: state.Subscriptions,
      })
        .then((v) => {
          console.log(v);
        })
        .catch((e) => console.log(e));

      return state;
    });
  },
  EmptyFields() {
    set((state) => ({
      ...state,
      providerInfo: {
        arabicDetails: '',
        arabicname: '',
        details: '',
        name: '',
      },
      providerAccountInfo: { callCenter: '', email: '', number: '' },
      providerAddressInfo: {
        address: '',
        arabicAddress: '',
        arabicArea: '',
        area: '',
        location: { lat: 34, lng: 45 },
      },
      isEditing: { id: '', value: false },
      Subscriptions: [],
    }));
  },
  setAllProviderInformation(pinfo) {
    set((state) => ({ ...state, ...pinfo }));
  },
  setisEditing(id) {
    set((state) => ({
      ...state,
      isEditing: { value: true, id },
    }));
  },
  setisNotEditing() {
    set((state) => ({
      ...state,
      isEditing: { value: true, id: '' },
    }));
  },
  updateinDb: async () => {
    set((state) => {
      console.log(state, 'State in Update');
      updateDoc(doc(db, 'providers', state.isEditing.id), {
        providerInfo: state.providerInfo,
        providerAccountInfo: state.providerAccountInfo,
        providerAddressInfo: state.providerAddressInfo,
        Subscriptions: state.Subscriptions,
      })
        .then((r) => {
          console.log(r);
        })
        .catch((e) => console.log(e));

      return state;
    });
  },
  setsubscriptions(subs) {
    set((state) => {
      state.Subscriptions.push(subs);
      return { ...state };
    });
  },
  setallsubscriptions(subs) {
    set((state) => {
      return { ...state, Subscriptions: subs };
    });
  },
}));

export default useProviderStore;
