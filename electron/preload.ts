// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

console.log("exposing onSetApiKey");
contextBridge.exposeInMainWorld('electronAPI', {
  onSetApiKey: (callback:any) => ipcRenderer.on('set-api-key', (_event, value) => callback(value))
})
