import { create } from 'zustand';
//@ts-ignore
import { db, storage } from '../firebase.js';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
const useProviderStore = create<ProviderInformation>((set, get) => ({
  providerInfo: {
    arabicDetails: '',
    arabicname: '',
    details: '',
    name: '',
    file: [],
  },
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
    try {
      const images: { url: string }[] = [];
      const state = get();
      const uploadPromises = state.providerInfo.file.map(async (file) => {
        if (typeof file.url == 'string') {
          return;
        } else if (file.url instanceof File) {
          let name = `providers/${state.providerInfo.name}/${file.url.name}`;

          await uploadBytes(ref(storage, name), file.url);
          const constructedURL = await getDownloadURL(ref(storage, name));
          images.push({ url: constructedURL });
          console.log('File Uploaded');
        }
      });
      await Promise.all(uploadPromises);
      await addDoc(collection(db, 'providers'), {
        providerInfo: { ...state.providerInfo, file: images },
        providerAccountInfo: state.providerAccountInfo,
        providerAddressInfo: state.providerAddressInfo,
        Subscriptions: state.Subscriptions,
      });
    } catch (e) {
      alert(e);
      throw e;
    }
  },
  EmptyFields() {
    set((state) => ({
      ...state,
      providerInfo: {
        arabicDetails: '',
        arabicname: '',
        details: '',
        name: '',
        file: [],
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
    const state = get();
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
