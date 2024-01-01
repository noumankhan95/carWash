import React, { useRef, FormEvent } from 'react';
import useWorkerStore from '../store/ServiceStore';

function AddLocation() {
  const areasServeRef = useRef<HTMLInputElement | null>(null);
  const arrivalTimeRef = useRef<HTMLInputElement | null>(null);
  const minOrderValueRef = useRef<HTMLInputElement | null>(null);
  const { addServingArea } = useWorkerStore();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Access input values using refs
    const areasServe = areasServeRef.current?.value || '';
    const arrivalTime = arrivalTimeRef.current?.value || '';
    const minOrderValue = minOrderValueRef.current?.value || '';

    // Handle the form data as needed
    console.log('Areas Served:', areasServe);
    console.log('Arrival Time:', arrivalTime);
    console.log('Minimum Order Value:', minOrderValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Enter Areas You Serve
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              ref={areasServeRef}
            />
          </div>
        </div>

        <div className="mb-4.5">
          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Enter Estimated Arrival Time In Minutes
            </label>
            <input
              type="number"
              placeholder="Enter Est Arrival"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              ref={arrivalTimeRef}
            />
          </div>
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Enter Minimum Order Value
          </label>
          <input
            type="number"
            placeholder="Enter Order Value"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ref={minOrderValueRef}
          />
        </div>

        <button
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
          type="submit"
          onClick={() => {
            addServingArea({
              arrivalTime: arrivalTimeRef.current?.value!,
              Location: areasServeRef.current?.value!,
              MinimunOrderValue: minOrderValueRef.current?.value!,
            });
          }}
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default AddLocation;
