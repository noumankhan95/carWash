import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FormikProvider, Field, ErrorMessage, useFormik } from 'formik';
import * as yup from 'yup';

import { LoaderIcon, toast } from 'react-hot-toast';

//@ts-ignore
import { db } from '../firebase';
import useGlobalStore from '../store/globalStore';
import useAppointment from '../store/useAppointment';
import useUserAuth from '../store/UserAuthStore';

const validationSchema = yup.object().shape({
  number: yup.string().required('Customer Number is Required').min(3),
  name: yup.string().required('Customer Name is Required').min(3),
  address: yup.string().required('Customer Address is Required').min(3),
  instructions: yup.string().notRequired(),
  bookingDate: yup.string().required('Booking Date is Required'),
  travelTime: yup.string().required('Travelling Time is Required'),
  washer: yup.string().required('Washer Name is Required'),
  service: yup.string().required('Service Name is Required'),
  vtype: yup.string().required('Vehicle Type is Required'),
  vinstructions: yup.string().notRequired(),
});

function CreateAppointment() {
  const {
    customer,
    vehicle,
    appointmentDetails,
    addtoDb,
    setAppointment,
    setCustomer,
    setvehicle,
  } = useAppointment();
  const { categories, services, workers } = useGlobalStore();
  const { id } = useUserAuth();
  const [isloading, setisloading] = useState<boolean>(false);
  const formikObj = useFormik({
    initialValues: {
      number: '',
      name: '',
      address: '',
      instructions: '',
      bookingDate: '',
      travelTime: '',
      washer: '',
      service: '',
      vtype: '',
      vinstructions: '',
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      console.log(values);
      setisloading(true);
      try {
        const {
          address,
          bookingDate,
          instructions,
          name,
          number,
          service,
          travelTime,
          vinstructions,
          vtype,
          washer,
        } = values;
        console.log(services, 'servs');

        const s = services.find((e) => e.name === service);
        const w = workers.find((e) => e.name === washer);
        console.log(s, 's');
        if (!s) throw 'No Service Exists';
        setAppointment({
          bookingDate,
          service: { id: s?.id!, name: s?.name! },
          travelTime,
          washer: {
            id: w?.id!,
            name: w?.name!,
          },
        });
        setCustomer({ address, instructions, name, number });
        setvehicle({ vinstructions, vtype });
        await addtoDb(id);
        toast.success('Appointment Added Succesfully');
        // navigate('/services');
      } catch (e) {
        console.log(e);
        toast.error('Couldnt Create Appointment');
      } finally {
        setisloading(false);
      }
    },
  });

  return (
    <FormikProvider value={formikObj}>
      <h1 className="mb-3 block text-black dark:text-white text-2xl">
        Add An Appointment
      </h1>
      <form onSubmit={formikObj.handleSubmit}>
        <div className="flex flex-col gap-5.5 p-6.5">
          <h1>Customer Information</h1>
          <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Customer Name
              </label>
              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Customer Address
              </label>
              <Field
                type="text"
                name="address"
                placeholder="Arabic Name"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Customer Number
              </label>
              <Field
                type="number"
                name="number"
                placeholder="number"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="number"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Additional Instructions
            </label>
            <Field
              as="textarea"
              placeholder="Instructions"
              name="instructions"
              className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <ErrorMessage
              name="instructions"
              component="div"
              className="text-danger"
            />
          </div>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <h1>Car Information</h1>
          <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Car Type
              </label>
              <Field
                as="select"
                type="text"
                name="vtype"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option>select</option>
                <option value={'Luxury'}>Luxury</option>
                <option value={'Sedan'}>Sedan</option>
                <option value={'SUV'}>SUV</option>
              </Field>
              <ErrorMessage
                name="vtype"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Additional Instructions
              </label>
              <Field
                as="textarea"
                name="vinstructions"
                placeholder="Instructions"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="vinstructions"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <h1>Appointment Information</h1>
          <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Booking Date
              </label>
              <Field
                type="datetime-local"
                name="bookingDate"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="bookingDate"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Travel Time
              </label>
              <Field
                name="travelTime"
                type="number"
                placeholder="Time To Travel"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="travelTime"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
          <div className="flex space-x-4 flex-col lg:flex-row lg:items-center">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Washer
              </label>
              <Field
                as="select"
                type="text"
                name="washer"
                placeholder="washer"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value={''}>select</option>
                {workers.map((c) => (
                  <option key={c.id || Math.random() * 1000} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="washer"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Service
              </label>
              <Field
                as="select"
                type="text"
                name="service"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value={''}>select</option>
                {services.map((c) => (
                  <option key={c.id || Math.random() * 1000} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="service"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
        </div>
        <button
          className="w-52 rounded bg-primary p-3 font-medium text-gray"
          type="submit"
        >
          {isloading ? (
            <LoaderIcon style={{ height: 30, width: 30, margin: 'auto' }} />
          ) : (
            'Save'
          )}
        </button>
      </form>
    </FormikProvider>
  );
}

export default CreateAppointment;
