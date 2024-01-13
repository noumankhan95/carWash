import { useCallback, useEffect, useState } from 'react';
import AddStaffMember from './AddStaffMember';
import { useNavigate } from 'react-router-dom';
import { LoaderIcon, toast } from 'react-hot-toast';
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  query,
  where,
  runTransaction,
} from 'firebase/firestore';
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
  const [showAlert, setshowAlert] = useState(false);
  const navigate = useNavigate();
  const [loading, setisloading] = useState<boolean>(false);
  const [reload, setreload] = useState<boolean>(false);
  const [todelete, settodelete] = useState<{ id: string; email: string }>();
  const [isdeleting, setisdeleting] = useState<boolean>(false);
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
  console.log(isdeleting, 'is deleting');
  useEffect(() => {
    getUsers();
  }, [reload]);
  console.log(users, 'isers');
  return (
    <div className=" ">
      {showAlert && (
        <div className="w-1/5 md:w-4/5 right-0 absolute flex bg-boxdark-2  border-l-6 border-[#F87171] z-50   px-7 py-8 shadow-md  md:p-9">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg ">
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setshowAlert(false)}
              className="cursor-pointer"
            >
              <path
                d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                fill="#ffffff"
                stroke="#ffffff"
              ></path>
            </svg>
          </div>
          <div className="w-full">
            <h5 className="mb-3 font-semibold text-[#B45454]">
              Are You Sure You Want To Delete This Item
            </h5>
            <ul>
              <li
                className="leading-relaxed text-[#CD5D5D]"
                onClick={async () => {
                  try {
                    setisdeleting(true);
                    console.log(todelete);
                    let myquery = query(
                      collection(db, 'staff'),
                      where('email', '==', todelete?.email),
                    );
                    const userDoc = doc(db, 'users', todelete?.id!);
                    runTransaction(db, async (transaction) => {
                      // await deleteDoc(userDoc);
                      transaction.delete(userDoc);
                      // Execute the query
                      const querySnapshot = await getDocs(myquery);
                      if (!querySnapshot.empty) {
                        querySnapshot.forEach(async (d) => {
                          const staffDoc = doc(db, 'staff', d.id);
                          transaction.delete(staffDoc);
                        });
                      } else {
                        console.log('empty snapshot', querySnapshot.empty);
                      }
                      settodelete({ email: '', id: '' });
                      setshowAlert(false);
                      setreload(true);
                      toast.success('Deleted');
                    });
                  } catch (e) {
                    console.log(e);
                    toast.error('Failed To Delete');
                  } finally {
                    setisdeleting(false);
                  }
                }}
              >
                <button
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-danger py-4 px-10 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
                  disabled={isdeleting}
                >
                  {isdeleting ? <LoaderIcon className="h-5 w-5" /> : 'Yes'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
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
            <div
              className="grid w-fit  rounded-sm bg-gray-2 dark:bg-meta-4 grid-cols-7 gap-40 md:gap-5 items-start"
              key={u.id}
            >
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
                        <h5
                          className="text-sm font-medium xsm:text-base"
                          key={w[0]}
                        >
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
                    console.log(u);
                    navigate('/addstaff');
                    EditItem(u.worker);
                    setIsEditing(u.id);
                  }}
                >
                  Edit
                </button>
                {/* <button
                  className="my-8 p-4 rounded-md bg-danger text-center font-medium text-white hover:bg-opacity-90 "
                  onClick={() => {
                    console.log(u.id);
                    console.log(u.worker.StaffMember.email);

                    setshowAlert((p) => true);
                    settodelete({
                      id: u.id,
                      email: u.worker.StaffMember.email,
                    });
                    // deleteDoc(doc(db, 'staff', u.id))
                  }}
                >
                  Delete
                </button> */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Staff;
