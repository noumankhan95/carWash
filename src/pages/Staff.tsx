import { useCallback, useEffect, useState } from 'react';
import AddStaffMember from './AddStaffMember';
import { useNavigate } from 'react-router-dom';
import { LoaderIcon } from 'react-hot-toast';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { type Timestamp } from 'firebase/firestore';
// @ts-ignore
import { db } from '../firebase.js';
import useWorkerStore from '../store/ServiceStore.js';
type workTime = StaffWorkerUser & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
type userItem = {
  id: string;
  worker: workTime;
};
function Staff() {
  const navigate = useNavigate();
  const [loading, setisloading] = useState<boolean>(false);
  const { EditItem, setIsEditing, setIsNotEditing, EmptyFields } =
    useWorkerStore();
  const [users, setusers] = useState<userItem[]>();
  const getUsers = useCallback(async () => {
    try {
      setisloading((p) => true);
      const qs = await getDocs(collection(db, 'staff'));
      qs.forEach((doc) => {
        const newUserData = {
          id: doc.id,
          worker: doc.data() as workTime,
        };
        setusers((p) =>
          p?.some((item) => item.id === newUserData.id)
            ? p
            : [...(p || []), newUserData],
        );
      });
    } catch (e) {
      console.log(e);
    } finally {
      setisloading((p) => false);
    }
  }, []);
  useEffect(() => {
    getUsers();
  }, []);
  console.log(users, 'isers');
  return (
    <div className=" ">
      <div className="flex flex-row justify-end">
        <button
          className="rounded-md inline-flex w-52 items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={() => {
            setIsNotEditing();
            EmptyFields();
            navigate('/addstaff');
          }}
        >
          Create
        </button>
      </div>

      <div className="flex flex-col my-4 overflow-x-auto  ">
        <div className="grid rounded-sm w-fit bg-gray-2 dark:bg-form-strokedark grid-cols-7 gap-40 md:gap-8">
          <div className="p-1.5 xl:p-5">
            <h5 className="text-sm  font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-1.5 text-center xl:p-5">
            <h5 className="text-sm  font-medium uppercase xsm:text-base">
              Arabic Name
            </h5>
          </div>
          <div className="p-1.5 text-center xl:p-5">
            <h5 className="text-sm  font-medium uppercase xsm:text-base">
              Service Provider
            </h5>
          </div>
          <div className=" p-1.5 text-center xl:p-5">
            <h5 className="text-sm  font-medium uppercase xsm:text-base">
              Phone
            </h5>
          </div>
          <div className=" p-1.5 text-center xl:p-5">
            <h5 className="text-sm  font-medium uppercase xsm:text-base">
              Last Update
            </h5>
          </div>
          <div className=" p-1.5 text-center xl:p-5">
            <h5 className="text-sm  font-medium uppercase xsm:text-base">
              Busy Timings
            </h5>
          </div>
        </div>
        {loading && (
          <LoaderIcon className="h-20 w-20 mx-auto " secondary="blue" />
        )}
        {!loading &&
          users &&
          users.map((u) => (
            <div className="grid w-fit  rounded-sm bg-gray-2 dark:bg-meta-4 grid-cols-7 gap-40 md:gap-5 items-start">
              <div className="p-1.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase text-wrap  xsm:text-base">
                  {u.worker.StaffMember.Name}
                </h5>
              </div>
              <div className="p-1.5 text-center xl:p-5">
                <h5 className="text-sm font-medium  xsm:text-base">
                  {u.worker.StaffMember.ArabicName}
                </h5>
              </div>
              <div className="p-1.5 text-center xl:p-5">
                <h5 className="text-sm font-medium xsm:text-base">
                  Service Provider
                </h5>
              </div>
              <div className=" p-1.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  {u.worker.StaffMember.phone}
                </h5>
              </div>
              <div className=" p-1.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  {u.worker.createdAt?.toDate().toString() ||
                    u.worker.updatedAt?.toDate().toString() ||
                    ''}
                </h5>
              </div>
              <div className=" p-1.5 text-center sm:block  xl:p-5 ">
                {Object.entries(u.worker.Timings).map(
                  (w) =>
                    w[1].enabled && (
                      <>
                        <h5 className="text-sm font-medium xsm:text-base">
                          {w[1].from && w[0]} From {w[1].from} To {w[1].to}
                        </h5>
                      </>
                    ),
                )}
              </div>
              <div className="flex flex-row justify-start text-center sm:block my-4">
                <button
                  className="p-3.5  bg-primary rounded-md border  text-center font-medium text-white hover:bg-opacity-90 "
                  onClick={() => {
                    navigate('/addstaff');
                    EditItem(u.worker);
                    setIsEditing(u.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="my-8 p-4 rounded-md bg-danger text-center font-medium text-white hover:bg-opacity-90 "
                  onClick={() => {
                    console.log(u.id);
                    deleteDoc(doc(db, 'staff', u.id));
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Staff;
