# READ ME

## todo

* [ ] cleanup
    * [ ] disabling webSecurity is probably bad ... proxy instead
    * [ ] to frontend without sticking it in the UI
* [-] syncthing serve
    * [x] attempt to start
    * [ ] check if it's running again
    * [ ] check service on a loop - use `child-process-gone`?
* [x] api key
    * [x] from `SYNCTHING_API_KEY`
    * [x] from Syncthing itself (via Electron)
* [-] nearby devices
    * [x] as text, with button
    * [ ] as emoji
    * [ ] announce new device discovered (polling or events)
* [ ] add device
    * [x] click device to add
    * [ ] show existing paired devices
    * [ ] alert when `DeviceConnected` and offer to pair back
    * [ ] click emoji to add
* [ ] folder
    * [ ] auto-create `~/.kaya`
    * [ ] back up existing to `~/.kaya.bak`? or just leave it?
* [ ] sync
    * [ ] add folder to config - on device add?

