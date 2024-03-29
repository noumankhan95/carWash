import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  FormikProvider,
  Field,
  ErrorMessage,
  useFormik,
  FieldArray,
} from 'formik';
import * as yup from 'yup';
import userSix from '../images/user/user-06.png';
import DynamicFirebaseImageComponent from '../components/DynamicFirebaseImageComponent';
import useCategoryStore from '../store/useCategoryStore';
import useServiceAdditionStore from '../store/ServiceAdditionStore';
import { useNavigate } from 'react-router-dom';
import toast, { LoaderIcon } from 'react-hot-toast';
import { collection, getDocs } from 'firebase/firestore';
//@ts-ignore
import { db } from '../firebase';
import useUpselling from '../store/useUpsellingStore';
import useGlobalStore from '../store/globalStore';

type filesArray = {
  url: File | string;
};
const validationSchema = yup.object().shape({
  Name: yup.string().required(' Name is Required').min(3),
  'Arabic Name': yup.string().required('Arabic Name is Required'),
  type: yup.string().required('Type is required'),
  modifiers: yup.array().when('type', {
    is: (type: string) => type === 'Service',
    then: () =>
      yup
        .array()
        .of(
          yup.object().shape({
            name: yup.string().required('Name is Required'),
            price: yup
              .number()
              .required('Price is Required')
              .min(1, 'Price Should be greater than 1')
              .default(0),
          }),
        )
        .required('Modifiers are Required') as any,
    otherwise: () => yup.array().notRequired() as any, // Define validation for other cases if needed
  }),
  price: yup
    .number()
    .when('type', ([type], schema) =>
      type == 'Product'
        ? schema.required('Price is Required')
        : schema.notRequired(),
    ),
  service: yup
    .string()
    .when('type', ([type], schema) =>
      type == 'Service'
        ? schema.required('Service is Required')
        : schema.notRequired(),
    ),
});

