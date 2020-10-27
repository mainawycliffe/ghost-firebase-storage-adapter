import BaseAdapter, { Image, ReadOptions } from 'ghost-storage-base';
import { Request, Response, NextFunction } from 'express';

export class FirebaseStorageAdapter extends BaseAdapter {
  constructor() {
    super();
  }

  exists(fileName: string, targetDir?: string | undefined): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  save(image: Image, targetDir?: string | undefined): Promise<string> {
    return new Promise((resolve) => {
      resolve('');
    });
  }

  serve() {
    return function customServe(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      next();
    };
  }

  delete(fileName: string, targetDir?: string | undefined): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  read(options?: ReadOptions | undefined): Promise<Buffer> {
    return new Promise((resolve) => {
      resolve(new Buffer(''));
    });
  }
}
