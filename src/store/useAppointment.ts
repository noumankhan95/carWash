import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { create } from 'zustand';
//@ts-ignore
import { db } from '../firebase.js';
const useAppointment = create<AppointmentStore>((set, get) => ({
  appointmentDetails: {
    bookingDate: '',
    service: { id: '', name: '' },
    travelTime: '',
    washer: { id: '', name: '' },
  },
  customer: {
    address: '',
    instructions: '',
    name: '',
    number: '',
  },
  vehicle: { vinstructions: '', vtype: '' },
  async addtoDb() {
    try {
      const { customer, vehicle, appointmentDetails } = get();
      await addDoc(collection(db, 'appointments'), {
        appointmentDetails,
        customer,
        vehicle,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  setAppointment(a) {
    set((state) => ({ ...state, appointmentDetails: a }));
  },
  setCustomer(a) {
    set((state) => ({ ...state, customer: a }));
  },
  setvehicle(a) {
    set((state) => ({ ...state, vehicle: a }));
  },
}));

export default useAppointment;
