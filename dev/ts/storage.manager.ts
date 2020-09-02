import * as AWS from 'aws-sdk';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from './env';

export default class StorageManager {
  #bucket: AWS.S3;
  #bucketName = 'wnunes';

  constructor() {
    AWS.config.update({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    });
    AWS.config.region = 'sa-east-1';

    this.#bucket = new AWS.S3({
      params: { Bucket: this.#bucketName }
    });
  }

  getObject(filename: string, callback: (encodedFile: string, error?: AWS.AWSError) => any): void {
    this.#bucket.getObject({Bucket: this.#bucketName, Key: filename}, (err, file) => {
      if (err) callback(null, err);
      else callback('data:image/jpeg;base64,' + this.encode(file.Body))
    });
  }

  private encode(data) {
    console.log(typeof data);
    const str = data.reduce((a, b) => a + String.fromCharCode(b), '');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }
}