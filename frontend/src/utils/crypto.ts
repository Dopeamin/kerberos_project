import { createHash } from "crypto";
import { AES, enc } from "crypto-js";

export function generateUserSecretKey(
  password: string,
  username: string,
  version = "1"
) {
  const stringToHash = password + username + version;
  return createHash("sha256").update(stringToHash).digest("hex");
}

export function crypt(securityKey: string, message: string) {
  return AES.encrypt(message, securityKey).toString();
}

export function decrypt(securityKey: string, encryptedData: string) {
  return AES.decrypt(encryptedData, securityKey)?.toString(enc.Utf8);
}
