import React, { useState } from 'react';
import SwitcherOne from './SwitcherOne';
import useWorkerStore from '../store/ServiceStore';

function AddTimings({ settheStep }: AddStaffMemberChildrenProps) {
  const { updateTimings, Timings } = useWorkerStore();
  const [weekDays, setweekdays] = useState([
    { day: 'Sunday', enabled: false, from: '', to: '' },
    { day: 'Monday', enabled: false, from: '', to: '' },
    { day: 'Tuesday', enabled: false, from: '', to: '' },
    { day: 'Wednesday', enabled: false, from: '', to: '' },
    { day: 'Thursday', enabled: false, from: '', to: '' },
    { day: 'Friday', enabled: false, from: '', to: '' },
    { day: 'Saturday', enabled: false, from: '', to: '' },
  ]);
  console.log(Timings);
  return (
    <div className="flex flex-col  space-y-2">
      <h1 className="text-xl font-bold">Timings Schedule</h1>

      <div className="flex justify-between space-x-2 w-full">
        <div className="bg-white dark:bg-graydark text-white p-5 w-5/6  space-y-4">
          {weekDays.map((w) => (
            <div className="flex w-full items-center justify-between ">
              <div className="w-1/2">
                <h1>{w.day}</h1>
                <div>
                  <label className="flex cursor-pointer select-none items-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name={w.day}
                        className="sr-only"
                        onChange={(e) => {
                          console.log(e.currentTarget);
                          setweekdays((p) =>
                            p.map((d) =>
                              d.day === w.day
                                ? { ...d, enabled: !d.enabled }
                                : d,
                            ),
                          );
                        }}
                      />
                      <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
                          (Timings[w.day as Day].enabled || w.enabled) &&
                          '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                        }`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>
              {(Timings[w.day as Day].enabled || w.enabled) && (
                <div className="flex justify-around items-center w-full">
                  <label className="mb-3 block text-black dark:text-white">
                    Choose Timings
                  </label>
                  <div className="relative z-20 bg-white dark:bg-form-input w-60 space-x-1">
                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                            fill="#637381"
                          ></path>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                            fill="#637381"
                          ></path>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                            fill="#637381"
                          ></path>
                        </g>
                      </svg>
                    </span>
                    <select
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      defaultValue={Timings[w.day as Day].from}
                      onChange={(e) => {
                        console.log(e.currentTarget);
                        setweekdays((p) =>
                          p.map((d) =>
                            d.day === w.day
                              ? { ...d, from: e.target.value }
                              : d,
                          ),
                        );
                      }}
                    >
                      <option value="00:00">00:00</option>
                      <option value="00:15">00:15</option>
                      <option value="00:30">00:30</option>
                      <option value="00:45">00:45</option>
                      <option value="01:00">01:00</option>
                      <option value="01:15">01:15</option>
                      <option value="01:30">01:30</option>
                      <option value="01:45">01:45</option>
                      <option value="02:00">02:00</option>
                      <option value="02:15">02:15</option>
                      <option value="02:30">02:30</option>
                      <option value="02:45">02:45</option>
                      <option value="03:00">03:00</option>
                      <option value="03:15">03:15</option>
                      <option value="03:30">03:30</option>
                      <option value="03:45">03:45</option>
                      <option value="04:00">04:00</option>
                      <option value="04:15">04:15</option>
                      <option value="04:30">04:30</option>
                      <option value="04:45">04:45</option>
                      <option value="05:00">05:00</option>
                      <option value="05:15">05:15</option>
                      <option value="05:30">05:30</option>
                      <option value="05:45">05:45</option>
                      <option value="06:00">06:00</option>
                      <option value="06:15">06:15</option>
                      <option value="06:30">06:30</option>
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
                  <div className="relative z-20 bg-white dark:bg-form-input w-60 space-x-1">
                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                            fill="#637381"
                          ></path>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                            fill="#637381"
                          ></path>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                            fill="#637381"
                          ></path>
                        </g>
                      </svg>
                    </span>
                    <select
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      defaultValue={Timings[w.day as Day].to}
                      onChange={(e) => {
                        console.log(e.currentTarget);
                        setweekdays((p) =>
                          p.map((d) =>
                            d.day === w.day ? { ...d, to: e.target.value } : d,
                          ),
                        );
                      }}
                    >
                      <option value="00:00">00:00</option>
                      <option value="00:15">00:15</option>
                      <option value="00:30">00:30</option>
                      <option value="00:45">00:45</option>
                      <option value="01:00">01:00</option>
                      <option value="01:15">01:15</option>
                      <option value="01:30">01:30</option>
                      <option value="01:45">01:45</option>
                      <option value="02:00">02:00</option>
                      <option value="02:15">02:15</option>
                      <option value="02:30">02:30</option>
                      <option value="02:45">02:45</option>
                      <option value="03:00">03:00</option>
                      <option value="03:15">03:15</option>
                      <option value="03:30">03:30</option>
                      <option value="03:45">03:45</option>
                      <option value="04:00">04:00</option>
                      <option value="04:15">04:15</option>
                      <option value="04:30">04:30</option>
                      <option value="04:45">04:45</option>
                      <option value="05:00">05:00</option>
                      <option value="05:15">05:15</option>
                      <option value="05:30">05:30</option>
                      <option value="05:45">05:45</option>
                      <option value="06:00">06:00</option>
                      <option value="06:15">06:15</option>
                      <option value="06:30">06:30</option>
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
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        className="w-52 rounded bg-primary p-3 font-medium text-gray"
        onClick={() => {
          const daysMap = weekDays.reduce((acc, curr) => {
            acc[curr.day as Day] = {
              from: curr.from,
              to: curr.to,
              enabled: curr.enabled,
            };

            return acc;
          }, {} as Timings);
          updateTimings(daysMap);
          settheStep();
        }}
      >
        Save
      </button>
    </div>
  );
}

export default AddTimings;
