import { createContext, useCallback, useContext, useRef } from "react";
import { UserDataContext } from "./context";
import { getST, getTGT, sendST } from "@/utils/requests";
import { crypt, decrypt, generateUserSecretKey } from "@/utils/crypto";
import Lifetime from "@/enums/Lifetime";

export type AuthContextType = {
  askForTGT: (params: {
    lifetime?: Lifetime;
    serviceName?: string;
  }) => Promise<true | null>;
  askForST: (password: string) => Promise<{
    encServiceTicket: any;
    serviceSessionKey: string;
  } | null>;
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
    encServiceTicket: "",
    serviceUrl: "",
  });

  const askForTGT = useCallback(
    async ({
      serviceName = "chatgpt-server",
      lifetime = Lifetime.DAY,
    }: {
      lifetime?: Lifetime;
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

    const result = await sendST({
      serviceUrl: url,
      encUserAuthenticator,
      encServiceTicket,
    }).catch((err) => {
      console.log(err);
      return null;
    });
    if (!result) return null;

    //getting service authenticator and decrypting it
    const encServiceAuthenticator = result.data.encServiceAuthenticator;
    const serviceAuthenticatorStr = decrypt(
      serviceSessionKey,
      encServiceAuthenticator
    );
    if (!serviceAuthenticatorStr) {
      console.log("Could not decrypt service authenticator");
      return null;
    }
    const serviceAuthenticator = JSON.parse(serviceAuthenticatorStr);
    console.log("service authenticator", serviceAuthenticator);

    //check if the service name is the same
    if (serviceAuthenticator.serviceName !== data.serviceName) {
      console.log("Failed: accessing a different service");
      return null;
    }

    //saving ticket
    data.encServiceTicket = encServiceTicket;

    return true;
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
        dataRef.current.serviceUrl = newForClient.serviceUrl;

        console.log("data here", dataRef.current);

        const success = await sendServiceTicket();
        if (!success) return null;

        return { encServiceTicket, serviceSessionKey: data.serviceSessionKey };
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
