import BaseAdapter, { Image, ReadOptions } from 'ghost-storage-base';
import { Request, Response, NextFunction } from 'express';
import admin, { ServiceAccount } from 'firebase-admin';
import { Bucket, UploadOptions } from '@google-cloud/storage';
import { join, posix, sep } from 'path';

interface FirebaseStorageConfig {
  serviceAccount: string | ServiceAccount;
  bucketName: string;
  basePath: string;
  uploadOptions?: UploadOptions;
}

export default class FirebaseStorageAdapter extends BaseAdapter {
  bucket: Bucket;
  uploadOptions?: UploadOptions;

  constructor(config: FirebaseStorageConfig) {
    super();
    const app = admin.initializeApp({
      credential: admin.credential.cert(config.serviceAccount),
      storageBucket: `${config.bucketName}.appspot.com`,
    });
    this.bucket = app.storage().bucket();
    this.uploadOptions = config.uploadOptions;
  }

  async exists(fileName: string, _targetDir: string): Promise<boolean> {
    const targetDirectory = this.getTargetDir(this.basePath);
    const filesExists = await this.bucket.file(join(targetDirectory, fileName)).exists();
    return filesExists[0];
  }

  async save(image: Image, targetDir?: string | undefined): Promise<string> {
    const targetDirectory = targetDir ?? this.getTargetDir();
    const pathToSave = await this.getUniqueFileName(image, targetDirectory);
    return this.bucket
      .upload(image.path, {
        ...(this.uploadOptions ? { ...this.uploadOptions } : {}),
        destination: pathToSave.split(sep).join(posix.sep),
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
