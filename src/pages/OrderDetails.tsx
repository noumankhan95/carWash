import { Timestamp, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
//@ts-ignore
import { db } from '../firebase.js';
import { toast } from 'react-hot-toast';
import { LoaderIcon } from 'react-hot-toast';
import { FormikProvider, useFormik, Field, ErrorMessage } from 'formik';
import useGlobalStore from '../store/globalStore.js';
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
  ordertracking: {
    title: string;
    staff: string;
    date: string;
    comment: string;
  }[];
};
function OrderDetails() {
  const { state } = useLocation();
  const [orderStatus, setorderStatus] = useState<string>('');
  const [isloading, setisloading] = useState<boolean>(false);
  const { workers } = useGlobalStore();
  const order: Orders = state.order;

  const formikobj = useFormik({
    initialValues: {
      ordertracking: order.ordertracking || [
        {
          title: '',
          staff: '',
          date: '',
          comment: '',
        },
      ],
    },
    async onSubmit(values, formikHelpers) {
      try {
        setisloading(true);
        console.log(values);
        await updateDoc(doc(db, 'orders', order.id), {
          ordertracking: arrayUnion(...values.ordertracking),
        });
        toast.success('Success');
      } catch (e) {
        console.log(e);
        toast.error('An Error Occured');
      } finally {
        setisloading(false);
      }
    },
  });
  console.log(formikobj.errors);
  const changeOrderStatus = async () => {
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: orderStatus,
      });
      toast.success('Status Changed');
    } catch (e) {
      toast.error('Failed To Change Status');
    }
  };
  console.log(order);
  return (
    <FormikProvider value={formikobj}>
      <h1 className="text-4xl text-black dark:text-white">Order Details</h1>
      <div className="flex flex-col gap-5.5 p-6.5">
        {/* <h1 className="text-2xl text-black dark:text-white">
          Placed <OrderTimeAgo orderTimestamp={order.appointmentDate} />
        </h1> */}
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <h1 className="text-xl text-black dark:text-white">
            Order Id : {order.id}
          </h1>
          <h1 className="text-3xl text-black dark:text-meta-8">
            Total : {order.total}
          </h1>
        </div>

        <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-7.5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full">
            <div>
              <h1>Order Status</h1>
              <div className="inline-flex items-center justify-center gap-2.5 rounded-md bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                {order.status}
              </div>
            </div>
            <div>
              <h1>Change Order Status</h1>
              <div className="relative z-20 p-1 w-full rounded border border-stroke pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                <select
                  className="top-0 left-0 z-20 h-full w-full outline-none bg-transparent appearance-none cursor-pointer"
                  defaultValue={''}
                  onChange={(e) => {
                    setorderStatus(e.target.value);
                  }}
                >
                  <option
                    className="text-black px-5 my-5"
                    value={''}
                    disabled
                    hidden
                  >
                    Select
                  </option>
                  <option className="text-black px-5 my-5" value={'Pending'}>
                    Pending
                  </option>
                  <option className="text-black px-5 my-5" value={'Completed'}>
                    Completed
                  </option>
                  <option className="text-black px-5 my-5" value={'Cancelled'}>
                    Cancelled
                  </option>
                </select>
                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill="#637381"
                      ></path>
                    </g>
                  </svg>
                </span>
              </div>
            </div>

            <button
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-8 text-center font-medium text-white hover:bg-opacity-90 xl:px-5"
              onClick={changeOrderStatus}
              disabled={isloading}
            >
              {isloading ? <LoaderIcon className="w-6 h-6" /> : 'Change Status'}
            </button>
          </div>
        </div>
        <hr></hr>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Customer Number
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {order.customer}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Payment Type
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {order.paymentMethod}
            </h2>
          </div>
        </div>
        <div className="w-full md:w-2/5">
          <h1 className="mb-3 block text-black dark:text-bodydark">
            Customer Name
          </h1>
          <h1 className="mb-3 block text-black dark:text-white">
            {order.customer}
          </h1>
        </div>
        <div className="w-full md:w-2/5">
          <h1 className="mb-3 block text-black dark:text-bodydark">
            Customer Address
          </h1>
          <h1 className="mb-3 block text-black dark:text-white">{'empty'}</h1>
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
            <h2 className="block text-black dark:text-white">
              {new Date(
                order.appointmentDate.seconds * 1000 +
                  order.appointmentDate.nanoseconds / 1e6,
              ).toString()}
            </h2>
          </div>
          <div>
            <h1 className=" block text-black dark:text-bodydark">Washer</h1>
            <h2 className="block text-black dark:text-white">{order.worker}</h2>
          </div>
          <div>
            <h1 className=" block text-black dark:text-bodydark">Service</h1>
            <h2 className="block text-black dark:text-white">
              {order.service}
            </h2>
          </div>
        </div>
        <div className="flex my-10 flex-col lg:space-x-60 lg:flex-row">
          <div>
            <h1 className=" block text-black dark:text-bodydark">
              Selected Date
            </h1>
            <h2 className="block text-black dark:text-white">
              {new Date(
                order.selectedDate.seconds * 1000 +
                  order.selectedDate.nanoseconds / 1e6,
              ).toString()}
            </h2>
          </div>
          <div>
            <h1 className=" block text-black dark:text-bodydark">
              Selected Time
            </h1>
            <h2 className="block text-black dark:text-white">
              {order.selectedTime}
            </h2>
          </div>
          <div>
            <h1 className=" block text-black dark:text-bodydark">Type</h1>
            <h2 className="block text-black dark:text-white">{order.type}</h2>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl text-black dark:text-white my-4">
          Internal Order Tracking
        </h1>
        <form onSubmit={formikobj.handleSubmit}>
          {formikobj.values.ordertracking?.map((d, index) => (
            <div
              className="w-full flex flex-col lg:flex-row lg:space-x-5 my-3 "
              key={index}
            >
              <div className="w-full md:w-2/5 ">
                <label className="mb-3 block text-black dark:text-white">
                  Title
                </label>
                <Field
                  type="text"
                  name={`ordertracking.${index}.title`}
                  placeholder="Title"
                  className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <ErrorMessage
                  name={`ordertracking.${index}.title`}
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="w-full md:w-2/5">
                <label className="mb-3 block text-black dark:text-white">
                  Staff
                </label>
                <Field
                  as="select"
                  name={`ordertracking.${index}.staff`}
                  placeholder="staff"
                  className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value={''}>Select</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name={`ordertracking.${index}.staff`}
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="w-full md:w-2/5">
                <label className="mb-3 block text-black dark:text-white">
                  Time And Date
                </label>
                <Field
                  type="datetime-local"
                  name={`ordertracking.${index}.date`}
                  placeholder="date"
                  className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <ErrorMessage
                  name={`ordertracking.${index}.date`}
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="w-full md:w-2/5">
                <label className="mb-3 block text-black dark:text-white">
                  Comment
                </label>
                <Field
                  type="text"
                  name={`ordertracking.${index}.comment`}
                  placeholder="comment"
                  className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <ErrorMessage
                  name={`ordertracking.${index}.comment`}
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="w-20 flex items-end pb-2">
                {index > 0 && (
                  <svg
                    fill="#ff0000"
                    height={20}
                    width={20}
                    viewBox="0 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ff0000"
                    className="cursor-pointer"
                    onClick={() => {
                      formikobj.setFieldValue('ordertracking', [
                        ...formikobj.values.ordertracking.slice(0, -1),
                      ]);
                    }}
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {' '}
                      <title>cancel</title>{' '}
                      <path d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z"></path>{' '}
                    </g>
                  </svg>
                )}
              </div>
            </div>
          ))}
          <div className="w-full relative -ml-5 my-8">
            <svg
              viewBox="0 0 1024 1024"
              height={30}
              width={30}
              version="1.1"
              className="icon absolute right-0 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              onClick={() => {
                formikobj.setFieldValue('ordertracking', [
                  ...formikobj.values.ordertracking,
                  {
                    title: '',
                    staff: '',
                    date: '',
                    comment: '',
                  },
                ]);
              }}
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M512 1024C229.7 1024 0 794.3 0 512S229.7 0 512 0s512 229.7 512 512-229.7 512-512 512z m0-938.7C276.7 85.3 85.3 276.7 85.3 512S276.7 938.7 512 938.7 938.7 747.3 938.7 512 747.3 85.3 512 85.3z"
                  fill="#00ff2a"
                ></path>
                <path
                  d="M682.7 554.7H341.3c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7h341.3c23.6 0 42.7 19.1 42.7 42.7s-19.1 42.7-42.6 42.7z"
                  fill="#00ff1e"
                ></path>
                <path
                  d="M512 725.3c-23.6 0-42.7-19.1-42.7-42.7V341.3c0-23.6 19.1-42.7 42.7-42.7s42.7 19.1 42.7 42.7v341.3c0 23.6-19.1 42.7-42.7 42.7z"
                  fill="#00ff1e"
                ></path>
              </g>
            </svg>
          </div>

          <button
            type="submit"
            disabled={!!isloading}
            className="inline-flex my-20 items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            {isloading ? (
              <LoaderIcon style={{ height: 30, width: 30, margin: 'auto' }} />
            ) : (
              'Save'
            )}
          </button>
        </form>
      </div>
    </FormikProvider>
  );
}

export default OrderDetails;
