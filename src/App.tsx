import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';
import Staff from './pages/Staff';
// @ts-ignore
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import useUserAuth from './store/UserAuthStore';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import useGlobalStore from './store/globalStore';
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { isloggedIn, setisloggedIn, ...u } = useUserAuth();
  const {
    setcategories,
    setservices,
    setworkers,
    categories,
    services,
    workers,
    reloadCategories,
    setRoles,
  } = useGlobalStore();
  useEffect(() => {
    setLoading((p) => true);
    const sub = onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, 'staff', user.uid))
          .then((u) => {
            console.log(u?.data()?.permissions, 'per');
            setisloggedIn({
              ...u?.data(),
              id: user.uid,
              isloggedIn: true,
              permissions: u?.data()?.StaffMember.permissions,
            } as UserAuth);
          })
          .catch((e) => {
            alert(e);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setisloggedIn({
          email: '',
          id: '',
          name: '',
          phone: '',
          role: 'User',
          isloggedIn: false,
          permissions: '',
        });
        setLoading(false);
      }
    });
    return () => sub();
  }, []);
  const getCategories = async () => {
    try {
      const docs = await getDocs(collection(db, 'categories'));
      if (docs.empty) {
        setcategories([]);
        return;
      }
      const cats: globalCategory[] = [];
      docs.forEach((doc) =>
        cats.push({ ...(doc.data() as globalCategory), id: doc.id }),
      );
      setcategories(cats);
    } catch (e) {}
  };
  const getServices = async () => {
    try {
      const docs = await getDocs(collection(db, 'services'));
      if (docs.empty) {
        setcategories([]);
        return;
      }
      const cats: globalServices[] = [];
      docs.forEach((doc) =>
        cats.push({ ...(doc.data() as globalServices), id: doc.id }),
      );
      setservices(cats);
    } catch (e) {}
  };
  useEffect(() => {
    const className = 'dark';
    const bodyClass = window.document.body.classList;

    bodyClass.add(className);
  }, []);
  const getWorkers = async () => {
    try {
      const docs = await getDocs(collection(db, 'staff'));
      if (docs.empty) {
        setcategories([]);
        return;
      }
      const cats: globalWorkers[] = [];
      docs.forEach((doc) =>
        cats.push({
          name: doc.data().StaffMember.Name as string,
          id: doc.id,
        }),
      );
      setworkers(cats);
    } catch (e) {}
  };
  const getRoles = async () => {
    try {
      const rolesArray: AppRoles[] = [];
      const { empty, docs } = await getDocs(collection(db, 'roles'));

      if (empty) {
        setRoles({});
        return;
      }

      const proles: AppRoles | any = {
        id: docs[0].id as string,

        ...docs[0]?.data(),
      };
      rolesArray.push(proles);

      // Assuming you want to merge multiple roles into a single object
      // const mergedRoles = rolesArray.reduce((acc, role) => {
      //   return { ...acc, ...role };
      // }, {});
      setRoles(proles);
    } catch (e) {}
  };
  useEffect(() => {
    getCategories();
    getWorkers();
    getServices();
    getRoles();
  }, [reloadCategories]);
  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  //   //For timeout
  // }, []);
  // console.log('loading', loading);
  console.log('cats', categories);
  console.log('serv', services);
  console.log('workers', workers);

  console.log('islogged Auth', isloggedIn, 'and ', u);
  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          {!isloggedIn && !loading ? (
            <>
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="*" element={<SignUp />} />
            </>
          ) : (
            <Route element={<DefaultLayout />}>
              <Route index element={<Staff />} />
              {routes.map((routes, index) => {
                const { path, component: Component } = routes;
                return (
                  <Route
                    key={index}
                    path={path}
                    element={<Component settheStep={() => {}} />}
                  />
                );
              })}
              <Route path="*" element={<Staff />} />
            </Route>
          )}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
