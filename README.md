# Ghost CMS Firebase Storage Adapter

This a Firebase [Storage adapter](https://ghost.org/docs/concepts/storage-adapters/) for Ghost CMS. Images uploaded via Ghost CMS
will be save to Firebase Storage.

## Configure Adapter For your Firebase Project

To configure you project, the following fields can be passed along:

| Field          | Required | Desc                                                           |
| -------------- | -------- | -------------------------------------------------------------- |
| serviceAccount | true     | Path to your firebase account credentials                      |
| bucketName     | true     | The bucket to save ghost uploads to                            |
| basePath       | false    | the path to append to the filename of the ghost upload         |
| uploadOptions  | false    | set uploadOptions to be added to your file uploads to firebase |
| domain         | false    | the domain name to append to the destination path name         |

### Example

```json
"serviceAccount": "./path/to/service/account.json",
"bucketName": "bucket-name",
"basePath": "base path for saving uploads",
"uploadOptions": {
    "gzip": true,
    "metadata": {
        "cacheControl": "public, max-age=31536000"
    }
}
```

## Note

This is a very work in progress.
