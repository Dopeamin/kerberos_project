import { createContext, useEffect, useState } from "react";
export type User = {
  username?: string;
  password?: string;
};
export type ContextType = {
  userData: User;
  updateUserData: (user: User) => void;
};

const defaultUser: User = {
  username: "",
  password: "",
};

export const UserDataContext = createContext<ContextType>({
  userData: defaultUser,
  updateUserData: () => {},
});

export default function Context({ children }: { children: any }) {
  const [userData, setUserData] = useState(defaultUser);

  const updateUserData = (user: User) => {
    setUserData(user);
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <UserDataContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}
