const childProcess = require('child_process');
const fs = require('fs');

if (!fs.existsSync('./no-postinstall')) {
  childProcess.execSync('node ./lib/postinstall.js');
}
