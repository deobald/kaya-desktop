export interface IElectronAPI {
  onSetApiKey: (callback:any) => void,
  startSyncthing: (msg:any) => void,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
