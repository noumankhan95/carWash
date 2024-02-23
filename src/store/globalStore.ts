import { create } from 'zustand';

const useGlobalStore = create<GlobalStore>((set) => ({
  categories: [],
  services: [],
  workers: [],
  reloadCategories: false,
  setreloadCategories() {
    set((state) => ({ ...state, reloadCategories: !state.reloadCategories }));
  },
  setcategories(c) {
    set((state) => ({ ...state, categories: c }));
  },
  setservices(c) {
    set((state) => ({ ...state, services: c }));
  },
  setworkers(c) {
    set((state) => ({ ...state, workers: c }));
  },
}));

export default useGlobalStore;
