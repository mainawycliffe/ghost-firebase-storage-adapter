import BaseAdapter, { Image, ReadOptions } from 'ghost-storage-base';
import { Request, Response, NextFunction } from 'express';
import admin, { ServiceAccount } from 'firebase-admin';
import { Bucket, UploadOptions } from '@google-cloud/storage';
import { join, posix, sep } from 'path';

interface FirebaseStorageConfig {
  serviceAccount: string | ServiceAccount;
  bucketName: string;
  basePath?: string;
  uploadOptions?: UploadOptions;
  domainName?: string;
}

export default class FirebaseStorageAdapter extends BaseAdapter {
  bucket: Bucket;
  uploadOptions?: UploadOptions;
  basePath: string;
  domainName?: string;

  constructor(config: FirebaseStorageConfig) {
    super();
    const app = admin.initializeApp({
      credential: admin.credential.cert(config.serviceAccount),
      storageBucket: `${config.bucketName}.appspot.com`,
    });
    this.bucket = app.storage().bucket();
    this.uploadOptions = config.uploadOptions;
    this.basePath = config.basePath ?? '';
    this.domainName = config.domainName;
  }

  async exists(fileName: string, _targetDir: string): Promise<boolean> {
    const targetDirectory = this.getTargetDir(this.basePath);
    const filesExists = await this.bucket.file(join(targetDirectory, fileName)).exists();
    return filesExists[0];
  }

  async save(image: Image): Promise<string> {
    const targetDirectory = this.getTargetDir(this.basePath);
    // the typings are wrong here, getUniqueFileName returns a promise of a string
    const pathToSave = await this.getUniqueFileName(image, targetDirectory);
    const defaultUploadOptions = {
      metadata: {
        cacheControl: `public, max-age=${30000}`,
      },
      public: true,
    };
    const uploadOptions = {
      ...(this.uploadOptions ? this.uploadOptions : defaultUploadOptions),
      destination: pathToSave.split(sep).join(posix.sep),
    };
    const data = await this.bucket.upload(image.path, uploadOptions);
    if (this.domainName) {
      const domainName = new URL(this.domainName);
      const downloadPath = new URL(data[1].name, domainName).toString();
      return downloadPath;
    }
    const link = data[1].mediaLink;
    return link;
  }

  serve() {
    return function customServe(req: Request, res: Response, next: NextFunction) {
      next();
    };
  }

  async delete(fileName: string): Promise<boolean> {
    const targetDirectory = this.getTargetDir(this.basePath);
    const results = await this.bucket.file(join(targetDirectory, fileName)).delete();
    if (results[0].statusCode === 200) {
      return true;
    }
    return false;
  }

  read(options?: ReadOptions): Promise<Buffer> {
    if (!options) {
      return new Promise((resolve, reject) => reject('Options can not be undefined'));
    }
    const filePath = this.getTargetDir(this.basePath);
    const rs = this.bucket.file(filePath).createReadStream();
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
