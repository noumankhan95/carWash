import React from 'react';
import * as Yup from 'yup';
import { useFormik, FormikProvider, Field, ErrorMessage } from 'formik';

const validationSchema = Yup.object().shape({
  customer: Yup.string().required('Name is required'),
  appointmentDate: Yup.date().required('Appointment Date is Required'),
  phone: Yup.number()
    .typeError('Phone must be a number')
    .required('Phone Number is required'),
  paymentMethod: Yup.string().required('Payment Method is required'),
  selectedDate: Yup.date().required('Selected Date is Required'),
  service: Yup.string().required('Service is Required'),
  type: Yup.string().required('Order Type is Required'),
  worker: Yup.string().required('Worker is Required'),
});
function AddOrder() {
  const formikObj = useFormik({
    validationSchema,
    initialValues: {
      appointmentDate: '',
      customer: '',
      phone: '',
      //   orderNumber: '',
      paymentMethod: '',
      selectedDate: '',
      service: '',
      type: '',
      worker: '',
    },
    onSubmit: (values) => {
      console.log(values);
      //   SaveStaffMemberInfo(values);
      //   if (isEditing) setUserAuth(values.email, values.password);
    },
  });
  return (
    <FormikProvider value={formikObj}>
      <form onSubmit={formikObj.handleSubmit}>
        <div className="flex flex-col gap-5.5 p-6.5">
          <h1>Create Order</h1>
          <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Customer
              </label>
              <Field
                type="text"
                name="customer"
                placeholder="Name"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="customer"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Phone
              </label>
              <Field
                type="number"
                name="phone"
                placeholder="Phone Number"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Payment Method
              </label>
              <Field
                type="text"
                name="paymentMethod"
                placeholder="Payment Method"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="paymentMethod"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Worker
              </label>
              <Field
                type="text"
                name="worker"
                placeholder="Worker"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="worker"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Service
              </label>
              <Field
                type="number"
                name="service"
                placeholder="Service Number"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="service"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Type
              </label>
              <Field
                type="text"
                name="type"
                placeholder="Order Type"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="type"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Appointment Date
              </label>
              <Field
                type="datetime-local"
                name="appointmentDate"
                placeholder="Date"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="appointmentDate"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Selected Date
              </label>
              <Field
                type="datetime-local"
                name="selectedDate"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="selectedDate"
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
          Save
        </button>
      </form>
    </FormikProvider>
  );
}

export default AddOrder;
