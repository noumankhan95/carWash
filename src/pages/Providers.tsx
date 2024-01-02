import React from 'react';
import { useNavigate } from 'react-router-dom';
function Providers() {
  const navigate = useNavigate();
  return (
    <div>
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
              Email
            </h5>
          </div>
          <div className="hidden p-1.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Phone
            </h5>
          </div>
        </div>
      </div>
      <button
        className="inline-flex items-center justify-center rounded-md border border-meta-3 py-4 px-5 text-center font-medium text-meta-3 hover:bg-opacity-90 lg:px-5 xl:px-4"
        onClick={() => {
          navigate('/editproviders');
        }}
      >
        Edit
      </button>
    </div>
  );
}

export default Providers;
