// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

console.log("Exposing Main <=> Renderer IPC (onSetApiKey, startSyncthing)");
contextBridge.exposeInMainWorld('electronAPI', {
  onSetHomeDir: (callback:any) => ipcRenderer.on('set-home-dir', (_event, value) => callback(value)),
  onSetApiKey: (callback:any) => ipcRenderer.on('set-api-key', (_event, value) => callback(value)),
  startSyncthing: (msg:any) => ipcRenderer.send('start-syncthing', msg)
})
