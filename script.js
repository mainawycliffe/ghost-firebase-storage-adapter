const { exec } = require('child_process');
const fs = require('fs');

if (fs.existsSync('./.no-postinstall')) {
  console.log('Post install script was not run');
  process.exit(0);
}

console.info('Attempting to configure firebase storage adapter\n\n');
const postInstall = exec('node ./lib/postinstall.js', function (error, stdout, stderr) {
  if (error) {
    console.error(error.stack);
  }
});

postInstall.on('exit', () => {
  if (postInstall.exitCode === 0) {
    console.info('You project was configured successfully');
  }
});
