import React, { useState } from 'react';
// @ts-ignore
import { db } from '../firebase.js';
import { updateDoc, doc } from 'firebase/firestore';
import toast, { LoaderIcon } from 'react-hot-toast';
import useGlobalStore from '../store/globalStore.js';
import { useNavigate } from 'react-router-dom';
type pageprops = {
  user: StaffMember;
};
function EditUserModal({ user }: pageprops) {
  const { roles, setreloadCategories } = useGlobalStore();
  const [isloading, setisloading] = useState<boolean>();
  const [permissions, setpermissions] = useState<string>(user.permissions);
  const navigate = useNavigate();
  const UpdateUserRole = async () => {
    let docRef = doc(db, 'staff', user.id!);
    try {
      setisloading((p) => true);

      await updateDoc(docRef, {
        ['StaffMember.permissions']: permissions,
      });
      toast.success('success');
      navigate('/');
      setreloadCategories();
    } catch (e) {
      console.log(e);
      toast.error('An Error Occured');
    } finally {
      setisloading((p) => false);
    }
  };
  console.log('User', user);
  console.log('UserR', roles[user.permissions]);

  return (
    <div>
      <h3 className="text-black dark:text-white font-bold font-serif text-2xl text-center">
        Edit User Role
      </h3>
      <div className="flex flex-col gap-9">
        <form action="#">
          <div className="p-6.5 space-y-6">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Email
              </label>
              <input
                type="email"
                readOnly
                placeholder={user?.email}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            {/* <div>
              <label className="mb-3 block text-black dark:text-white">
                Change User Role
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  defaultValue={user?.role}
                  onChange={(e) => setuserRole((p) => e.target.value as Roles)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="User">User</option>
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
            </div> */}
            <div>
              <label className="mb-3 block text-black dark:text-white">
                User Roles
              </label>
              {/* Dropdown Select */}
              <div className="relative z-20 p-4 w-full rounded border border-stroke p-1.5 pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                <div className="flex flex-wrap items-center">
                  <span className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30 z-50">
                    {permissions}
                  </span>
                </div>
                <select
                  name=""
                  id=""
                  className="absolute top-0 p-6 left-0 z-20 h-full w-full bg-transparent opacity-0"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setpermissions((p) => e.target.value);
                  }}
                >
                  <option className="text-black" value="">
                    Select
                  </option>
                  {Object.keys(roles)
                    .filter((r) => r !== 'updatedAt' && r !== 'id')
                    .map((i) => (
                      <option key={i}>{i}</option>
                    ))}
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
            <button
              disabled={isloading}
              type="button"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
              onClick={async () => {
                UpdateUserRole();
              }}
            >
              {isloading ? <LoaderIcon className="p-3" /> : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
