import { useCallback, useEffect, useState } from 'react';
import AddStaffMember from './AddStaffMember';
import { useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
// @ts-ignore
import { db } from '../firebase.js';
import useWorkerStore from '../store/ServiceStore.js';
type userItem = {
  id: string;
  worker: StaffWorkerUser;
};
function Staff() {
  const navigate = useNavigate();
  const { EditItem, setIsEditing } = useWorkerStore();
  const [users, setusers] = useState<userItem[]>();
  const getUsers = useCallback(async () => {
    try {
      const qs = await getDocs(collection(db, 'staff'));
      qs.forEach((doc) => {
        const newUserData = {
          id: doc.id,
          worker: doc.data() as StaffWorkerUser,
        };
        setusers((p) =>
          p?.some((item) => item.id === newUserData.id)
            ? p
            : [...(p || []), newUserData],
        );
      });
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className=" space-y-5">
      <div className="flex flex-row justify-end">
        <button
          className="rounded-md inline-flex w-52 items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={() => navigate('/addstaff')}
        >
          Create
        </button>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7">
          <div className="p-1.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-1.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Arabic Name
            </h5>
          </div>
          <div className="p-1.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Service Provider
            </h5>
          </div>
          <div className="hidden p-1.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Phone
            </h5>
          </div>
          <div className="hidden p-1.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Last Update
            </h5>
          </div>
          <div className="hidden p-1.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Busy Timings
            </h5>
          </div>
        </div>
      </div>
      {users &&
        users.map((u) => (
          <div className="flex flex-col">
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7">
              <div className="p-1.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  {u.worker.StaffMember.Name}
                </h5>
              </div>
              <div className="p-1.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  {u.worker.StaffMember.ArabicName}
                </h5>
              </div>
              <div className="p-1.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Service Provider
                </h5>
              </div>
              <div className="hidden p-1.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  {u.worker.StaffMember.phone}
                </h5>
              </div>
              <div className="hidden p-1.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Last Update
                </h5>
              </div>
              <div className="hidden p-1.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Busy Timings
                </h5>
              </div>
              <div className=" md:flex hidden p-1.5 text-center sm:block xl:p-5 space-x-3">
                <button
                  className="inline-flex items-center justify-center rounded-md border border-meta-3 py-4 px-5 text-center font-medium text-meta-3 hover:bg-opacity-90 lg:px-5 xl:px-4"
                  onClick={() => {
                    navigate('/addstaff');
                    EditItem(u.worker);
                    setIsEditing(u.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="inline-flex items-center justify-center bg-black py-4 px-4 rounded-md bg-danger text-center font-medium text-white hover:bg-opacity-90 "
                  onClick={() => {
                    console.log(u.id);
                    deleteDoc(doc(db, 'staff', u.id));
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Staff;
