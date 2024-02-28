import { collection, getDocs } from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Timestamp } from 'firebase/firestore';
// @ts-ignore
import { db } from '../firebase.js';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoaderIcon } from 'react-hot-toast';
import useUserAuth from '../store/UserAuthStore.js';
import useOrderStore from '../store/useOrderStore.js';
import useGlobalStore from '../store/globalStore.js';
function Orders() {
  // const endDateref = useRef<HTMLInputElement | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [serviceName, setserviceName] = useState<string>('');
  const [workerName, setworkerName] = useState<string>('');

  // const OrderNoRef = useRef<HTMLInputElement | null>(null);
  // const PhoneRef = useRef<HTMLInputElement | null>(null);
  // const [orderStatus, setOrderStatus] = useState([]);
  // const [orderMode, setorderMode] = useState([]);
  // const [filterbyservice, setfilterbyservice] = useState([]);
  // const [filterbyStaffMember, setfilterbyStaffMember] = useState([]);
  // const [filter, setfilter] = useState<any>({
  //   date: null,
  //   orderNumber: null,
  //   phone: null,
  //   orderStatus: null,
  //   orderMode: null,
  // });
  const [filters, setFilters] = useState<any>({
    startDate: null,
    endDate: null,
    orderNumber: '',
    mobileNumber: '',
    orderStatus: '',
    orderMode: '',
    service: '',
    staffMember: '',
  });
  const { services, workers } = useGlobalStore();
  const handleDatesChange = (dates: [Date | null, Date | null]) => {
    const [startDate, endDate] = dates;
    setFilters((prevFilters: any) => ({ ...prevFilters, startDate, endDate }));
  };

  const [Orders, setOrders] = useState<Array<Orders>>([]);
  const [isloading, setisloading] = useState<boolean>(false);

  const [page, setpage] = useState<number>(1);
  const ItemsperPage = 10;
  const totalPages = Math.ceil((Orders.length || 1) / ItemsperPage);
  const startIndex = (page - 1) * ItemsperPage;
  const endIndex = startIndex + ItemsperPage;
  const currentItems = Orders.slice(startIndex, endIndex);
  const { permissions } = useUserAuth();
  // const {
  //   setIsEditing,
  //   setIsNotEditing,
  //   addOrdersTodb,
  //   isEditing,
  //   order,
  //   setOrdersItem,
  // } = useOrderStore();
  useEffect(() => {
    getOrders();
  }, []);
  const getOrders = useCallback(async () => {
    try {
      setisloading((p) => true);
      const docs = await getDocs(collection(db, 'orders'));
      const orders: Orders[] = [];
      if (docs.empty) return setOrders([]);
      docs.forEach((doc) => {
        orders.push({ ...(doc.data() as Orders), id: doc.id });
      });
      setOrders(orders);
    } catch (e) {
      toast.error('Couldnt Fetch Orders');
    } finally {
      setisloading((p) => false);
    }
  }, []);
  const navigate = useNavigate();
  const handleFilters = () => {
    console.log(filters);
  };
  return (
    <div>
      {/* <div className="flex flex-row justify-end my-5">
        {(permissions.includes('Services All') ||
          permissions.includes('Services Add')) && (
          <button
            className="rounded-md inline-flex w-52 items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            onClick={() => {
              // setCategoryItems({ image: [], name: '' });
              setIsNotEditing();
              setOrdersItem({
                appointmentDate: '',
                customer: '',
                id: '',
                orderNumber: '',
                paymentMethod: '',
                selectedDate: '',
                service: '',
                status: '',
                total: 0,
                type: '',
                uid: '',
                worker: '',
                booking: '',
              });
              navigate('/addOrder');
            }}
          >
            Create
          </button>
        )}
      </div> */}
      <div className="flex flex-col gap-5.5 p-6.5">
        <h1 className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white ">
          Filter Orders By
        </h1>
        <div className="flex flex-col space-y-4 lg:space-y-0 md:flex-row items-center space-x-0 md:space-x-4 justify-around">
          <div className="w-full md:w-2/5 items-center justify-center">
            <DatePicker
              showIcon
              calendarIconClassname="items-center  mt-2 text-white"
              calendarClassName="z-9999"
              selected={filters.startDate}
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={(e) => handleDatesChange(e)}
              selectsRange={true}
              className="w-full z-999999 h-12.5 items-center justify-center  rounded-lg bg-white border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              wrapperClassName="w-full z-99999"
            />
          </div>
          <div className="w-full md:w-2/5">
            <input
              type="text"
              name="OrderNumber"
              placeholder="Order Number"
              className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={filters['orderNumber']}
              onChange={(e) =>
                setFilters((v: any) => ({ ...v, orderNumber: e.target.value }))
              }
            />
          </div>
          <div className="w-full md:w-2/5">
            <input
              type="text"
              name="MobileNumber"
              placeholder="Mobile Number"
              className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={filters['mobileNumber']}
              onChange={(e) =>
                setFilters((v: any) => ({ ...v, mobileNumber: e.target.value }))
              }
            />
            {/* <ErrorMessage
              name="ArabicName"
              component="div"
              className="text-danger"
            /> */}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-around">
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Order Status
            </label>
            <div className="relative h-16 h-16 w-full rounded border border-stroke p-1.5 pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
              <div className="flex flex-wrap items-center">
                {filters.orderStatus && (
                  <span className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30">
                    {filters.orderStatus}
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
                )}
              </div>
              <select
                name=""
                id=""
                className="absolute top-0 left-0 z-20 h-full w-full bg-transparent opacity-0"
                onChange={(e) =>
                  setFilters((v: any) => ({
                    ...v,
                    orderStatus: e.target.value,
                  }))
                }
              >
                <option value={''}>Select</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
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
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Order Mode
            </label>
            <div className="relative h-16 z-20 w-full rounded border border-stroke p-1.5 pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
              <div className="flex flex-wrap items-center">
                {filters.orderMode && (
                  <span className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30">
                    {filters.orderMode}
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
                )}
              </div>
              <select
                name=""
                id=""
                className="absolute top-0 left-0 z-20 h-full w-full bg-transparent opacity-0"
                onChange={(e) =>
                  setFilters((v: any) => ({
                    ...v,
                    orderMode: e.target.value,
                  }))
                }
              >
                <option value="">Select</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
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
          </div>{' '}
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Filter By Service
            </label>
            <div className="relative h-16  w-full rounded border border-stroke p-1.5 pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
              <div className="flex flex-wrap items-center">
                {filters.service && (
                  <span className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30">
                    {serviceName}
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
                )}
              </div>
              <select
                name=""
                id=""
                className="absolute top-0 left-0  h-full w-full bg-transparent opacity-0"
                onChange={(e) => {
                  const [id, name] = e.target.value.split('|');
                  setserviceName(name);
                  setFilters((v: any) => ({
                    ...v,
                    service: id,
                  }));
                }}
              >
                <option value="">Select A Service</option>
                {services.map((s) => (
                  <option value={`${s.id}|${s.name}`} key={s.id}>
                    {s.name}
                  </option>
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
          <div className="w-full md:w-2/5">
            <label className="mb-3 block text-black dark:text-white">
              Filter By Staff Member
            </label>
            <div className="relative h-16 h-16 z-20 w-full rounded border border-stroke p-1.5 pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
              <div className="flex flex-wrap items-center">
                {filters.staffMember && (
                  <span className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30">
                    {workerName}
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
                )}
              </div>
              <select
                name=""
                id=""
                className="absolute top-0 left-0 z-20 h-full w-full bg-transparent opacity-0"
                onChange={(e) => {
                  const [id, name] = e.target.value.split('|');
                  setworkerName(name);

                  setFilters((v: any) => ({
                    ...v,
                    staffMember: id,
                  }));
                }}
              >
                <option value="">Select A Member</option>
                {workers.map((w) => (
                  <option value={`${w.id}|${w.name}`} key={w.id}>
                    {w.name}
                  </option>
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
        </div>
        <button
          className="inline-flex w-30 items-center justify-center gap-2.5 disabled:cursor-default rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={handleFilters}
        >
          Filter
        </button>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Order Number
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black  dark:text-white">
                  Customer
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black  dark:text-white">
                  Service
                </th>
                <th className="py-4 px-4 font-medium text-black  dark:text-white">
                  Worker
                </th>
                <th className="py-4 px-4 font-medium text-black  dark:text-white">
                  Total
                </th>
                <th className="py-4 px-4 font-medium text-black  dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black  dark:text-white">
                  Type
                </th>
                <th className="py-4 px-4 font-medium text-black  dark:text-white">
                  Appointment Date
                </th>
                <th className="py-4 px-4 font-medium text-black  dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {!isloading &&
                currentItems?.map((o) => (
                  <tr key={o.id}>
                    <td className="border-b border-[#eee] py-4 px-4  dark:border-strokedark min-w-[220px]">
                      <h5 className="font-medium text-black dark:text-white">
                        {o.orderNumber}
                      </h5>
                      {/* <p className="text-sm">$0.00</p> */}
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark min-w-[150px]">
                      <p className="text-black dark:text-white">{o.customer}</p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark min-w-[120px]">
                      <p className="text-black dark:text-white">{o.service}</p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark min-w-[120px]">
                      <p className="text-black dark:text-white">{o.worker}</p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark min-w-[120px]">
                      <p className="text-black dark:text-white">{o.total}</p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark min-w-[120px]">
                      <p className="text-black dark:text-white">{o.status}</p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark min-w-[120px]">
                      <p className="text-black dark:text-white">{o.type}</p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark min-w-[120px]">
                      <p className="text-black dark:text-white">
                        {o.appointmentDate instanceof Timestamp
                          ? o.appointmentDate?.toDate().toString()
                          : o.appointmentDate || ''}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark min-w-[120px]">
                      <p
                        className="text-black dark:text-white cursor-pointer dark:hover:text-meta-6 hover:text-meta-6"
                        onClick={() => {
                          navigate('/orderDetails', {
                            state: {
                              order: o,
                            },
                          });
                        }}
                      >
                        Show Details
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {isloading && <LoaderIcon className="h-12 w-12 mx-auto my-10" />}
      </div>
      <div className="my-10 mx-15">
        <div className="flex flex-wrap gap-5 xl:gap-7.5 items-center">
          <button
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            disabled={page === 1}
            onClick={() => {
              if (page == 1) return;
              setpage((p) => p - 1);
            }}
          >
            <span>
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_182_46495)">
                  <path
                    d="M18.875 11.4375C18.3125 10.8438 17.5625 10.5312 16.75 10.5312C16.125 10.5312 15.5625 10.7188 15.0625 11.0938C15 11.125 14.9688 11.1562 14.9062 11.2188C14.8438 11.1875 14.8125 11.125 14.75 11.0938C14.25 10.7188 13.6875 10.5312 13.0625 10.5312C12.9062 10.5312 12.7812 10.5312 12.6562 10.5625C11.7188 9.5 10.5625 8.75 9.3125 8.40625C10.625 7.75 11.5312 6.40625 11.5312 4.875C11.5312 2.6875 9.75 0.9375 7.59375 0.9375C5.40625 0.9375 3.65625 2.71875 3.65625 4.875C3.65625 6.4375 4.5625 7.78125 5.875 8.40625C4.5625 8.78125 3.40625 9.53125 2.4375 10.6562C1.125 12.2188 0.375 14.4062 0.3125 16.7812C0.3125 17.0312 0.4375 17.25 0.65625 17.3438C1.5 17.75 4.4375 19.0938 7.59375 19.0938C9.28125 19.0938 10.8438 18.8125 10.9062 18.8125C11.25 18.75 11.4688 18.4375 11.4062 18.0938C11.3438 17.75 11.0312 17.5312 10.6875 17.5938C10.6875 17.5938 9.15625 17.875 7.59375 17.875C5.0625 17.8438 2.65625 16.875 1.5625 16.375C1.65625 14.4375 2.3125 12.7187 3.375 11.4375C4.46875 10.125 5.96875 9.40625 7.59375 9.40625C9.03125 9.40625 10.375 10 11.4375 11.0312C11.2812 11.1562 11.125 11.2812 11 11.4062C10.4688 11.9688 10.1875 12.75 10.1875 13.5938C10.1875 14.4375 10.5 15.2188 11.1562 16C11.6875 16.6562 12.4375 17.2812 13.2812 18L13.3125 18.0312C13.5937 18.25 13.9062 18.5312 14.2188 18.8125C14.4062 19 14.6875 19.0938 14.9375 19.0938C15.1875 19.0938 15.4687 19 15.6562 18.8125C16 18.5312 16.3125 18.25 16.5938 18C17.4375 17.2812 18.1875 16.6562 18.7188 16C19.375 15.2188 19.6875 14.4375 19.6875 13.5938C19.6875 12.7812 19.4062 12.0312 18.875 11.4375ZM4.875 4.875C4.875 3.375 6.09375 2.1875 7.5625 2.1875C9.0625 2.1875 10.25 3.40625 10.25 4.875C10.25 6.375 9.03125 7.5625 7.5625 7.5625C6.09375 7.5625 4.875 6.34375 4.875 4.875ZM17.75 15.2188C17.2812 15.7812 16.5938 16.375 15.7812 17.0625C15.5312 17.2812 15.2188 17.5312 14.9062 17.7812C14.625 17.5312 14.3438 17.2812 14.0938 17.0938L14.0625 17.0625C13.25 16.375 12.5625 15.7812 12.0938 15.2188C11.625 14.6562 11.4062 14.1562 11.4062 13.625C11.4062 13.0937 11.5938 12.625 11.9062 12.2812C12.2188 11.9375 12.6563 11.75 13.0938 11.75C13.4375 11.75 13.75 11.8438 14 12.0625C14.125 12.1562 14.2188 12.25 14.3125 12.375C14.5938 12.7188 15.1875 12.7188 15.5 12.375C15.5938 12.25 15.7187 12.1562 15.8125 12.0625C16.0937 11.8438 16.4062 11.75 16.7188 11.75C17.1875 11.75 17.5938 11.9375 17.9062 12.2812C18.2188 12.625 18.4062 13.0937 18.4062 13.625C18.4375 14.1875 18.2188 14.6562 17.75 15.2188Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_182_46495">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            Previous
          </button>
          <h2>Page {page}</h2>
          <button
            className="inline-flex items-center justify-center gap-2.5 disabled:cursor-default rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            disabled={page == totalPages}
            onClick={() => {
              if (page < totalPages) {
                setpage((p) => p + 1);
              }
            }}
          >
            <span>
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_182_46495)">
                  <path
                    d="M18.875 11.4375C18.3125 10.8438 17.5625 10.5312 16.75 10.5312C16.125 10.5312 15.5625 10.7188 15.0625 11.0938C15 11.125 14.9688 11.1562 14.9062 11.2188C14.8438 11.1875 14.8125 11.125 14.75 11.0938C14.25 10.7188 13.6875 10.5312 13.0625 10.5312C12.9062 10.5312 12.7812 10.5312 12.6562 10.5625C11.7188 9.5 10.5625 8.75 9.3125 8.40625C10.625 7.75 11.5312 6.40625 11.5312 4.875C11.5312 2.6875 9.75 0.9375 7.59375 0.9375C5.40625 0.9375 3.65625 2.71875 3.65625 4.875C3.65625 6.4375 4.5625 7.78125 5.875 8.40625C4.5625 8.78125 3.40625 9.53125 2.4375 10.6562C1.125 12.2188 0.375 14.4062 0.3125 16.7812C0.3125 17.0312 0.4375 17.25 0.65625 17.3438C1.5 17.75 4.4375 19.0938 7.59375 19.0938C9.28125 19.0938 10.8438 18.8125 10.9062 18.8125C11.25 18.75 11.4688 18.4375 11.4062 18.0938C11.3438 17.75 11.0312 17.5312 10.6875 17.5938C10.6875 17.5938 9.15625 17.875 7.59375 17.875C5.0625 17.8438 2.65625 16.875 1.5625 16.375C1.65625 14.4375 2.3125 12.7187 3.375 11.4375C4.46875 10.125 5.96875 9.40625 7.59375 9.40625C9.03125 9.40625 10.375 10 11.4375 11.0312C11.2812 11.1562 11.125 11.2812 11 11.4062C10.4688 11.9688 10.1875 12.75 10.1875 13.5938C10.1875 14.4375 10.5 15.2188 11.1562 16C11.6875 16.6562 12.4375 17.2812 13.2812 18L13.3125 18.0312C13.5937 18.25 13.9062 18.5312 14.2188 18.8125C14.4062 19 14.6875 19.0938 14.9375 19.0938C15.1875 19.0938 15.4687 19 15.6562 18.8125C16 18.5312 16.3125 18.25 16.5938 18C17.4375 17.2812 18.1875 16.6562 18.7188 16C19.375 15.2188 19.6875 14.4375 19.6875 13.5938C19.6875 12.7812 19.4062 12.0312 18.875 11.4375ZM4.875 4.875C4.875 3.375 6.09375 2.1875 7.5625 2.1875C9.0625 2.1875 10.25 3.40625 10.25 4.875C10.25 6.375 9.03125 7.5625 7.5625 7.5625C6.09375 7.5625 4.875 6.34375 4.875 4.875ZM17.75 15.2188C17.2812 15.7812 16.5938 16.375 15.7812 17.0625C15.5312 17.2812 15.2188 17.5312 14.9062 17.7812C14.625 17.5312 14.3438 17.2812 14.0938 17.0938L14.0625 17.0625C13.25 16.375 12.5625 15.7812 12.0938 15.2188C11.625 14.6562 11.4062 14.1562 11.4062 13.625C11.4062 13.0937 11.5938 12.625 11.9062 12.2812C12.2188 11.9375 12.6563 11.75 13.0938 11.75C13.4375 11.75 13.75 11.8438 14 12.0625C14.125 12.1562 14.2188 12.25 14.3125 12.375C14.5938 12.7188 15.1875 12.7188 15.5 12.375C15.5938 12.25 15.7187 12.1562 15.8125 12.0625C16.0937 11.8438 16.4062 11.75 16.7188 11.75C17.1875 11.75 17.5938 11.9375 17.9062 12.2812C18.2188 12.625 18.4062 13.0937 18.4062 13.625C18.4375 14.1875 18.2188 14.6562 17.75 15.2188Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_182_46495">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Orders;
