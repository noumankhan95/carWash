import React, { useCallback, useRef } from 'react';
import { useState } from 'react';
import useProviderStore from '../store/useProviderStore';
function EditSubscriptionModal({
  name,
  closeModal,
}: {
  name: string;
  closeModal: () => void;
}) {
  const { Subscriptions, setsubscriptions } = useProviderStore();
  const thisSub = Subscriptions.find((o) => o.name === name);
  const [firstenabled, setfirstenabled] = useState<boolean>(
    thisSub?.packages[0].Once.isrunning || false,
  );
  const [secondenabled, setsecondenabled] = useState<boolean>(
    thisSub?.packages[0].Twice.isrunning || false,
  );
  const [thirdenabled, setthirdenabled] = useState<boolean>(
    thisSub?.packages[0].Thrice.isrunning || false,
  );
  const firstDiscountRef = useRef<HTMLInputElement | null>(null);
  const secondDiscountRef = useRef<HTMLInputElement | null>(null);
  const thirdDiscountRef = useRef<HTMLInputElement | null>(null);
  console.log(Subscriptions);
  console.log(thisSub, 'this sub');

  const addSubscription = useCallback(() => {
    setsubscriptions({
      name,
      packages: [
        {
          Once: {
            isrunning: firstenabled,
            discount: firstDiscountRef.current?.value!,
            duration: 'Once',
          },
          Twice: {
            isrunning: secondenabled,
            discount: secondDiscountRef.current?.value!,
            duration: 'Twice',
          },
          Thrice: {
            isrunning: thirdenabled,
            discount: thirdDiscountRef.current?.value!,
            duration: 'Thrice',
          },
        },
      ],
    });
  }, [
    firstDiscountRef,
    secondDiscountRef,
    thirdDiscountRef,
    firstenabled,
    secondenabled,
    thirdenabled,
  ]);
  return (
    <div>
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">{name}</h3>
          </div>
          <form action="#">
            <div className="flex w-full items-center justify-between px-3 ">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="py-6 px-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    Top Products
                  </h4>
                </div>

                <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-4 md:px-6 2xl:px-7.5">
                  <div className="col-span-1 flex items-center">
                    <p className="font-medium"></p>
                  </div>
                  <div className="col-span-1 hidden items-center sm:flex">
                    <p className="font-medium">Package Name</p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="font-medium">Total Washes</p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="font-medium">Discount Percent</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-4 md:px-6 2xl:px-7.5">
                  <div>
                    <label
                      htmlFor="toggle1"
                      className="flex cursor-pointer select-none items-center"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="toggle1"
                          className="sr-only"
                          onChange={() => {
                            setfirstenabled((p) => !p);
                          }}
                        />
                        <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                        <div
                          className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                            firstenabled &&
                            '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                          }`}
                        >
                          <span
                            className={`hidden ${firstenabled && '!block'}`}
                          >
                            <svg
                              className="fill-white dark:fill-black"
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill=""
                                stroke=""
                                strokeWidth="0.4"
                              ></path>
                            </svg>
                          </span>
                          <span className={`${firstenabled && 'hidden'}`}>
                            <svg
                              className="h-4 w-4 stroke-current"
                              fill="none"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <p className="text-sm text-black dark:text-white">
                        Once Per Week
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <p className="text-sm text-black dark:text-white">
                        4 Washes
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 hidden items-center sm:flex">
                    <input
                      ref={firstDiscountRef}
                      defaultValue={thisSub?.packages[0].Once.discount}
                      type="text"
                      placeholder="%"
                      className="w-full bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-4 md:px-6 2xl:px-7.5">
                  <div>
                    <label
                      htmlFor="toggle2"
                      className="flex cursor-pointer select-none items-center"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="toggle2"
                          className="sr-only"
                          onChange={() => {
                            setsecondenabled((p) => !p);
                          }}
                        />
                        <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                        <div
                          className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                            secondenabled &&
                            '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                          }`}
                        >
                          <span
                            className={`hidden ${secondenabled && '!block'}`}
                          >
                            <svg
                              className="fill-white dark:fill-black"
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill=""
                                stroke=""
                                strokeWidth="0.4"
                              ></path>
                            </svg>
                          </span>
                          <span className={`${secondenabled && 'hidden'}`}>
                            <svg
                              className="h-4 w-4 stroke-current"
                              fill="none"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <p className="text-sm text-black dark:text-white">
                        Twice Per Week
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <p className="text-sm text-black dark:text-white">
                        8 Washes
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1 hidden items-center sm:flex">
                    <input
                      ref={secondDiscountRef}
                      defaultValue={thisSub?.packages[0].Twice.discount}
                      type="text"
                      placeholder="%"
                      className="w-full bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-4 md:px-6 2xl:px-7.5">
                  <div>
                    <label
                      htmlFor="toggle3"
                      className="flex cursor-pointer select-none items-center"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="toggle3"
                          className="sr-only"
                          onChange={() => {
                            setthirdenabled((p) => !p);
                          }}
                        />
                        <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                        <div
                          className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                            thirdenabled &&
                            '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                          }`}
                        >
                          <span
                            className={`hidden ${thirdenabled && '!block'}`}
                          >
                            <svg
                              className="fill-white dark:fill-black"
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill=""
                                stroke=""
                                strokeWidth="0.4"
                              ></path>
                            </svg>
                          </span>
                          <span className={`${thirdenabled && 'hidden'}`}>
                            <svg
                              className="h-4 w-4 stroke-current"
                              fill="none"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <p className="text-sm text-black dark:text-white">
                        Thrice Per Week
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <p className="text-sm text-black dark:text-white">
                        12 Washes
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1 hidden items-center sm:flex">
                    <input
                      ref={thirdDiscountRef}
                      defaultValue={thisSub?.packages[0].Thrice.discount}
                      type="text"
                      placeholder="%"
                      className="w-full bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="flex px-4 gap-10 my-6">
            <button
              type="button"
              className="inline-flex bg-primary items-center justify-center rounded-md border border-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              onClick={() => {
                addSubscription();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSubscriptionModal;
