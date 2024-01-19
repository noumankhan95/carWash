type StaffWorker = {
  userAuth: { email: string; password: string };
  StaffMember: StaffMember;
  Service: {
    services: Services[];
  };
  isEditing: { value: boolean; id: sting };
  Timings: Timings;
  ServingArea: ServicesList[];
  setServiceValue: (QVal: Services) => void;
  removeServiceValue(Qval: Services);
  addServingArea: (Qval: ServicesList[]) => void;
  removeServingArea: (Qval: ServingArea) => void;
  updateStaffMember: (Qval: StaffMember) => void;
  updateTimings: (timings: Timings) => void;
  addToDb: () => Promise<void>;
  EditItem: (Qval: StaffWorkerUser) => void;
  EmptyFields: () => void;
  setIsEditing: (id: string) => void;
  setIsNotEditing: () => void;
  addEditedItemtoDb: () => Promsise<void>;
  setUserAuth: (email: string, password: string) => void;
};
type WeekDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';
type Modifier = {
  modifiername: string;
  price: string;
  duration: string;
};

type Services = {
  serviceName: string;
  description: string;
  arabicDescription: string;
  Modifiers: { [key in ServiceName]: Modifier[] };
};
type Timings = {
  [key in WeekDay]: { from: string; to: string; enabled: boolean };
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
  file: Array<{ url: File | string }>;
  phone: string;
  email: string;
  permissions: PermissionsRoles[];
};

type AddStaffMemberChildrenProps = {
  settheStep: () => void;
};

type StaffWorkerUser = {
  StaffMember: StaffMember;
  Service: {
    services: Services[];
  };
  Timings: Timings;
  ServingArea: ServicesList[];
};

type Roles = 'Staff' | 'Admin' | 'User';
type PermissionsRoles = string;
type WebsiteUsers = {
  id: string;
  role?: Roles;
  email: string;
  name: string;
  phone: string;
  permissions: PermissionsRoles[];
};

interface UserAuth extends WebsiteUsers {
  isloggedIn: boolean;
  setisloggedIn: (user: { isloggedIn: boolean } & WebsiteUsers) => void;
}

type providerSetValue = {
  providerInfo: ProviderInfo;
  providerAccountInfo: ProviderAccountInfo;
  providerAddressInfo: ProviderAddressInfo;
};
type providerGetInfo = {
  providerInfo: ProviderInfo;
  providerAccountInfo: ProviderAccountInfo;
  providerAddressInfo: ProviderAddressInfo;
  Subscriptions: ProviderSubscription[];
  isEditing: { value: boolean; id: string };
};
type ProviderInformation = {
  providerInfo: ProviderInfo;
  providerAccountInfo: ProviderAccountInfo;
  providerAddressInfo: ProviderAddressInfo;
  Subscriptions: ProviderSubscription[];
  isEditing: { value: boolean; id: string };
  setisEditing: (id: string) => void;
  setisNotEditing: () => void;
  setsubscriptions: (subs: ProviderSubscription) => void;
  addToDb: () => Promise<void>;
  updateinDb: () => Promise<void>;
  EmptyFields: () => void;
  setAllProviderInformation: (pinfo: providerSetValue) => void;
  setallsubscriptions: (sub: ProviderSubscription[]) => void;
};
interface itemLocation {
  lat: number;
  lng: number;
}
type ProviderInfo = {
  name: string;
  arabicname: string;
  details: string;
  arabicDetails: string;
  file: Array<{ url: File | string }>;
};
type ProviderAccountInfo = {
  email: string;
  number: string;
  callCenter: string;
};
type ProviderAddressInfo = {
  address: string;
  arabicAddress: string;
  area: string;
  arabicArea: string;
  location: itemLocation;
};
type ProviderSubscription = {
  name: string;
  packages: Packages[];
};

type Packages = {
  [key in PackageDuration]: {
    discount: string;
    isrunning: boolean;
    duration: string;
  };
};

type PackageDuration = 'Once' | 'Twice' | 'Thrice';
type ServicesList = {
  [areaName: string]: serviceLocation[];
  duration: number;
  minamount: number;
};
type serviceLocation = {
  address: string;
  area: string;
  location: itemLocation;
  id: string;
};

// type ServingArea = {
//   locations: ServicesList[];
//   duration: number;
//   minamount: number;
// };

type Orders = {
  id: string;
  orderNumber: string;
  customer: string;
  service: string;
  worker: string;
  total: number;
  status: string;
  type: string;
  appointmentDate: Date;
  paymentMethod: string;
  selectedDate: Date;
  uid: string;
};
