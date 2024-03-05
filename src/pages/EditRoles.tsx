import React, { useEffect, useState } from 'react';
// @ts-ignore
import { db } from '../firebase.js';
import { updateDoc, doc } from 'firebase/firestore';
import { LoaderIcon } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import useGlobalStore from '../store/globalStore.js';
import useRoleStore from '../store/useRoleStore.js';
import { toast } from 'react-hot-toast';

function EditRoles() {
  const [isloading, setisloading] = useState<boolean>(false);
  const { state } = useLocation();
  const [roleName, setroleName] = useState<string>(state?.name || '');

  const { roles } = useGlobalStore();
  const [pageroles, setpageroles] = useState<[string, string[]]>();
  useEffect(() => {
    const ap = Object.entries(roles)?.find((i) => i[0] === roleName);

    setpageroles(ap as [string, string[]]);
    setpermissions((ap?.[1] as string[]) || []);
  }, [roles]);
  const [permissions, setpermissions] = useState<string[]>([]);
  const navigate = useNavigate();
  const { addtoDb, setAppRoles } = useRoleStore();
  const AddtoDb = async () => {
    try {
      setisloading(true);
      if (!roleName) return;
      const preRoles: AppRoles = { ...roles };
      preRoles[roleName] = permissions;
      console.log(':presroels', preRoles);
      setAppRoles(preRoles);
      await addtoDb();
      toast.success('Success');
      navigate('/');
    } catch (e) {
      console.log(e);
      toast.error('Couldnt Complete Action');
    } finally {
      setisloading(false);
    }
  };
  console.log('loading', isloading);
  //   const permissions: any = [];

  //   const UpdateUserRole = async () => {
  //     let docRef = doc(db, 'users', user.id);
  //     try {
  //       setisloading((p) => true);

  //       await updateDoc(docRef, {
  //         permissions: permissions,
  //       });
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setisloading((p) => false);
  //     }
  //   };
  return (
    <div>
      <h3 className="text-black dark:text-white font-bold font-serif text-2xl text-center">
        Edit Role
      </h3>
      <div className="flex flex-col gap-9">
        <form action="#">
          <div className="p-6.5 space-y-6">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Role Name
              </label>
              <input
                onChange={(e) => {
                  setroleName(e.target.value);
                }}
                type="text"
                readOnly={!!pageroles?.[0]}
                placeholder={roleName || ''}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-black dark:text-white">
                User Roles
              </label>
              {/* <label className="mb-3 block text-meta-8 text-3xl uppercase">
                Role Name {ap?.[0]}
              </label> */}
              {/* Dropdown Select */}
              <div className="relative z-20  min-h-12 w-full rounded border border-stroke p-1.5 pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                <div className="flex flex-wrap items-center">
                  {permissions?.map((I: String) => (
                    <span
                      className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30 z-50"
                      onClick={(e) => {
                        setpermissions(
                          permissions.filter((item) => item !== I),
                        );
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
                  className="absolute top-0 p-6 left-0 z-20 h-full w-full bg-transparent opacity-0"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setpermissions((p) =>
                      p?.some((item) => item === e.target.value || item === '')
                        ? p
                        : [...(p || []), e.target.value],
                    );
                  }}
                >
                  <option className="text-black" value="">
                    Select
                  </option>
                  <option className="text-black" value="Staff All">
                    Staff All
                  </option>
                  <option className="text-black" value="Staff Read">
                    Staff Read
                  </option>
                  <option className="text-black" value="Staff Create">
                    Staff Create
                  </option>
                  <option className="text-black" value="Staff Delete">
                    Staff Delete
                  </option>
                  <option className="text-black" value="Staff Update">
                    Staff Update
                  </option>
                  <option className="text-black" value="Roles All">
                    Roles All
                  </option>
                  <option className="text-black" value="Roles Read">
                    Roles Read
                  </option>
                  <option className="text-black" value="Roles Create">
                    Roles Create
                  </option>
                  <option className="text-black" value="Roles Delete">
                    Roles Delete
                  </option>
                  <option className="text-black" value="Roles Update">
                    Roles Update
                  </option>
                  <option className="text-black" value="Orders All">
                    Orders All
                  </option>
                  <option className="text-black" value="Orders Read">
                    Orders Read
                  </option>
                  <option className="text-black" value="Orders Create">
                    Orders Create
                  </option>
                  <option className="text-black" value="Orders Delete">
                    Orders Delete
                  </option>
                  <option className="text-black" value="Orders Update">
                    Orders Update
                  </option>
                  <option className="text-black" value="Categories All">
                    Categories All
                  </option>
                  <option className="text-black" value="Categories Read">
                    Categories Read
                  </option>
                  <option className="text-black" value="Categories Create">
                    Categories Create
                  </option>
                  <option className="text-black" value="Categories Delete">
                    Categories Delete
                  </option>
                  <option className="text-black" value="Categories Update">
                    Categories Update
                  </option>
                  <option className="text-black" value="Services All">
                    Services All
                  </option>
                  <option className="text-black" value="Services Read">
                    Services Read
                  </option>
                  <option className="text-black" value="Services Create">
                    Services Create
                  </option>
                  <option className="text-black" value="Services Delete">
                    Services Delete
                  </option>
                  <option className="text-black" value="Services Update">
                    Services Update
                  </option>
                  <option className="text-black" value="Upsellings All">
                    Upsellings All
                  </option>
                  <option className="text-black" value="Upsellings Read">
                    Upsellings Read
                  </option>
                  <option className="text-black" value="Upsellings Create">
                    Upsellings Create
                  </option>
                  <option className="text-black" value="Upsellings Delete">
                    Upsellings Delete
                  </option>
                  <option className="text-black" value="Upsellings Update">
                    Upsellings Update
                  </option>
                  <option className="text-black" value="Subscriptions All">
                    Subscriptions All
                  </option>
                  <option className="text-black" value="Subscriptions Read">
                    Subscriptions Read
                  </option>
                  <option className="text-black" value="Subscriptions Create">
                    Subscriptions Create
                  </option>
                  <option className="text-black" value="Subscriptions Delete">
                    Subscriptions Delete
                  </option>
                  <option className="text-black" value="Subscriptions Update">
                    Subscriptions Update
                  </option>
                  <option className="text-black" value="Appointments All">
                    Appointments All
                  </option>{' '}
                  <option className="text-black" value="Appointments Read">
                    Appointments Read
                  </option>{' '}
                  <option className="text-black" value="Appointments Update">
                    Appointments Update
                  </option>{' '}
                  <option className="text-black" value="Appointments Create">
                    Appointments Create
                  </option>{' '}
                  <option className="text-black" value="Appointments Delete">
                    Appointments Delete
                  </option>
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
              onClick={AddtoDb}
            >
              {isloading ? <LoaderIcon className="p-3" /> : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRoles;
