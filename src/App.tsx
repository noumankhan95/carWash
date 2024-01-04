import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';
import Staff from './pages/Staff';
// @ts-ignore
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import useUserAuth from './store/UserAuthStore';
import { doc, getDoc } from 'firebase/firestore';
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { isloggedIn, setisloggedIn, ...u } = useUserAuth();
  useEffect(() => {
    setLoading((p) => true);
    const sub = onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, 'users', user.uid))
          .then((u) => {
            setisloggedIn({
              ...u?.data(),
              id: user.uid,
              isloggedIn: true,
            } as UserAuth);
          })
          .catch((e) => {
            console.log(e);
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
        });
        setLoading(false);
      }
    });
    return () => sub();
  }, []);
  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  //   //For timeout
  // }, []);
  console.log('loading', loading);

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
                  <Route key={index} path={path} element={<Component />} />
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
