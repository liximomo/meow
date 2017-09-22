const { spawn } = require('child_process');

function startElectron() {
  const electron = spawn('npm', ['run', 'app']);
  
  electron.stdout.on('data', (data) => {
    console.log(`electron: ${data}`);
  });
  
  electron.stderr.on('data', (data) => {
    console.log(`electron: ${data}`);
  });
  
  electron.on('close', (code) => {
    console.log(`electron process exited with code ${code}`);
  });
}


module.exports = startElectron;