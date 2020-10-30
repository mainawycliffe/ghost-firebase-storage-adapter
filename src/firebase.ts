import BaseAdapter, { Image, ReadOptions } from 'ghost-storage-base';
import { Request, Response, NextFunction } from 'express';
import admin, { app, ServiceAccount } from 'firebase-admin';

interface FirebaseStorageConfig {
  serviceAccount: string | ServiceAccount;
  bucketName: string;
  basePath: string;
}

export default class FirebaseStorageAdapter extends BaseAdapter {
  firebaseApp: app.App;

  constructor(config: FirebaseStorageConfig) {
    console.log({ config });
    super();
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(config.serviceAccount),
      storageBucket: `${config.bucketName}.appspot.com`,
    });
  }

  exists(fileName: string, targetDir?: string): Promise<boolean> {
    console.log({ fileName, targetDir });
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  save(image: Image, targetDir?: string | undefined): Promise<string> {
    console.log({ image, targetDir });
    const targetDirectory = targetDir ?? this.getTargetDir();
    const pathToSave = this.getUniqueFileName(image, targetDirectory);
    return this.firebaseApp
      .storage()
      .bucket()
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

  delete(fileName: string, targetDir?: string): Promise<boolean> {
    console.log({ fileName, targetDir });
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  read(options?: ReadOptions): Promise<Buffer> {
    console.log({ options });
    return new Promise((resolve) => {
      resolve(new Buffer(''));
    });
  }
}
