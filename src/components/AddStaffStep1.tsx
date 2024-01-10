import { useState, useRef, useCallback } from 'react';
import userSix from '../images/user/user-06.png';
import useWorkerStore from '../store/ServiceStore';
type images = {
  url: File;
};
function AddStaffMember({ settheStep }: AddStaffMemberChildrenProps) {
  const [images, setimages] = useState<images[]>([]);
  const { StaffMember, updateStaffMember, isEditing, setUserAuth, userAuth } =
    useWorkerStore();
  const Nameref = useRef<HTMLInputElement | null>(null);
  const ArabicNameRef = useRef<HTMLInputElement | null>(null);
  const PhoneRef = useRef<HTMLInputElement | null>(null);
  const UserEmailRef = useRef<HTMLInputElement | null>(null);
  const UserPasswordRef = useRef<HTMLInputElement | null>(null);
  const [permissions, setpermissions] = useState<string[]>(
    StaffMember.permissions,
  );
  const SaveStaffMemberInfo = useCallback(() => {
    updateStaffMember({
      email: UserEmailRef.current?.value!,
      ArabicName: ArabicNameRef.current?.value!,
      file: images,
      Name: Nameref.current?.value!,
      phone: PhoneRef.current?.value!,
      permissions,
    });
  }, [images, Nameref, PhoneRef, ArabicNameRef, permissions]);
  console.log('Editing', isEditing);
  return (
    <div>
      <div className="flex flex-col gap-5.5 p-6.5">
        <div className="flex items-center space-x-4 justify-around">
          <div className="w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Name
            </label>
            <input
              ref={Nameref}
              defaultValue={StaffMember.Name}
              type="text"
              placeholder="Name"
              className="w-full bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              الاسم
            </label>
            <input
              ref={ArabicNameRef}
              defaultValue={StaffMember.ArabicName}
              type="text"
              placeholder="ArabicName"
              className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-sm border border-strokeshadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-5 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <h1>Choose Image</h1>
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
                    updateStaffMember({
                      email: UserEmailRef.current?.value!,
                      ArabicName: ArabicNameRef.current?.value!,
                      file: images,
                      Name: Nameref.current?.value!,
                      phone: PhoneRef.current?.value!,
                      permissions,
                    });
                  }}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-row flex-wrap justify-center items-center space-x-6 space-y-4 bg-white">
            {(images || StaffMember.file) &&
              StaffMember.file.map((i) => (
                <div className="w-80 " key={i.url.toString()}>
                  <img src={`${URL.createObjectURL(i.url)}`} />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5.5 p-6.5">
        <h1>User Information</h1>
        <div className="flex space-x-4">
          <div className="w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Phone
            </label>
            <input
              ref={PhoneRef}
              defaultValue={StaffMember.phone}
              type="number"
              placeholder="Phone Number"
              className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              User Email
            </label>
            <input
              readOnly={isEditing.value}
              ref={UserEmailRef}
              defaultValue={StaffMember.email}
              type="text"
              placeholder="User Email"
              className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
        {!isEditing.value && (
          <div className="flex space-x-4">
            <div className="w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Password
              </label>
              <input
                ref={UserPasswordRef}
                defaultValue={StaffMember.phone}
                type="password"
                placeholder="Password"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
        )}
        <div>
          <label className="mb-3 block text-black dark:text-white">
            User Roles
          </label>
          {/* Dropdown Select */}
          <div className="relative z-20 p-4 w-full rounded border border-stroke p-1.5 pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
            <div className="flex flex-wrap items-center">
              {permissions?.map((I: String) => (
                <span
                  className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30 z-50"
                  onClick={(e) => {
                    setpermissions(permissions.filter((item) => item !== I));
                  }}
                >
                  {I}
                  <span className="cursor-pointer pl-2 hover:text-danger">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                </span>
              ))}
            </div>
            <select
              name=""
              id=""
              className="absolute text-black top-0 p-6 left-0 z-20 h-full w-full bg-transparent opacity-0"
              onChange={(e) => {
                console.log(e.target.value);
                setpermissions((p) =>
                  p.some((item) => item === e.target.value || item === '')
                    ? p
                    : [...p, e.target.value],
                );
              }}
            >
              <option value=""></option>
              <option value="Staff">Staff</option>
              <option value="Roles">Roles</option>
              <option value="Providers">Provider</option>
            </select>
            <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
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
      </div>
      <button
        className="w-52 rounded bg-primary p-3 font-medium text-gray"
        type="submit"
        onClick={() => {
          settheStep();
          SaveStaffMemberInfo();
          if (isEditing)
            setUserAuth(
              UserEmailRef.current?.value!,
              UserPasswordRef.current?.value!,
            );
        }}
      >
        Save
      </button>
    </div>
  );
}

export default AddStaffMember;
