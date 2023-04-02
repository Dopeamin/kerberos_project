import { createContext, useCallback, useContext } from "react";
import { UserDataContext } from "./context";
import { getTGT } from "@/requests";

export type AuthContextType = {
  askForTGT: (params: {
    lifetime?: string;
    serviceName?: string;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  askForTGT: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {
  const { userData } = useContext(UserDataContext);

  const askForTGT = useCallback(
    async ({
      serviceName = "chatgpt-server",
      lifetime = "day",
    }: {
      lifetime?: string;
      serviceName?: string;
    }) => {
      if (!userData.username) return;
      const result = await getTGT({
        username: userData.username,
        serviceName,
        lifetime,
      });
      console.log(result);
    },
    [userData]
  );

  return (
    <AuthContext.Provider value={{ askForTGT }}>
      {children}
    </AuthContext.Provider>
  );
}
