import React, { useCallback, useEffect, useState } from 'react';
import Modal from '../components/Modal';
import EditUserModal from '../components/EditUserModal';
import EditSubscriptionModal from '../components/EditSubscriptionModal';
import useProviderStore from '../store/useProviderStore';
import { useNavigate } from 'react-router-dom';
import { LoaderIcon } from 'react-hot-toast';
import useSubscription from '../store/useSubscriptionStore';
import { toast } from 'react-hot-toast';
import { useFormik, FormikProvider, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import useGlobalStore from '../store/globalStore';
const validationSchema = yup.object().shape({
  status: yup.boolean().default(false),
  first: yup.object().shape({
    enabled: yup.boolean().default(false),
    discount: yup.number().when('first.enabled', {
      is: (v: boolean) => {
        return v === true;
      },
      then: () => yup.string().required('Discount is required when enabled'),
      otherwise: () => yup.string().notRequired(),
    }),
  }),
  second: yup.object().shape({
    enabled: yup.boolean().default(false),
    discount: yup.string().when('second.enabled', {
      is: (val: boolean) => !!val,

      then: () => yup.string().required('Discount is required when enabled'),
      otherwise: () => yup.string().notRequired(),
    }),
  }),
  third: yup.object().shape({
    enabled: yup.boolean().default(false),
    discount: yup.string().when('third.enabled', {
      is: (val: boolean) => !!val,
      then: () => yup.string().required('Discount is required when enabled'),
      otherwise: () => yup.string().notRequired(),
    }),
  }),
});
function Subscription({ settheStep }: AddStaffMemberChildrenProps) {
  const {
    isEditing,
    setIsEditing,
    setIsNotEditing,
    updateinDb,
    addSubscriptionTodb,
    subscription,
  } = useSubscription();
  const [services, setservices] = useState<ServiceName | string>(
    subscription.service || '',
  );

  const [showEditUser, setshowEditUser] = useState(false);
  const [isloading, setisloading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { services: gservices } = useGlobalStore();
  const formikObj = useFormik({
    initialValues: {
      status: subscription.status || false,
      first: {
        discount: subscription.first.discount || 0,
        enabled: subscription.first.enabled || false,
      },
      second: {
        discount: subscription.second.discount || 0,
        enabled: subscription.second.enabled || false,
      },
      third: {
        discount: subscription.third.discount || 0,
        enabled: subscription.third.enabled || false,
      },
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      setisloading(true);
      try {
        console.log(values);
        if (services === '') {
          console.log('return');
          toast.error('Add Service First');
          return;
        }
        if (isEditing.value) {
          await updateinDb({
            ...values,
            service: services,
            id: isEditing.id,
          });
        } else {
          await addSubscriptionTodb({ ...values, service: services });
        }
        navigate('/subscriptions');
      } catch (e) {
        toast.error('Couldnt Upload Your Files');
      } finally {
        setisloading(false);
      }
    },
  });
  return (
    <FormikProvider value={formikObj}>
      <div className="flex flex-col my-6  space-y-5">
        <h1 className="font-serif text-xl">Select A Service</h1>
        <select
          className="relative z-0 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
          value={services}
          onChange={(e) => {
            setservices(e.target.value! as ServiceName);
            // setshowModal((p) => true);
          }}
        >
          <option value="">Select</option>
          {gservices.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={formikObj.handleSubmit}>
        <div className="flex w-full items-center justify-between px-3 ">
          <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Top Offers
              </h4>
            </div>
            <div className="w-full">
              <label
                htmlFor="statusBar"
                className="flex cursor-pointer select-none items-center px-5 "
              >
                {formikObj.values.status ? 'Enabled' : 'Disabled'}
                <div className="relative mx-7">
                  <Field
                    type="checkbox"
                    id="statusBar"
                    name="statusBar"
                    className="sr-only"
                    onChange={() => {
                      formikObj.setFieldValue(
                        'status',
                        !formikObj.values.status,
                      );
                    }}
                  />
                  <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                  <div
                    className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                      formikObj.values.status
                        ? '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                        : ''
                    }`}
                  >
                    <span
                      className={`hidden ${
                        formikObj.values.status && '!block'
                      }`}
                    >
                      <svg
                        className="fill-white dark:fill-black"
                        width="11"
                        height="8"
                        viewBox="0 0 11 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                          fill=""
                          stroke=""
                          strokeWidth="0.4"
                        ></path>
                      </svg>
                    </span>
                    <span className={`${formikObj.values.status && 'hidden'}`}>
                      <svg
                        className="h-4 w-4 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-4 md:px-6 2xl:px-7.5">
              <div className="col-span-1 flex items-center">
                <p className="font-medium"></p>
              </div>
              <div className="col-span-1 hidden items-center sm:flex">
                <p className="font-medium">Package Name</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Total Washes</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Discount Percent</p>
              </div>
            </div>

            <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-4 md:px-6 2xl:px-7.5">
              <div>
                <label
                  htmlFor="toggle1"
                  className="flex cursor-pointer select-none items-center"
                >
                  <div className="relative">
                    <Field
                      type="checkbox"
                      id="toggle1"
                      name="toggle1"
                      className="sr-only"
                      onChange={() => {
                        formikObj.setFieldValue('first', {
                          ...formikObj.values.first,
                          enabled: !formikObj.values.first.enabled,
                        });
                      }}
                    />
                    <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                    <div
                      className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                        formikObj.values.first.enabled
                          ? '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                          : ''
                      }`}
                    >
                      <span
                        className={`hidden ${
                          formikObj.values.first.enabled && '!block'
                        }`}
                      >
                        <svg
                          className="fill-white dark:fill-black"
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill=""
                            stroke=""
                            strokeWidth="0.4"
                          ></path>
                        </svg>
                      </span>
                      <span
                        className={`${
                          formikObj.values.first.enabled && 'hidden'
                        }`}
                      >
                        <svg
                          className="h-4 w-4 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </label>
              </div>
              <div className="col-span-1 flex items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <p className="text-sm text-black dark:text-white">
                    Once Per Week
                  </p>
                </div>
              </div>
              <div className="col-span-1 flex items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <p className="text-sm text-black dark:text-white">4 Washes</p>
                </div>
              </div>
              <div className="col-span-1 hidden items-center sm:flex">
                <Field
                  type="text"
                  placeholder="%"
                  name="first.discount"
                  className="w-full bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                {/* Display validation error if any */}
                <ErrorMessage
                  name="first.discount"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-4 md:px-6 2xl:px-7.5">
              <div>
                <label
                  htmlFor="toggle2"
                  className="flex cursor-pointer select-none items-center"
                >
                  <div className="relative">
                    <Field
                      type="checkbox"
                      id="toggle2"
                      name="toggle2"
                      className="sr-only"
                      onChange={() => {
                        formikObj.setFieldValue('second', {
                          ...formikObj.values.second,
                          enabled: !formikObj.values.second.enabled,
                        });
                      }}
                    />
                    <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                    <div
                      className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                        formikObj.values.second.enabled
                          ? '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                          : ''
                      }`}
                    >
                      <span
                        className={`hidden ${
                          formikObj.values.second.enabled && '!block'
                        }`}
                      >
                        <svg
                          className="fill-white dark:fill-black"
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill=""
                            stroke=""
                            strokeWidth="0.4"
                          ></path>
                        </svg>
                      </span>
                      <span
                        className={`${
                          formikObj.values.second.enabled && 'hidden'
                        }`}
                      >
                        <svg
                          className="h-4 w-4 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </label>
              </div>
              <div className="col-span-1 flex items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <p className="text-sm text-black dark:text-white">
                    Twice Per Week
                  </p>
                </div>
              </div>
              <div className="col-span-1 flex items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <p className="text-sm text-black dark:text-white">8 Washes</p>
                </div>
              </div>

              <div className="col-span-1 hidden items-center sm:flex">
                <Field
                  type="text"
                  name="second.discount"
                  placeholder="%"
                  className="w-full bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <ErrorMessage
                  name="second.discount"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-4 md:px-6 2xl:px-7.5">
              <div>
                <label
                  htmlFor="toggle3"
                  className="flex cursor-pointer select-none items-center"
                >
                  <div className="relative">
                    <Field
                      type="checkbox"
                      id="toggle3"
                      name="toggle3"
                      className="sr-only"
                      onChange={() => {
                        formikObj.setFieldValue('third', {
                          ...formikObj.values.third,
                          enabled: !formikObj.values.third.enabled,
                        });
                      }}
                    />
                    <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                    <div
                      className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                        formikObj.values.third.enabled
                          ? '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                          : ''
                      }`}
                    >
                      <span
                        className={`hidden ${
                          formikObj.values.third.enabled && '!block'
                        }`}
                      >
                        <svg
                          className="fill-white dark:fill-black"
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill=""
                            stroke=""
                            strokeWidth="0.4"
                          ></path>
                        </svg>
                      </span>
                      <span
                        className={`${
                          formikObj.values.third.enabled && 'hidden'
                        }`}
                      >
                        <svg
                          className="h-4 w-4 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </label>
              </div>
              <div className="col-span-1 flex items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <p className="text-sm text-black dark:text-white">
                    Thrice Per Week
                  </p>
                </div>
              </div>
              <div className="col-span-1 flex items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <p className="text-sm text-black dark:text-white">
                    12 Washes
                  </p>
                </div>
              </div>

              <div className="col-span-1 hidden items-center sm:flex">
                <Field
                  name="third.discount"
                  type="text"
                  placeholder="%"
                  className="w-full bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <ErrorMessage
                  name="third.discount"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="my-6 inline-flex bg-primary items-center justify-center rounded-md border border-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          {isloading ? (
            <LoaderIcon style={{ margin: 'auto' }} className="w-4 h-4" />
          ) : (
            `${isEditing.value ? 'Update In Database' : 'Add To Database'}`
          )}
        </button>
      </form>
    </FormikProvider>
  );
}

export default Subscription;
