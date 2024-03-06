import React, { useState } from 'react';

// import { Modal } from './ModalSettings';
import Modal from './Modal';
import AddLocation from './AddLocation';
import useWorkerStore from '../store/ServiceStore';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { db, auth } from '../firebase.js';
import {
  setDoc,
  doc,
  runTransaction,
  getDocs,
  query,
  collection,
  where,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { LoaderIcon, toast } from 'react-hot-toast';
import useGlobalStore from '../store/globalStore.js';
function AddServingArea() {
  const [enabled, setEnabled] = React.useState<boolean>(false);
  const [isloading, setisloading] = useState<boolean>();
  const { setreloadCategories } = useGlobalStore();
  const {
    ServingArea,
    addToDb,
    EmptyFields,
    isEditing,
    addEditedItemtoDb,
    setIsEditing,
    userAuth,
    StaffMember,
    Timings,
    setIsNotEditing,
    addServingArea,
    isDuplicating,
    setisNotDuplicating,
  } = useWorkerStore();
  const navigate = useNavigate();
  console.log(ServingArea, 'serving area');
  const weekDays = [
    { day: 'Sunday' },
    { day: 'Monday' },
    { day: 'Tuesday' },
    { day: 'Wednesday' },
    { day: 'Thursday' },
    { day: 'Friday' },
    { day: 'Saturday' },
  ];
  console.log('Serv', ServingArea);
  // console.log('Serv', userAuth);
  // console.log('Serv', StaffMember);
  // console.log('Serv', Timings);
  // console.log('Serv', isEditing);
  const saveDate = async () => {
    try {
      if (ServingArea.length <= 0)
        return toast.error('Please Enter A Serving Area');
      setisloading(true);
      if (isEditing.value) {
        console.log('Reached in Editing');
        await addEditedItemtoDb();
      } else {
        console.log('Reached Creating Staff');
        const docs = await getDocs(
          query(
            collection(db, 'staff'),
            where('StaffMember.phone', '==', StaffMember.phone),
          ),
        );
        if (!docs.empty)
          return toast.error('User With Phone number Already Exists');
        const u = await createUserWithEmailAndPassword(
          auth,
          userAuth.email,
          userAuth.password,
        );
        setDoc(doc(db, 'users', u.user.uid), {
          email: userAuth.email,
          name: StaffMember.Name,
          phone: StaffMember.phone,
          permissions: StaffMember.permissions,
        });
        await addToDb(u.user.uid);

        EmptyFields();
        setIsNotEditing();
        setisNotDuplicating();
        navigate('/staff');
      }
      // setreloadCategories();
      toast.success('Success');
    } catch (e) {
      console.log(e);
      toast.error('An Error Occured ');
    } finally {
      setisloading(false);
    }
  };
  return (
    <div className="flex flex-col">
      {enabled && (
        // <div className="flex mx-auto">
        <Modal closeModal={() => setEnabled(false)}>
          <h1 className="mx-8 text-2xl font-bold">Add Location</h1>
          <AddLocation closeModal={() => setEnabled(false)} />
        </Modal>
        // </div>
      )}

      <h1 className="text-xl my-3 font-bold">Timings Serving Area</h1>

      <div className="rounded-sm border space-y-5 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Location
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Arrival
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {ServingArea.length > 0 &&
                ServingArea?.map((i) => {
                  if (!i) return null;
                  const keys = Object.keys(i);
                  const name = keys.filter((im, ind) =>
                    Array.isArray(i[keys[ind]]),
                  );
                  console.log('rizz', name);
                  if (!i) return;
                  return (
                    <tr>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {name[0]}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {i.duration} min
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                          AED {i.minamount}
                        </p>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <button
        className="my-3 inline-flex w-52 items-center justify-center bg-primary py-4 px-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-3"
        onClick={() => {
          setEnabled((p) => true);
        }}
      >
        Manage Locations
      </button>
      <div className="flex flex-row justify-end">
        <button
          className="rounded-md inline-flex w-52 items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={saveDate}
        >
          {isloading ? (
            <LoaderIcon style={{ margin: 'auto' }} className="w-4 h-4" />
          ) : isEditing.value ? (
            'Update'
          ) : isDuplicating ? (
            'Duplicate'
          ) : (
            'Add To Database'
          )}
        </button>
      </div>
    </div>
  );
}

export default AddServingArea;
