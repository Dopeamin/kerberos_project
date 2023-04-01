import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import { AES, enc } from 'crypto-js';

@Injectable()
export class KeyGenService {
  algorithm = 'aes-256-cbc';
  initVector = randomBytes(16);
  hashSecret = 'test';

  generateUserSecretKey(password: string, username: string, version = '1') {
    const stringToHash = password + username + version;
    return createHash('sha256').update(stringToHash).digest('hex');
  }

  crypt(securityKey: string, message: string) {
    return AES.encrypt(message, securityKey).toString();
  }

  decrypt(securityKey: string, encryptedData: string) {
    return AES.decrypt(encryptedData, securityKey).toString(enc.Utf8);
  }
}
