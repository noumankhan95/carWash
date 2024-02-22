import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
//@ts-ignore
import { db } from '../firebase.js';

import useAppointment from '../store/useAppointment.js';
type Orders = {
  id: string;
  orderNumber: string;
  customer: string;
  service: string;
  worker: string;
  total: number;
  status: string;
  type: string;
  appointmentDate: Timestamp;
  paymentMethod: string;
  selectedDate: Timestamp;
  selectedTime: string;

  uid: string;
};
function AppointmentDetails() {
  const { state } = useLocation();
  const [orderStatus, setorderStatus] = useState<string>('');
  const [isloading, setisloading] = useState<boolean>(false);
  const {
    appointmentDetails: { bookingDate, service, travelTime, washer },
    customer: { address, instructions, name, number },
    vehicle: { vinstructions, vtype },
  } = useAppointment();
  return (
    <div>
      <h1 className="text-4xl text-black dark:text-white">Order Details</h1>
      <div className="flex flex-col gap-5.5 p-6.5">
        {/* <h1 className="text-2xl text-black dark:text-white">
          Placed <OrderTimeAgo orderTimestamp={order.appointmentDate} />
        </h1> */}
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <h1 className="text-xl text-black dark:text-white">
            Appointment Id : {state.appid}
          </h1>
        </div>

        <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-7.5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full">
            <div>
              <h1>Booking Date</h1>
              <div className="inline-flex items-center justify-center gap-2.5 rounded-md bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                {bookingDate}
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
        <h1>Customer Details</h1>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Customer Number
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">{number}</h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Customer Name
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">{name}</h2>
          </div>
        </div>
        <div className="w-full md:w-2/5">
          <h1 className="mb-3 block text-black dark:text-bodydark">
            Customer Address
          </h1>
          <h1 className="mb-3 block text-black dark:text-white">{address}</h1>
        </div>
        <div className="w-full md:w-2/5">
          <h1 className="mb-3 block text-black dark:text-bodydark">
            Customer Instructions
          </h1>
          <h1 className="mb-3 block text-black dark:text-white">
            {instructions}
          </h1>
        </div>
      </div>
      <hr />
      <div>
        <h1 className="text-2xl text-black dark:text-white my-4">
          Appointment Details
        </h1>
        <div className="flex flex-col lg:space-x-60 lg:flex-row">
          <div>
            <h1 className=" block text-black dark:text-bodydark">
              Appointment Date
            </h1>
            <h2 className="block text-black dark:text-white">{bookingDate}</h2>
          </div>
          <div>
            <h1 className=" block text-black dark:text-bodydark">Washer</h1>
            <h2 className="block text-black dark:text-white">{washer.name}</h2>
          </div>
          <div>
            <h1 className=" block text-black dark:text-bodydark">Service</h1>
            <h2 className="block text-black dark:text-white">{service.name}</h2>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl text-black dark:text-white my-4">
          Vehicle Instructions
        </h1>
        <div className="flex flex-col lg:space-x-60 lg:flex-row">
          <div>
            <h1 className=" block text-black dark:text-bodydark">
              Vehicle Type
            </h1>
            <h2 className="block text-black dark:text-white">{vtype}</h2>
          </div>
          <div>
            <h1 className=" block text-black dark:text-bodydark">
              Vehicle Instructions
            </h1>
            <h2 className="block text-black dark:text-white">
              {vinstructions}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetails;
