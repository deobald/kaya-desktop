# READ ME

## todo

* [ ] cleanup
    * [ ] disabling webSecurity is probably bad ... proxy instead
    * [ ] api key to frontend without sticking it in the UI
    * [-] fix memory leak in SyncthingServiceTimer @ `fetch('.../health');`
                          and DeviceTimer @ `fetch'...?events=DeviceDiscovered');`
    * [ ] device = tux/win/mac + name + emoji
* [x] syncthing serve
    * [x] attempt to start
    * [x] check if it's running again
    * [x] check service on a loop - use `child-process-gone`?
    * [x] as icon
* [x] api key
    * [x] from `SYNCTHING_API_KEY`
    * [x] from Syncthing itself (via Electron)
* [-] nearby devices
    * [x] as text, with button
    * [x] self as emoji
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

## Bugs

Complete failure (app is just white after leaving it running for a while):

```
...
[272225:1226/163112.895691:ERROR:cmd_buffer_helper.cc(141)] ContextResult::kFatalFailure: CommandBufferHelper::AllocateRingBuffer() failed
[272225:1226/163112.906880:ERROR:cmd_buffer_helper.cc(141)] ContextResult::kFatalFailure: CommandBufferHelper::AllocateRingBuffer() failed
[272225:1226/163112.917767:ERROR:cmd_buffer_helper.cc(141)] ContextResult::kFatalFailure: CommandBufferHelper::AllocateRingBuffer() failed
[272225:1226/163112.928896:ERROR:cmd_buffer_helper.cc(141)] ContextResult::kFatalFailure: CommandBufferHelper::AllocateRingBuffer() failed
[272225:1226/163112.940118:ERROR:cmd_buffer_helper.cc(141)] ContextResult::kFatalFailure: CommandBufferHelper::AllocateRingBuffer() failed
[272225:1226/163112.951413:ERROR:cmd_buffer_helper.cc(141)] ContextResult::kFatalFailure: CommandBufferHelper::AllocateRingBuffer() failed
[272225:1226/163112.962787:ERROR:cmd_buffer_helper.cc(141)] ContextResult::kFatalFailure: CommandBufferHelper::AllocateRingBuffer() failed
[272225:1226/163112.981398:ERROR:shared_image_interface_proxy.cc(178)] CreateSharedImage: Could not get SHM for data upload.
```