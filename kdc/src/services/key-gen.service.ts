import { Injectable } from '@nestjs/common';
import {
  randomBytes,
  createHash,
  createCipheriv,
  createDecipheriv,
} from 'crypto';

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
    const cipher = createCipheriv(this.algorithm, securityKey, this.initVector);
    let encryptedData = cipher.update(message, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
  }

  decrypt(securityKey: string, encryptedData: string) {
    const decipher = createDecipheriv(
      this.algorithm,
      securityKey,
      this.initVector,
    );
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  }
}
