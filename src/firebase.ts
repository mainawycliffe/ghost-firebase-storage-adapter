import BaseAdapter, { Image, ReadOptions } from 'ghost-storage-base';
import { Request, Response, NextFunction } from 'express';
import admin, { ServiceAccount } from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';
import { join } from 'path';

interface FirebaseStorageConfig {
  serviceAccount: string | ServiceAccount;
  bucketName: string;
  basePath: string;
}

export default class FirebaseStorageAdapter extends BaseAdapter {
  bucket: Bucket;

  constructor(config: FirebaseStorageConfig) {
    super();
    const app = admin.initializeApp({
      credential: admin.credential.cert(config.serviceAccount),
      storageBucket: `${config.bucketName}.appspot.com`,
    });
    this.bucket = app.storage().bucket();
  }

  exists(fileName: string, targetDir: string): Promise<boolean> {
    return this.bucket
      .file(join(targetDir, fileName))
      .exists()
      .then(function (data) {
        return data[0];
      })
      .catch((err) => Promise.reject(err));
  }

  save(image: Image, targetDir?: string | undefined): Promise<string> {
    const targetDirectory = targetDir ?? this.getTargetDir();
    const pathToSave = this.getUniqueFileName(image, targetDirectory);
    return this.bucket
      .upload(image.path, {
        configPath: '',
      })
      .then(() => pathToSave);
  }

  serve() {
    return function customServe(req: Request, res: Response, next: NextFunction) {
      next();
    };
  }

  delete(fileName: string, targetDir: string): Promise<boolean> {
    return this.bucket
      .file(join(targetDir, fileName))
      .exists()
      .then(() => true);
  }

  read(options?: ReadOptions): Promise<Buffer> {
    if (!options) {
      return new Promise((resolve, reject) => reject('Options can not be undefined'));
    }
    const rs = this.bucket.file(options.path).createReadStream();
    let contents: unknown = null;
    return new Promise(function (resolve, reject) {
      rs.on('error', function (err) {
        return reject(err);
      });
      rs.on('data', function (data) {
        if (contents) {
          contents = data;
        } else {
          contents = Buffer.concat([contents, data]);
        }
      });
      rs.on('end', function () {
        return resolve(contents as any);
      });
    });
  }
}