function AddUpselling() {
  const [isloading, setisloading] = useState<boolean>(false);
  const [categoriesList, setcategoriesList] = useState<string[]>([]);
  const navigate = useNavigate();
  const { isEditing, addUpsellingTodb, updateinDb, item } = useUpselling();
  const [images, setimages] = useState<filesArray[]>(item.file);
  console.log('item', item);
  const { services: gservices } = useGlobalStore();
  const formikObj = useFormik<UpsellingFormik>({
    initialValues: {
      Name: item.name || '',
      'Arabic Name': item.arabicName || '',
      type: item.type || '',
      modifiers: item.modifiers || [],
      price: parseInt(item.price) || 0,
      service: item.service?.name || '',
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      setisloading(true);
      console.log(values);
      try {
        console.log(values);
        if (images.length <= 0) {
          toast.error('Add Upselling Image');
          return;
        }
        if (
          images.some((f) => {
            if (f.url instanceof File && f.url.size > 2 * 1024 * 1024) {
              return true;
            }
            return false;
          })
        ) {
          toast.error('Image Size should be Less than 2MB');
          return;
        }
        const selectedService = gservices.find(
          (s) => s.name === values.service,
        );
        if (!selectedService) {
          toast.error('No Selected Service');

          return;
        }
        if (isEditing.value) {
          await updateinDb({
            name: values.Name,
            arabicName: values['Arabic Name'],
            price: values.price.toString(),
            type: values.type,
            file: images,
            id: isEditing.id,
            modifiers: values.modifiers,
            service: selectedService,
          });
        } else {
          await addUpsellingTodb({
            name: values.Name,
            arabicName: values['Arabic Name'],
            price: values.price.toString(),
            modifiers: values.modifiers,
            type: values.type,
            file: images,
            service: selectedService,
          });
        }
        navigate('/upsellings');
      } catch (e) {
        toast.error('Couldnt Upload Your Files');
      } finally {
        setisloading(false);
      }
    },
  });
  const removeImageFromImages = useCallback((img: string | File) => {
    if (typeof img == 'string') {
      setimages((p) =>
        p.filter((image) => {
          return typeof image.url == 'string' ? image.url !== img : true;
        }),
      );
    } else if (img instanceof File) {
      setimages((p) =>
        p.filter((image) => {
          return image.url instanceof File ? image.url.name !== img.name : true;
        }),
      );
    }
  }, []);
  const MemoizedImages = useMemo(() => {
    return (
      <div className="flex flex-row flex-wrap justify-center items-center py-3">
        {images &&
          images?.map(
            (i) =>
              i.url !== '' && (
                <div
                  className="w-80 my-3 mx-3 md:my-0 relative "
                  key={i.url.toString() + Math.random() * 100000}
                >
                  {i.url instanceof File ? (
                    <>
                      <svg
                        fill="#ff0000"
                        width="18px"
                        height="18px"
                        viewBox="0 0 32 32"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#ff0000"
                        className="cursor-pointer"
                        onClick={() => {
                          removeImageFromImages(i.url);
                        }}
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <title>cancel</title>
                          <path d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z"></path>
                        </g>
                      </svg>
                      {i.url.name.includes('mp4') ||
                      i.url.name.includes('mp3') ? (
                        <video width="320" height="240" controls>
                          <source
                            src={`${URL.createObjectURL(i.url)}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={`${URL.createObjectURL(i.url)}`}
                          className="max-w-full object-contain"
                        />
                      )}
                    </>
                  ) : (
                    <DynamicFirebaseImageComponent
                      storagePath={i.url}
                      removeImage={removeImageFromImages}
                    />
                  )}
                </div>
              ),
          )}
      </div>
    );
  }, [images]);
  const getCategoriesList = useCallback(async () => {
    try {
      setisloading(true);
      const items = await getDocs(collection(db, 'categories'));
      const categories: Array<string> = [];
      if (!items.empty) {
        items.forEach((item) => categories.push(item.data()?.name));
      }
      setcategoriesList(categories);
    } catch (e) {
      console.log(e);
    } finally {
      setisloading(false);
    }
  }, []);
  useEffect(() => {
    getCategoriesList();
  }, []);
  return (
    <FormikProvider value={formikObj}>
      <form onSubmit={formikObj.handleSubmit}>
        <div className="flex flex-col gap-5.5 p-6.5">
          <h1>Service Information</h1>
          <div className="overflow-hidden rounded-sm border border-strokeshadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="px-4 py-5 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <h1>Choose Image Or Video</h1>
              <div className="relative z-30 mx-auto  h-30 w-full max-w-30 rounded-full  p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                <div className="relative drop-shadow-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {' '}
                      <path
                        d="M14.2639 15.9375L12.5958 14.2834C11.7909 13.4851 11.3884 13.086 10.9266 12.9401C10.5204 12.8118 10.0838 12.8165 9.68048 12.9536C9.22188 13.1095 8.82814 13.5172 8.04068 14.3326L4.04409 18.2801M14.2639 15.9375L14.6053 15.599C15.4112 14.7998 15.8141 14.4002 16.2765 14.2543C16.6831 14.126 17.12 14.1311 17.5236 14.2687C17.9824 14.4251 18.3761 14.8339 19.1634 15.6514L20 16.4934M14.2639 15.9375L18.275 19.9565M18.275 19.9565C17.9176 20 17.4543 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4.12796 18.7313 4.07512 18.5321 4.04409 18.2801M18.275 19.9565C18.5293 19.9256 18.7301 19.8727 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V16.4934M4.04409 18.2801C4 17.9221 4 17.4575 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.4934M17 8.99989C17 10.1045 16.1046 10.9999 15 10.9999C13.8954 10.9999 13 10.1045 13 8.99989C13 7.89532 13.8954 6.99989 15 6.99989C16.1046 6.99989 17 7.89532 17 8.99989Z"
                        stroke="#229ea0"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{' '}
                    </g>
                  </svg>
                  <label
                    htmlFor="file"
                    className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                  >
                    <svg
                      className="fill-current"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                        fill=""
                      />
                    </svg>
                    <input
                      type="file"
                      name="file"
                      id="file"
                      value=""
                      className="sr-only"
                      onChange={(e: any) => {
                        setimages((p) => [...p, { url: e.target.files?.[0]! }]);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
            <>{MemoizedImages}</>
          </div>
          <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Name
              </label>
              <Field
                type="text"
                name="Name"
                placeholder="Name"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="Name"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Arabic Name
              </label>
              <Field
                type="text"
                name="Arabic Name"
                placeholder=" Arabic Name"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="Arabic Name"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Type
              </label>
              <Field
                as="select"
                type="text"
                name="type"
                placeholder="type"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  if (e.target.value === 'Product' || e.target.value === '') {
                    formikObj.setFieldValue('type', e.target.value);
                    formikObj.setFieldValue('modifiers', []);
                  } else {
                    formikObj.setFieldValue('type', e.target.value);
                  }
                }}
              >
                <option value={''}>select</option>
                <option value={'Product'}>Product</option>
                <option value={'Service'}>Service</option>
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            {formikObj.values.type === 'Product' && (
              <div className="w-full md:w-2/5">
                <label className="mb-3 block text-black dark:text-white">
                  Price in AED
                </label>
                <Field
                  type="number"
                  name="price"
                  placeholder="Price"
                  className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-danger"
                />
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            {formikObj.values.type === 'Service' && (
              <div className="w-full md:w-2/5">
                <label className="mb-3 block text-black dark:text-white">
                  Service
                </label>
                <Field
                  as="select"
                  type="text"
                  name="service"
                  placeholder="Service"
                  className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option>Select</option>
                  {gservices.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </Field>

                <ErrorMessage
                  name={`service`}
                  component="div"
                  className="text-danger"
                />
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            {formikObj.values.type === 'Service' && (
              <div className="w-full md:w-2/5">
                <label className="mb-3 block text-black dark:text-white">
                  Modifiers
                </label>
                <Field
                  as="select"
                  type="text"
                  name="modifiers"
                  placeholder="Price"
                  className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    if (
                      !formikObj.values.modifiers?.some((r) =>
                        r.name.includes(e.target.value),
                      )
                    ) {
                      formikObj.setFieldValue('modifiers', [
                        ...(formikObj.values.modifiers || []),
                        { name: e.target.value, price: 0 },
                      ]);
                    }
                  }}
                >
                  <option>Select</option>
                  <option>SUV</option>
                  <option>Sedan</option>
                  <option>Luxury</option>
                </Field>

                <ErrorMessage
                  name={`modifiers`}
                  component={({ children }: any) => (
                    <div
                      className={`text-danger ${
                        typeof children === 'object' ? 'object-error' : ''
                      }`}
                    >
                      {typeof children === 'object' && children !== null
                        ? // Render differently for object error
                          null
                        : // Render differently for other types of errors
                          children}
                    </div>
                  )}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            {formikObj.values.modifiers?.map((i, idx) => {
              return (
                <div
                  key={i.name}
                  className="w-full flex-col items-center justify-evenly md:w-2/5"
                >
                  <div className="w-full flex items-center space-x-4">
                    <label>{i.name}</label>
                    <Field
                      type="number"
                      name={`modifiers[${idx}].price`}
                      placeholder="Price"
                      className="w-4/5  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <Field
                      as="select"
                      name={`modifiers[${idx}].time`}
                      className="relative z-0 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                      <option value="00:00">00:00</option>
                      <option value="00:15">00:15</option>
                      <option value="00:30">00:30</option>
                      <option value="00:45">00:45</option>
                      <option value="01:00">01:00</option>
                      <option value="01:15">01:15</option>
                      <option value="01:30">01:30</option>
                      <option value="01:45">01:45</option>
                      <option value="02:00">02:00</option>
                      <option value="02:15">02:15</option>
                      <option value="02:30">02:30</option>
                      <option value="02:45">02:45</option>
                      <option value="03:00">03:00</option>
                      <option value="03:15">03:15</option>
                      <option value="03:30">03:30</option>
                      <option value="03:45">03:45</option>
                      <option value="04:00">04:00</option>
                      <option value="04:15">04:15</option>
                      <option value="04:30">04:30</option>
                      <option value="04:45">04:45</option>
                      <option value="05:00">05:00</option>
                      <option value="05:15">05:15</option>
                      <option value="05:30">05:30</option>
                      <option value="05:45">05:45</option>
                      <option value="06:00">06:00</option>
                      <option value="06:15">06:15</option>
                      <option value="06:30">06:30</option>
                      <option value="06:45">06:45</option>
                      <option value="07:00">07:00</option>
                      <option value="07:15">07:15</option>
                      <option value="07:30">07:30</option>
                      <option value="07:45">07:45</option>
                      <option value="08:00">08:00</option>
                    </Field>
                    <svg
                      viewBox="0 0 512 512"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#ff0000"
                      stroke="#ff0000"
                      height={30}
                      width={30}
                      className="cursor-pointer"
                      onClick={async () => {
                        const filterd = formikObj.values.modifiers?.filter(
                          (it) => it.name !== i.name,
                        );
                        formikObj.setFieldValue('modifiers', filterd);
                      }}
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <title>cancel</title>
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="work-case"
                            fill="#fa0000"
                            transform="translate(91.520000, 91.520000)"
                          >
                            <polygon
                              id="Close"
                              points="328.96 30.2933333 298.666667 1.42108547e-14 164.48 134.4 30.2933333 1.42108547e-14 1.42108547e-14 30.2933333 134.4 164.48 1.42108547e-14 298.666667 30.2933333 328.96 164.48 194.56 298.666667 328.96 328.96 298.666667 194.56 164.48"
                            ></polygon>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>

                  <ErrorMessage
                    name={`modifiers[${idx}].price`}
                    component="div"
                    className="text-danger"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <button
          className="w-52 rounded bg-primary p-3 font-medium text-gray"
          type="submit"
        >
          {isloading ? (
            <LoaderIcon style={{ height: 30, width: 30, margin: 'auto' }} />
          ) : isEditing.value ? (
            'Update'
          ) : (
            'Save'
          )}
        </button>
      </form>
    </FormikProvider>
  );
}

export default AddUpselling;
