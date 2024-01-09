import React, { useState } from 'react';
import SwitcherOne from './SwitcherOne';
import Buttons from '../pages/UiElements/Buttons';
// import { Modal } from './ModalSettings';
import Modal from './Modal';
import AddLocation from './AddLocation';
import useWorkerStore from '../store/ServiceStore';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { db, auth } from '../firebase.js';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { LoaderIcon } from 'react-hot-toast';
function AddServingArea() {
  const [enabled, setEnabled] = React.useState<boolean>(false);
  const [isloading, setisloading] = useState<boolean>();
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
  } = useWorkerStore();
  const navigate = useNavigate();
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
  console.log('Serv', userAuth);
  console.log('Serv', StaffMember);
  console.log('Serv', Timings);
  console.log('Serv', isEditing);

  return (
    <div className="flex flex-col space-y-4">
      {enabled && (
        // <div className="flex mx-auto">
        <Modal closeModal={() => setEnabled(false)}>
          <h1 className="mx-8 text-2xl font-bold">Add Location</h1>
          <AddLocation />
        </Modal>
        // </div>
      )}

      <h1 className="text-xl font-bold">Timings Serving Area</h1>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
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
              {ServingArea &&
                ServingArea.map((i) => (
                  <tr>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {i.Location}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {i.arrivalTime}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                        AED {i.MinimunOrderValue}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        className="inline-flex w-52 items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        onClick={() => {
          setEnabled((p) => true);
        }}
      >
        Add Location
      </button>
      <div className="flex flex-row justify-end">
        <button
          className="rounded-md inline-flex w-52 items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={async () => {
            try {
              setisloading(true);
              if (isEditing.value) {
                console.log('Reached in Editing');
                addEditedItemtoDb();
              } else {
                console.log('Reached');
                addToDb();
                const u = await createUserWithEmailAndPassword(
                  auth,
                  userAuth.email,
                  userAuth.password,
                );
                await setDoc(doc(db, 'users', u.user.uid), {
                  email: userAuth.email,
                  name: StaffMember.Name,
                  phone: StaffMember.phone,
                  permissions: StaffMember.permissions,
                });
              }
              EmptyFields();
              setIsNotEditing();
              navigate('/staff');
            } catch (e) {
              console.log(e);
              alert(e);
            } finally {
              setisloading(false);
            }
          }}
        >
          {isloading ? (
            <LoaderIcon style={{ margin: 'auto' }} className="w-4 h-4" />
          ) : (
            'Add To Database'
          )}
        </button>
      </div>
    </div>
  );
}

export default AddServingArea;
