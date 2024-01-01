import { useState } from 'react';
import AddStaffMember from './AddStaffMember';
import { useNavigate } from 'react-router-dom';

function Staff() {
  const navigate = useNavigate();
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
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
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
    </div>
  );
}

export default Staff;
