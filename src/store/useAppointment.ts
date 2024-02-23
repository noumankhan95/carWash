import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
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
  async addtoDb(uid: string) {
    try {
      const { customer, vehicle, appointmentDetails } = get();
      const d = await addDoc(collection(db, 'appointments'), {
        appointmentDetails,
        customer,
        vehicle,
      });
      await setDoc(doc(db, 'orders', d.id), {
        appointmentDate: appointmentDetails.bookingDate,
        customer: customer.number,
        worker: appointmentDetails.washer.name,
        workerid: appointmentDetails.washer.id,
        service: appointmentDetails.service.name,
        serviceid: appointmentDetails.service.id,
        status: 'Active',
        type: '',
        paymentMethod: '',
        selectedDate: '',
        selectedTime: '',
        orderNumber: d.id,
        uid,
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
