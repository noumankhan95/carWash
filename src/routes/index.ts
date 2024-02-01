import { lazy } from 'react';
const AddUpselling = lazy(() => import('../pages/AddUpselling'));
const AddCategory = lazy(() => import('../pages/AddCategory'));
const AddService = lazy(() => import('../pages/AddService'));
const Categories = lazy(() => import('../pages/Categories'));
const Services = lazy(() => import('../pages/Services'));
const Upselling = lazy(() => import('../pages/Upselling'));
const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const Staff = lazy(() => import('../pages/Staff'));
const AddStaff = lazy(() => import('../pages/AddStaffMember'));
const Roles = lazy(() => import('../pages/Roles'));
const Subscription = lazy(() => import('../pages/Subscription'));
const Orders = lazy(() => import('../pages/Orders'));
const AddSubscription = lazy(() => import('../pages/AddSubscription'));

const Providers = lazy(() => import('../pages/Providers'));
const EditProviders = lazy(() => import('../pages/EditProviders'));

// const EditProviders = lazy(() => import('../pages/EditProviders'));

const coreRoutes = [
  {
    path: '/orders',
    title: 'Order',
    component: Orders,
  },
  {
    path: '/addSubscription',
    title: 'Add Subscription',
    component: AddSubscription,
  },
  {
    path: '/subscriptions',
    title: 'Subscription',
    component: Subscription,
  },
  {
    path: '/upsellings',
    title: 'Upselling',
    component: Upselling,
  },
  {
    path: '/addUpselling',
    title: 'Add Upselling',
    component: AddUpselling,
  },
  {
    path: '/categories',
    title: 'Categories',
    component: Categories,
  },
  {
    path: '/addcategory',
    title: 'Add Category',
    component: AddCategory,
  },
  {
    path: '/services',
    title: 'Services',
    component: Services,
  },
  {
    path: '/addService',
    title: 'Add Service',
    component: AddService,
  },
  {
    path: '/editproviders',
    title: 'editProvider',
    component: EditProviders,
  },
  // {
  //   path: '/subscriptions',
  //   title: 'Calender',
  //   component: Subscription,
  // },
  {
    path: '/providers',
    title: 'Providers',
    component: Providers,
  },
  {
    path: '/calendar',
    title: 'Calender',
    component: Calendar,
  },
  {
    path: '/addstaff',
    title: 'addStaff',
    component: AddStaff,
  },
  {
    path: '/roles',
    title: 'roles',
    component: Roles,
  },
  {
    path: '/staff',
    title: 'Staff',
    component: Staff,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
];

const routes = [...coreRoutes];
export default routes;
