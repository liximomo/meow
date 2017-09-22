const electron = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron')
const { spawn } = require('child_process');

let runningChildProcess = {};

ipcMain.on('running-process', (event, pid) => {
  runningChildProcess[pid] = true;
});

ipcMain.on('stop-process', (event, pid) => {
  delete runningChildProcess[pid];
});

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: app.getName(),
    width: 1000,
    height: 640,
    minWidth: 1000,
    minHeight: 640,
    fullscreen: false,
    // titleBarStyle: 'hidden',
    frame: false,
    show: false,
    webPreferences: { experimentalFeatures: true },
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, 'build/index.html'),
      protocol: 'file:',
      slashes: true,
    });

  // and load the index.html of the app.
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {

    // clear running child process
    const runningPids = Object.keys(runningChildProcess);
    spawn('kill', ['-TERM'].concat(runningPids));

    // 清空存储的进程id
    runningChildProcess = {};
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// app.on('will-quit', function(event) {
//   event.preventDefault();
// });