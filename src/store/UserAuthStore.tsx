import { create } from 'zustand';

const useUserAuth = create<UserAuth>((set) => ({
  id: '',
  phone: '',
  isloggedIn: false,
  email: '',
  name: '',
  role: 'User' as Roles,
  setisloggedIn({ email, name, phone, role, id, isloggedIn }) {
    set((state) => ({
      ...state,
      email,
      name,
      phone,
      role,
      isloggedIn,
      id,
    }));
  },
  permissions: [],
}));

export default useUserAuth;
