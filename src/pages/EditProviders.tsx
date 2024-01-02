import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddAStaffMember from '../components/AddStaffStep1';
import AddService from '../components/AddStaffSteo2';
import AddTimings from '../components/AddStaffStep3';
import AddServingArea from '../components/AddStaffStep4';
import useWorkerStore from '../store/ServiceStore';
import ProviderInformation from '../components/ProviderInformation';
import Subscription from '../components/Subscription';
type StepComponent = {
  [key: number]: {
    component: (props: AddStaffMemberChildrenProps) => React.ReactNode;
    name: string;
    stepNumber: number;
  };
};
function EditProviders() {
  const [steps, setsteps] = useState(1);
  const { StaffMember } = useWorkerStore();
  const stepAndComponent: StepComponent = {
    1: {
      component: (props) => <ProviderInformation {...props} />,
      name: 'Provider Information',
      stepNumber: 1,
    },
    2: {
      component: (props) => <Subscription {...props} />,
      name: 'Subscription',
      stepNumber: 2,
    },
  };
  console.table(StaffMember);
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
      {stepAndComponent[steps as number].component({
        settheStep: () => {
          setsteps(stepAndComponent[steps as number].stepNumber + 1);
        },
      })}
      {/* {steps < Object.values(stepAndComponent).length && (
        <button
          className="inline-flex w-52 items-center justify-center bg-black py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={() => setsteps((p) => p + 1)}
        >
          Proceed
        </button>
      )} */}
    </div>
  );
}

export default EditProviders;
