# Ghost Firebase Storage Adapter

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
```

### Configure Adapter For your Firebase Project

To configure you project, the following fields can be passed along:

| Field          | Required | c                                                              |
| -------------- | -------- | -------------------------------------------------------------- |
| serviceAccount | true     | Path to your firebase account credentials json file            |
| bucketName     | true     | The bucket to save ghost uploads to                            |
| basePath       | false    | the path to append to the filename of the ghost upload         |
| uploadOptions  | false    | set uploadOptions to be added to your file uploads to firebase |
| domain         | false    | the domain name to append to the destination path name         |

