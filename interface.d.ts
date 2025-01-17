export interface IElectronAPI {
  onSetHomeDir: (callback:any) => void,
  onSetApiKey: (callback:any) => void,
  startSyncthing: (msg:any) => void,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
