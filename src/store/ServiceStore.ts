import { create } from 'zustand';

const useWorkerStore = create<StaffWorker>((set) => ({
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
}));

export default useWorkerStore;
