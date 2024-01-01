type StaffWorker = {
  StaffMember: StaffMember;
  Service: {
    services: Services[];
  };
  Timings: Timings;
  ServingArea: ServingArea[];
  setServiceValue: (QVal: Services) => void;
  removeServiceValue(Qval: Services);
  addServingArea: (Qval: ServingArea) => void;
  removeServingArea: (Qval: ServingArea) => void;
  updateStaffMember: (Qval: StaffMember) => void;
  updateTimings: (timings: Timings) => void;
};
type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';
type modifier = {
  description: string;
  arabicDescription: string;
  modifiername: string;
  price: string;
  duration: string;
};
type Timings = {
  [key in Day]: { from: string; to: string; enabled: boolean };
};
type Services = {
  [key in ServiceName]: modifier[];
};

type ServiceName =
  | 'Standard Wash'
  | 'Premium Wash'
  | 'Washing'
  | 'Car Detailing'
  | 'Gold Wash'
  | 'Ceramic'
  | 'Platinum Wash';
type StaffMember = {
  Name: string;
  ArabicName: string;
  file: Array<{ url: File }>;
  phone: string;
};

type ServingArea = {
  Location: string;
  arrivalTime: string;
  MinimunOrderValue: string;
};

type AddStaffMemberChildrenProps = {
  settheStep: () => void;
};
