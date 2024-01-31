import { create } from 'zustand';

const useServiceAdditionStore = create<ServiceAddition>((set) => ({
  serviceItem: {
    description: '',
    image: { url: '' },
    name: '',
    video: { url: '' },
  },
  setServiceAdditionItem(c) {
    set((state) => ({ ...state, serviceItem: c }));
  },
}));

export default useServiceAdditionStore;
