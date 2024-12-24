import { app, BaseWindow, BrowserWindow, IncomingMessage, Menu, MenuItem, Tray, nativeImage, ipcMain } from 'electron';
import path from 'path';
import started from 'electron-squirrel-startup';
import appIcon from './assets/fire_32px.png';

// const electron = require('electron');
// const net = electron.net;
const spawn = require("child_process").spawn;
const fs = require('fs');
import { XMLParser } from 'fast-xml-parser';

// HACK: find the tray with some sort of channeling or singaling instead
let tray:Tray = null;
let window:BrowserWindow = null;
let apiKey:string = null;

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
      webSecurity: false, // Disable CORS security (TODO: probably solve this with a proxy or something nicer?)
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.webContents.openDevTools();

  mainWindow.on('show', onWindowShow);
  mainWindow.on('hide', onWindowHide);

  // 'did-finish-load' is the only trustworthy event we can use to identify 
  // when the render process is ready to receive IPC messages:
  mainWindow.webContents.on('did-finish-load', () => {
    console.log("### Main Window finished loading. Setting API key...");
    mainWindow.webContents.send('set-api-key', apiKey);
  });

  ipcMain.on('start-syncthing', (event, msg) => {
    console.log("### Main received call to startSyncthing()");
    startSyncthing();
  });

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

app.on('child-process-gone', (event, details) => {
  console.log("#### child process gone:");
  console.log(details.serviceName);
  console.log("####");
});

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

const getConfigXml = (path:string): string => {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path);
  }
  return null;
};

const startSyncthing = (): void => {
  spawn("syncthing", ["serve", "--no-browser"]);
}

const getApiKey = (): string => {
  const winPath = path.join(process.env.LOCALAPPDATA || "", "Syncthing", "config.xml");
  const macPath = path.join(process.env.HOME || "", "Library/Application Support/Syncthing/config.xml");
  const xdgPath = path.join(process.env.XDG_STATE_HOME || "", "syncthing/config.xml");
  const locPath = path.join(process.env.HOME || "", ".local/state/syncthing/config.xml");
  let xml = null;
  for (var p of [winPath, macPath, xdgPath, locPath]) {
    console.log(`Trying config.xml from ${p}...`);
    xml = getConfigXml(p);
    if (xml != null) {
      console.log("Success!");
      break;
    }
    console.log("...no luck.");
  }  

  if (xml != null) {
    const parser = new XMLParser();
    const json = parser.parse(xml);
    return json.configuration.gui.apikey;
  } else if(process.env.SYNCTHING_API_KEY != null) {
    console.log("No API key found in config.xml -- falling back to SYNCTHING_API_KEY...");
    return process.env.SYNCTHING_API_KEY;
  } else {
    console.error("API not found in config.xml or SYNCTHING_API_KEY env var! Exiting.");
    process.exit(1);
  }
};

app.whenReady().then(() => {
  console.log("setting tray icon...");
  tray = new Tray(nativeImage.createFromDataURL(appIcon));
  tray.setToolTip('Kaya');

  if (findWindow().isVisible()) {
    onWindowShow();
  } else {
    onWindowHide();
  }

  console.log("Finding API key from configuration...");
  apiKey = getApiKey();
  console.log("API Key:");
  console.log(apiKey);
  console.log("send: set-api-key");
  findWindow().webContents.send('set-api-key', apiKey);
});

