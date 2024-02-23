import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FormikProvider, Field, ErrorMessage, useFormik } from 'formik';
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
import useGlobalStore from '../store/globalStore';
type filesArray = {
  url: File | string;
};
const validationSchema = yup.object().shape({
  Name: yup.string().required('Category Name is Required').min(3),
  Description: yup.string().required('Description is Required'),
  category: yup.string().required('Service is required'),
  arabicDescription: yup.string().required('Arabic Description is Required'),
  arabicName: yup.string().required('Arabic Name is Required'),
});

function AddService() {
  const {
    serviceItem: {
      file: filesarr,
      name,
      description,
      category: scat,
      arabicDescription,
      arabicName,
    },
    addServiceTodb,
    isEditing,
    updateinDb,
  } = useServiceAdditionStore();
  const [images, setimages] = useState<filesArray[]>(filesarr);
  const [isloading, setisloading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { categories, services } = useGlobalStore();
  console.log('Cawrrq', scat);
  const formikObj = useFormik({
    initialValues: {
      Name: name || '',
      Description: description || '',
      category: scat || '',
      arabicDescription: arabicDescription || '',
      arabicName: arabicName || '',
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      console.log(values);
      setisloading(true);
      try {
        if (images.length <= 0) {
          toast.error('Add Category Image');
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
        if (isEditing.value) {
          await updateinDb({
            description: values.Description,
            name: values.Name,
            file: images,
            category: values.category,
            arabicDescription: values.arabicDescription,
            arabicName: values.arabicName,
          });
        } else {
          await addServiceTodb({
            description: values.Description,
            name: values.Name,
            file: images,
            category: values.category,
            arabicDescription: values.arabicDescription,
            arabicName: values.arabicName,
          });
        }
        navigate('/services');
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
  console.log('CAts', categories);
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
                          {' '}
                          <title>cancel</title>{' '}
                          <path d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z"></path>{' '}
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

  return (
    <FormikProvider value={formikObj}>
      <form onSubmit={formikObj.handleSubmit}>
        <div className="flex flex-col gap-5.5 p-6.5">
          <h1>Service Information</h1>
          <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Service Name
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
                name="arabicName"
                placeholder="Arabic Name"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="arabicName"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Service Description
              </label>
              <Field
                as="textarea"
                type="text"
                name="Description"
                placeholder="Description"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="Description"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Arabic Description
              </label>
              <Field
                as="textarea"
                type="text"
                name="arabicDescription"
                placeholder="Description"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="arabicDescription"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
          <div className="flex space-x-4 flex-col lg:flex-row lg:items-center">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Category
              </label>
              <Field
                as="select"
                type="text"
                name="category"
                placeholder="category"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value={''}>select</option>
                {categories.map((c) => (
                  <option key={c.id || Math.random() * 1000} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className="text-danger"
              />
            </div>
            {/* {scat && (
              <div>
                <h1 className="mb-3 block text-black dark:text-white">
                  Previously Selected Category
                </h1>
                <h2 className="text-meta-8">{scat}</h2>
              </div>
            )} */}
          </div>
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

export default AddService;
