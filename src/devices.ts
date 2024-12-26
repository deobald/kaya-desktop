
const logos = [
  'fa-jedi-order', 'fa-galactic-senate', 'fa-galactic-republic', 'fa-fulcrum', 'fa-first-order',
  'fa-connectdevelop', 'fa-canadian-maple-leaf', 'fa-diaspora'
]

// const createDevice = (deviceId:string, name:string): {} => {
export const createStDevice = (deviceID:string): {} => {
  const allowedNetworks: string[] = [];
  const ignoredFolders: string[] = [];
  return { 
    "deviceID": deviceID,
    // "name": name, // we intentionally do not pass name so Syncthing uses device names correctly
                     // see: https://forum.syncthing.net/t/rest-api-get-device-name-for-devices-connected-via-api/23480/2?u=deobald
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

export const createDeviceLogo = (deviceID:string): {} => {
  const index = Math.abs(sdbm(deviceID)) % logos.length;
  return logos[index];
}

const sdbm = (str:string) => {
  let arr = str.split('');
  return arr.reduce(
    (hashCode:number, currentVal:string) =>
      (hashCode =
        currentVal.charCodeAt(0) +
        (hashCode << 6) +
        (hashCode << 16) -
        hashCode),
    0
  );
};