import React from 'react';
import { useState, useRef, useCallback } from 'react';
import userSix from '../images/user/user-06.png';
import useWorkerStore from '../store/ServiceStore';
import MapComponent from './MapComponent';
import useProviderStore from '../store/useProviderStore';
import DynamicFirebaseImageComponent from './DynamicFirebaseImageComponent';
type images = {
  url: File | string;
};

function ProviderInformation({ settheStep }: AddStaffMemberChildrenProps) {
  // const { StaffMember, updateStaffMember } = useWorkerStore();
  const {
    setAllProviderInformation,
    providerInfo,
    providerAccountInfo,
    providerAddressInfo,
  } = useProviderStore();
  const [images, setimages] = useState<images[]>(providerInfo.file);

  const [location, setlocation] = useState<itemLocation>(
    providerAddressInfo.location,
  );
  const [Area, setArea] = useState<string>(providerAddressInfo.area);
  const [ArabicArea, setArabicArea] = useState<string>(
    providerAddressInfo.arabicArea,
  );
  const [Address, setAddress] = useState<string>(providerAddressInfo.address);
  const [ArabicAddress, seteArabicAddress] = useState<string>(
    providerAddressInfo.arabicAddress,
  );
  const PhoneRef = useRef<HTMLInputElement | null>(null);
  const NameRef = useRef<HTMLInputElement | null>(null);
  const ArabicName = useRef<HTMLInputElement | null>(null);
  const DetailsRef = useRef<HTMLTextAreaElement | null>(null);
  const ArabicDetailsRef = useRef<HTMLTextAreaElement | null>(null);
  const EmailRef = useRef<HTMLInputElement | null>(null);
  const CallCenterRef = useRef<HTMLInputElement | null>(null);

  const SaveProviderInfo = useCallback(() => {
    setAllProviderInformation({
      providerAccountInfo: {
        callCenter: CallCenterRef.current?.value!,
        email: EmailRef.current?.value!,
        number: PhoneRef.current?.value!,
      },
      providerAddressInfo: {
        address: Address,
        arabicAddress: ArabicAddress,
        arabicArea: ArabicArea,
        area: Area,
        location: location as itemLocation,
      },
      providerInfo: {
        arabicDetails: ArabicDetailsRef.current?.value!,
        arabicname: ArabicName.current?.value!,
        details: DetailsRef.current?.value!,
        name: NameRef.current?.value!,
        file: images,
      },
    });
  }, [
    images,
    NameRef,
    PhoneRef,
    ArabicArea,
    CallCenterRef,
    EmailRef,
    Address,
    ArabicAddress,
    Area,
    ArabicDetailsRef,
    ArabicName,
    DetailsRef,
  ]);
  const updateRefs = (
    address: string,
    area: string,
    location: itemLocation,
  ) => {
    console.log('Address:', address);
    console.log('Area:', area);
    // setNameref(area);
    setArabicArea(area);
    setAddress(address);
    seteArabicAddress(address);
    setArea(area);
    setlocation(location);
    // console.log('nArea:', Nameref);
    // console.log('2nArea:', ArabicArea);
    // console.log('3nArea:', DetailsRef);
    // console.log('4nArea:', ArabicDetailsRef);
  };
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
  console.log('Provveder info ', providerInfo);
  return (
    <div>
      <h1 className="mb-3 block text-black dark:text-white text-3xl">
        Provider Information
      </h1>

      <div className="overflow-hidden rounded-sm border border-strokeshadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-5 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <h1>Provider Picture</h1>
          <div className="relative z-30 mx-auto  h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <img src={userSix} alt="profile" />
              <label
                htmlFor="profile"
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
                  name="profile"
                  id="profile"
                  className="sr-only"
                  onChange={(e) => {
                    setimages((p) => [...p, { url: e.target.files?.[0]! }]);
                    // updateStaffMember({
                    //   ArabicName: ArabicName.current?.value!,
                    //   file: images,
                    //   Name: NameRef.current?.value!,
                    //   phone: PhoneRef.current?.value!,
                    // });
                  }}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-row flex-wrap justify-center items-center py-4">
            {images &&
              images?.map((i) => (
                <div
                  className="w-80 my-3 mx-3 md:my-0"
                  key={i.url.toString() + Math.random() * 100000}
                >
                  {i.url instanceof File ? (
                    <img
                      src={`${URL.createObjectURL(i.url)}`}
                      className="max-w-full object-contain"
                    />
                  ) : (
                    <DynamicFirebaseImageComponent
                      storagePath={i.url}
                      removeImage={removeImageFromImages}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5.5 p-6.5">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Name
            </label>
            <input
              ref={NameRef}
              defaultValue={providerInfo.name}
              type="text"
              placeholder="Name"
              className="w-full bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              الاسم
            </label>
            <input
              ref={ArabicName}
              defaultValue={providerInfo.arabicname}
              type="text"
              placeholder="ArabicName"
              className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5.5 p-6.5 w-full">
        <div className="flex items-center space-x-4 justify-start w-full">
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Details
            </label>
            <textarea
              ref={DetailsRef}
              defaultValue={providerInfo.details}
              placeholder="Name"
              className="w-full bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Arabic Details
            </label>
            <textarea
              ref={ArabicDetailsRef}
              defaultValue={providerInfo.arabicDetails}
              placeholder="ArabicName"
              className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5.5 p-6.5">
        <h1 className="mb-3 block text-black dark:text-white text-3xl">
          Account Information
        </h1>
        <div className="flex flex-col md:flex-row  md:space-x-4">
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Email
            </label>
            <input
              ref={EmailRef}
              // defaultValue={StaffMember.phone}
              defaultValue={providerAccountInfo.email}
              type="email"
              placeholder="Email"
              className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Phone
            </label>
            <input
              ref={PhoneRef}
              defaultValue={providerAccountInfo.number}
              type="number"
              placeholder="Phone Number"
              className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Call Center
            </label>
            <input
              ref={CallCenterRef}
              defaultValue={providerAccountInfo.callCenter}
              type="number"
              placeholder="Call Center"
              className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5.5 p-6.5">
        <h1 className="mb-3 block text-black dark:text-white text-3xl">
          Address Information
        </h1>
        <MapComponent updateRefs={updateRefs} />
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Address
            </label>
            <input
              // ref={PhoneRef}
              value={Address}
              // defaultValue={StaffMember.phone}
              type="text"
              placeholder="Address"
              className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Arabic Address
            </label>
            <input
              // ref={PhoneRef}
              // defaultValue={StaffMember.phone}
              value={ArabicAddress}
              type="text"
              placeholder="Arabic Address"
              className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Area
            </label>
            <input
              // ref={Nameref}
              value={Area}
              // defaultValue={StaffMember.phone}
              type="text"
              placeholder="Area"
              className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Arabic Area
            </label>
            <input
              // ref={ArabicArea}
              value={ArabicArea}
              // defaultValue={StaffMember.phone}
              type="text"
              placeholder="Arabic Area"
              className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
      </div>
      <button
        className="w-52 rounded bg-primary p-3 font-medium text-gray"
        type="submit"
        onClick={() => {
          SaveProviderInfo();
          settheStep();
        }}
      >
        Save
      </button>
    </div>
  );
}

export default ProviderInformation;
