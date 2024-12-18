import { app, BaseWindow, BrowserWindow, IncomingMessage, Menu, MenuItem, Tray, ipcMain } from 'electron';
import path from 'path';
import started from 'electron-squirrel-startup';

const electron = require('electron');
const net = electron.net;
const spawn = require("child_process").spawn;

// HACK: find the tray with some sort of channeling or singaling instead
let tray:Tray = null;
let window:BrowserWindow = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Disable CORS security (TODO: probably solve this with a proxy or something nicer?)
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('show', onWindowShow);
  mainWindow.on('hide', onWindowHide);

  window = mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


// HACK: Nasty way of finding our window; Signal's SettingsChannel method is preferable
//       We can't use 'window' because it becomes null when hidden.
const findWindow = (): BrowserWindow => {
  if (BrowserWindow.getAllWindows().length != 1) {
    throw RangeError("Too many windows.");
  }
  console.log("finding window 0...");
  return BrowserWindow.getAllWindows()[0];
};

const onWindowShow = (): void => {
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Hide', type: 'normal', click: onClickHide },
    { label: 'Quit', type: 'normal', click: onClickQuit }
  ]);
  tray.setContextMenu(contextMenu);
};

const onWindowHide = (): void => {
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', type: 'normal', click: onClickShow },
    { label: 'Quit', type: 'normal', click: onClickQuit }
  ]);
  tray.setContextMenu(contextMenu);
};

const checkHealth = (): void => {
  const request = net.request({
    method: 'GET',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: 8384,
    path: '/rest/noauth/health'
  });
  request.on('response', (response:IncomingMessage) => {
    console.log(`STATUS: ${response.statusCode}`);
  })
  request.on('error', (error:Error) => {
    console.log("Syncthing not running...trying to start Syncthing...");
    spawn("syncthing", ["serve"]);
  })
  request.setHeader('Content-Type', 'application/json');
  request.end();
};

const checkNeighbours = (): void => {
  const request = net.request({
    method: 'GET',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: 8384,
    path: '/rest/system/discovery'
  });
  request.on('response', (response:IncomingMessage) => {
    console.log(`STATUS: ${response.statusCode}`);
    response.on('data', (chunk) => { console.log(chunk.toString()); });
  });
  request.setHeader('Content-Type', 'application/json');
  request.setHeader('Authorization', `Bearer ${process.env.SYNCTHING_API_KEY}`);
  request.end();
};

const onClickQuit = (menuItem:MenuItem, window:BaseWindow, e:KeyboardEvent): void => {
  app.quit();
};

const onClickShow = (menuItem:MenuItem, window:BaseWindow, e:KeyboardEvent): void => {
  findWindow().show();
  // Send the API KEY
  console.log(`send: set-api-key to ${process.env.SYNCTHING_API_KEY}`);
  findWindow().webContents.send('set-api-key', process.env.SYNCTHING_API_KEY);
};

const onClickHide = (menuItem:MenuItem, window:BaseWindow, e:KeyboardEvent): void => {
  findWindow().hide();
};

app.whenReady().then(() => {
  console.log("setting tray icon");
  tray = new Tray('/home/steven/work/deobald/kaya-desktop/fire.png');
  tray.setToolTip('Kaya');

  if (findWindow().isVisible()) {
    onWindowShow();
  } else {
    onWindowHide();
  }

  console.log("Checking health...");
  checkHealth();
  
  // checkNeighbours();

  // Send the API KEY
  console.log("send: set-api-key");
  findWindow().webContents.send('set-api-key', process.env.SYNCTHING_API_KEY);
});
