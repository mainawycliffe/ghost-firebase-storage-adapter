import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';

const adapterDir = 'content/adapters/storage';

(function setupStorageAdapter(adapterDir: string) {
  try {
    // create storage adapter inside the storage adapter directory
    if (existsSync(join(adapterDir, 'firebase.js'))) {
      console.warn('A firebase.js exists in the storage adapter directory. Please setup manually!');
      return;
    }
    if (!existsSync(join(__dirname, adapterDir))) {
      mkdirSync(adapterDir, { recursive: true });
    }
    const content = `'use strict'\n\nmodule.exports = require('ghost-firebase-storage-adapter');\n\n`;
    appendFileSync(join(adapterDir, 'firebase.js'), content);
    // add configs to the dev settings
  } catch (error) {
    console.error(error);
  }
})(adapterDir);
