import FirebaseStorageAdapter from './firebase';
import { UploadOptions } from '@google-cloud/storage';

jest.mock('firebase-admin', () => {
  return {
    initializeApp: jest.fn(() => {
      return {
        storage: jest.fn(() => {
          return {
            bucket: jest.fn(() => {
              return {
                file: jest.fn((file: string) => {
                  return {
                    exists: jest.fn(() => {
                      if (file.includes('fileExists')) {
                        return [true];
                      }
                      return [false];
                    }),
                    delete: jest.fn(() => {
                      if (file.includes('fileExist')) {
                        return [
                          {
                            statusCode: 200,
                          },
                        ];
                      }
                      return [
                        {
                          statusCode: 400,
                        },
                      ];
                    }),
                  };
                }),
              };
            }),
          };
        }),
      };
    }),
    credential: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      cert: jest.fn(() => {}),
    },
  };
});

const uploadOptions: UploadOptions = {
  gzip: true,
};
const configs = {
  bucketName: 'bucket-name',
  serviceAccount: '',
  domainName: 'example.com',
  uploadOptions: uploadOptions,
};
describe('Storage Adapter', () => {
  const storageAdapter = new FirebaseStorageAdapter(configs);

  it('Initialize constructor', () => {
    const storageAdapter = new FirebaseStorageAdapter(configs);
    expect(storageAdapter.basePath).toBeFalsy();
    expect(storageAdapter.domainName).toBe('example.com');
    expect(storageAdapter.uploadOptions).toBeTruthy();
    expect(storageAdapter.uploadOptions).toEqual(uploadOptions);
  });

  it("File Doesn't exists", async () => {
    const fileExists = await storageAdapter.exists('fileNotExists');
    console.log(fileExists);
    expect(fileExists).toBe(false);
  });

  it('File exists', async () => {
    const fileExists = await storageAdapter.exists('fileExists');
    expect(fileExists).toBe(true);
  });

  it('Should delete file', async () => {
    const deleteFile = await storageAdapter.delete('fileExists');
    expect(deleteFile).toBe(true);
  });
});
