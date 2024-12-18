
// const createDevice = (deviceId:string, name:string): {} => {
export function createDevice(deviceID:string, name:string) {
  const allowedNetworks: string[] = [];
  const ignoredFolders: string[] = [];
  return { 
    "deviceID": deviceID,
    // "name": name,
    "addresses": [ "dynamic" ], 
    "compression": "metadata", 
    "certName": "", 
    "introducer": false, 
    "skipIntroductionRemovals": false, 
    "introducedBy": "", 
    "paused": false, 
    "allowedNetworks": allowedNetworks,
    "autoAcceptFolders": false, 
    "maxSendKbps": 0, 
    "maxRecvKbps": 0, 
    "ignoredFolders": ignoredFolders, 
    "maxRequestKiB": 0, 
    "untrusted": false, 
    "remoteGUIPort": 0, 
    "numConnections": 0 };
}

