import { createContext, useCallback, useContext } from "react";
import { UserDataContext } from "./context";
import { getTGT } from "@/requests";

export type AuthContextType = {
  askForTGT: (params: {
    lifetime?: string;
    serviceName?: string;
  }) => Promise<true | null>;
};

const AuthContext = createContext<AuthContextType>({
  askForTGT: async () => null,
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
      if (!userData.username) return null;
      const result = await getTGT({
        username: userData.username,
        serviceName,
        lifetime,
      }).catch((err) => {
        console.log(err);
        return null;
      });
      if (!result) return null;

      const encForClient = result.data.encForClient;
      const enctgt = result.data.enctgt;
      if (!encForClient || !enctgt) return null;

      //   decrypt for client

      return true;
    },
    [userData]
  );

  return (
    <AuthContext.Provider value={{ askForTGT }}>
      {children}
    </AuthContext.Provider>
  );
}
