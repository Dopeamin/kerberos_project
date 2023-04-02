import { createContext, useCallback, useContext, useRef } from "react";
import { UserDataContext } from "./context";
import { getST, getTGT } from "@/utils/requests";
import { crypt, decrypt, generateUserSecretKey } from "@/utils/crypto";

export type AuthContextType = {
  askForTGT: (params: {
    lifetime?: string;
    serviceName?: string;
  }) => Promise<true | null>;
  askForST: (password: string) => Promise<true | null>;
};

const AuthContext = createContext<AuthContextType>({
  askForTGT: async () => null,
  askForST: async () => null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {
  const { userData } = useContext(UserDataContext);

  const dataRef = useRef({
    afterGettingTgt: {
      encForClient: "",
      enctgt: "",
    },
    tgsSessionKey: "",
    serviceSessionKey: "",
    serviceName: "",
    requestedLifetime: "",
    afterGettingST: {
      forClient: null,
      encServiceTicket: "",
    },
  });

  const askForTGT = useCallback(
    async ({
      serviceName = "chatgpt-server",
      lifetime = "day",
    }: {
      lifetime?: string;
      serviceName?: string;
    }) => {
      if (!userData.username) return null;
      //@ts-ignore
      dataRef.current.serviceName = serviceName;
      //@ts-ignore
      dataRef.current.requestedLifetime = lifetime;

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

      //   keeping encrypted results
      dataRef.current.afterGettingTgt.encForClient = encForClient;
      dataRef.current.afterGettingTgt.enctgt = enctgt;

      return true;
    },
    [userData]
  );

  const sendServiceTicket = useCallback(async () => {
    const data = dataRef.current;
    const serviceSessionKey = data.serviceSessionKey;
    if (!serviceSessionKey) return null;
    // preparing messages
    const userAuthenticator = {
      username: userData.username,
      timestamp: Date.now(),
    };
    const encServiceTicket = data.afterGettingST.encServiceTicket;

    // encrypting message
    const encUserAuthenticator = crypt(
      serviceSessionKey,
      JSON.stringify(userAuthenticator)
    );

    //@ts-ignore
    const url = data.afterGettingST.forClient?.serviceUrl;
    console.log("messages to send to service", {
      encUserAuthenticator,
      encServiceTicket,
    });
    console.log("service url", url);
  }, [userData]);

  const askForST = useCallback(
    async (password: string) => {
      const data = dataRef.current;
      console.log(data, password);

      // decrypting for client
      if (!userData.username) return null;
      const secretKey = generateUserSecretKey(password, userData.username);
      if (!data.afterGettingTgt.encForClient) return null;
      const forClientStr = decrypt(
        secretKey,
        data.afterGettingTgt.encForClient
      );
      if (!forClientStr) {
        console.log("failed to decrypt for user");
        return null;
      }
      const forClient = JSON.parse(forClientStr);
      console.log(forClient);

      //   saving tgsSessionKey
      const tgsSessionKey = forClient.tgsSessionKey;
      // @ts-ignore
      dataRef.current.tgsSessionKey = tgsSessionKey;

      //   preparing messages
      const fortgs = {
        serviceName: data.serviceName,
        lifetime: data.requestedLifetime,
      };
      const userAuthenticator = {
        username: userData.username,
        timestamp: Date.now(),
      };

      //encrypting messages
      const encUserAuthenticator = crypt(
        tgsSessionKey,
        JSON.stringify(userAuthenticator)
      );

      //sending messages
      const result = await getST({
        tgsUrl: forClient.tgsUrl,
        encUserAuthenticator,
        enctgt: data.afterGettingTgt.enctgt,
        fortgs,
      }).catch((err) => {
        console.log(err);
        return null;
      });

      if (!result) {
        console.log("failed to get ST");
        return null;
      }

      const encForClient = result.data.encForClient;
      const encServiceTicket = result.data.encServiceTicket;

      //decrypt for client
      try {
        const newForClientStr = decrypt(data.tgsSessionKey, encForClient);
        if (!newForClientStr) {
          console.log("Failed to decrypt new for client");
          return null;
        }
        const newForClient = JSON.parse(newForClientStr);
        console.log(newForClient);

        //   saving results
        dataRef.current.afterGettingST.forClient = newForClient;
        dataRef.current.afterGettingST.encServiceTicket = encServiceTicket;
        dataRef.current.serviceSessionKey = newForClient.serviceSessionKey;

        await sendServiceTicket();

        return true;
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    [userData, sendServiceTicket]
  );

  return (
    <AuthContext.Provider value={{ askForTGT, askForST }}>
      {children}
    </AuthContext.Provider>
  );
}
