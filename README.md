# Ghost Firebase Storage Adapter

[![npm](https://img.shields.io/npm/v/ghost-firebase-storage-adapter)](https://www.npmjs.com/package/ghost-firebase-storage-adapter)
[![](https://img.shields.io/github/release/mainawycliffe/ghost-firebase-storage-adapter.svg)](https://github.com/mainawycliffe/ghost-firebase-storage-adapter/releases/latest)
![Linting and Testing](https://github.com/mainawycliffe/ghost-firebase-storage-adapter/workflows/Linting%20and%20Testing/badge.svg)

This a Firebase [Storage adapter](https://ghost.org/docs/concepts/storage-adapters/) for Ghost CMS. Images uploaded via Ghost CMS
will be save to Firebase Storage.

## Prerequisite

- Have a [Firebase Project](https://firebase.google.com/docs) with [Firebase Storage](https://firebase.google.com/docs/storage) enabled.
- Generate Private key for your Firebase Service Account - [Instructions](https://firebase.google.com/docs/admin/setup#initialize-sdk)

## Setup

### Installation

At the root of you ghost blog, install this adapter using either `npm` or
`yarn`.

#### NPM

```sh
npm i ghost-firebase-storage-adapter
```

#### Yarn

```sh
yarn add ghost-firebase-storage-adapter
```

### Create Firebase Storage Module

After installation, a scripts runs that automatically creates a storage adapter
in the `content/adapters/storage` directory, named `firebase.js` with the
following content:

```javascript
'use strict'

module.exports = require('ghost-firebase-storage-adapter');
```

> **NB:** if the `firebase.js` was not created, create it in the `content/adapters/storage` directory and add the above content.

## Configurations

> Before we can proceed, make sure you have the bucket-name, without any prefix
> (`gs://`) or suffix (`.appspot.com`) and your Firebase Service Account Private
> Key, a `json` file.

- Add the json file containing the private key to the root of you ghost
  directory or somewhere else more secure.
- Add a `storage` block to your `config.${GHOST_ENVIRONMENT}.json` as shown below:

```json
"storage": {
    "active": "firebase",
    "firebase": {
        // configurations for the storage adapter
        "serviceAccount": "./path/to/service/account.json",
        "bucketName": "bucket-name",
        "basePath": "base path for saving uploads",
        "uploadOptions": {
            "gzip": true,
            "metadata": {
                "cacheControl": "public, max-age=31536000"
            }
        }
    }
}
```

For more information, see the example config [here](example/config.development.json).

### Config notes

- `serviceAccount` (`required`) - Path to your firebase service account
  credential file, you can provide a relative or absolute path to the credential file.
- `bucketName` (`required`) - The bucket to save ghost uploads to
- `basePath` - the base directory to upload file to inside your Firebase storage
  bucket.
- `uploadOptions` - Configuration options for bucket file upload as indicated
  [here](https://googleapis.dev/nodejs/storage/latest/global.html#UploadOptions).
  All fields can be appended except the destination:

  **Example**

  ```json
  {
      "metadata": {
          "cacheControl": "public, max-age=30000",
      },
      "public": "true",
      "gzip": true
  }
  ```

- `domain` - Custom domain name to append to the file destination. Use this
  option if you are using a Firebase Cloud Functions to serve images.

## Verify new Storage Adapter

To verify everything is configured correctly, stop your ghost server and run it
again.

```sh
ghost stop
ghost run
```

Fix any errors that come up and try again. After that, try and uploading a file
and it should be accessible on your Firebase storage bucket.

## Contributions

Contributions of any kind - bug reports, pull request, feature suggestions are
welcome.
