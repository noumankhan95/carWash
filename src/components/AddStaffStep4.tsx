import React from 'react';
import SwitcherOne from './SwitcherOne';
import Buttons from '../pages/UiElements/Buttons';
// import { Modal } from './ModalSettings';
import Modal from './Modal';

function AddServingArea() {
  const [enabled, setEnabled] = React.useState<boolean>(true);

  const weekDays = [
    { day: 'Sunday' },
    { day: 'Monday' },
    { day: 'Tuesday' },
    { day: 'Wednesday' },
    { day: 'Thursday' },
    { day: 'Friday' },
    { day: 'Saturday' },
  ];
  return (
    <div className="flex flex-col space-y-4">
      {enabled && (
        // <div className="flex mx-auto">
          <Modal closeModal={() => setEnabled(false)}>
            <h1 className="mx-8 text-2xl font-bold">Add Location</h1>
            <form action="#">
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
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Enter Estimated Arrival Time In Minutes
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Enter Minimum Order Value
                  </label>
                  <input
                    type="text"
                    placeholder="Select subject"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                  Save
                </button>
              </div>
            </form>
          </Modal>
        // </div>
      )}

      <h1 className="text-xl font-bold">Timings Serving Area</h1>
      <button
        className="inline-flex w-52 items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        onClick={() => setEnabled((p) => true)}
      >
        Add Location
      </button>
    </div>
  );
}

export default AddServingArea;
