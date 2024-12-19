# READ ME

## todo

* [-] if syncthing isn't running, try to start it
    * [x] attempt to start
    * [ ] check if it's running again
    * [ ] check service on a loop - use `child-process-gone`?
* [ ] if syncthing is running, steal the API key, yo
    * [x] from `SYNCTHING_API_KEY`
    * [ ] from Syncthing itself (via Electron)
* [ ] auto-create `~/.kaya`
    * [ ] back up existing to `~/.kaya.bak`? or just leave it?
* [-] show nearby devices
    * [x] as text
    * [ ] as emoji
* [ ] add device
    * [ ] add folder
