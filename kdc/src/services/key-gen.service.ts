import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class KeyGenService {
  algorithm = 'aes-256-cbc';
  initVector = crypto.randomBytes(16);
  public generateUserSecretKey() {
    
  }

  crypt(securityKey: string, message: string) {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      securityKey,
      this.initVector,
    );
    let encryptedData = cipher.update(message, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
  }

  decrypt(securityKey: string, encryptedData: string) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      securityKey,
      this.initVector,
    );
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  }
}
