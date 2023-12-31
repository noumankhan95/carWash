import { useState } from 'react';
import AddAStaffMember from '../components/AddStaffStep1';
import AddService from '../components/AddStaffSteo2';
import AddTimings from '../components/AddStaffStep3';
import AddServingArea from '../components/AddStaffStep4';
type StepComponent = {
  [key: number]: {
    component: React.ReactNode;
    name: string;
    stepNumber: number;
  };
};
function AddStaffMember() {
  const [steps, setsteps] = useState(1);
  const stepAndComponent: StepComponent = {
    1: {
      component: <AddAStaffMember />,
      name: 'Add Staff Member',
      stepNumber: 1,
    },
    2: { component: <AddService />, name: 'Add Service', stepNumber: 2 },
    3: { component: <AddTimings />, name: 'Add Timings', stepNumber: 3 },
    4: {
      component: <AddServingArea />,
      name: 'Add Serving Area',
      stepNumber: 4,
    },
  };
  return (
    <div className="flex flex-col space-y-6">
      <div className="cursor-pointer flex space-x-5">
        {Object.values(stepAndComponent).map((i) => (
          <h1
            className="hover:text-primary"
            onClick={() => setsteps((p) => i.stepNumber)}
          >
            {i.name}
          </h1>
        ))}
      </div>
      {stepAndComponent[steps as number].component}
      {steps < Object.values(stepAndComponent).length && (
        <button
          className="inline-flex w-52 items-center justify-center bg-black py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={() => setsteps((p) => p + 1)}
        >
          Proceed
        </button>
      )}
    </div>
  );
}

export default AddStaffMember;
