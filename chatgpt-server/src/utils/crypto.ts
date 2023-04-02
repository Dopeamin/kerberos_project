import { AES, enc } from 'crypto-js';

export function crypt(securityKey: string, message: string) {
  return AES.encrypt(message, securityKey).toString();
}

export function decrypt(securityKey: string, encryptedData: string) {
  return AES.decrypt(encryptedData, securityKey).toString(enc.Utf8);
}
