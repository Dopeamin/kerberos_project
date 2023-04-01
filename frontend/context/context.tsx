import { createContext, useState } from "react";
export type User = {
  username?: string;
  password?: string;
};
export type ContextType = {
  userData: User;
  updateUserData: (user: User) => void;
};

export const UserData = createContext<ContextType | null>(null);

export default function Context({ children }: { children: any }) {
  const defaultUser: User = {
    username: "",
    password: "",
  };
  const [userData, setUserData] = useState(defaultUser);

  const updateUserData = (user: User) => {
    setUserData(user);
  };

  return (
    <UserData.Provider value={{ userData, updateUserData }}>
      {children}
    </UserData.Provider>
  );
}
