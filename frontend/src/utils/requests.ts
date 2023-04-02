import axios from "axios";

const AuthenticationServerUrl = "http://localhost:3000";

export const signup = async (username: string, password: string) => {
  return axios.post(AuthenticationServerUrl + "/signup", {
    username,
    password,
  });
};

export const getTGT = async ({
  username,
  serviceName = "chatgpt-server",
  lifetime = "day",
}: {
  username: string;
  serviceName: string;
  lifetime: string;
}) => {
  return axios.post(AuthenticationServerUrl + "/ticket-granting-ticket", {
    username,
    serviceName,
    lifetime,
  });
};

export const getST = async ({
  tgsUrl,
  encUserAuthenticator,
  fortgs,
  enctgt,
}: {
  tgsUrl: string;
  encUserAuthenticator: string;
  fortgs: any;
  enctgt: string;
}) => {
  return axios.post(tgsUrl, {
    fortgs,
    enctgt,
    encUserAuthenticator,
  });
};

export const checkUser = async ({ username }: { username: string }) => {
  return await axios.post(AuthenticationServerUrl + "/user", { username });
};
