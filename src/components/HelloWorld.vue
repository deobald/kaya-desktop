<script setup lang="ts">
defineProps<{
  msg: string
}>()

import { ref } from 'vue';
import { createDevice } from '../devices';

const neighbours = ref(null);
const lastPair = ref(null);
const devices = ref(null);
const events = ref(null);

const checkNeighbours2 = (): void => {
  // const path = '/rest/system/connections'; // connected devices and this device (as not connected), but only when there is another device connected...?
  const path = '/rest/system/discovery'; // contains "nearby devices"! <3
  // const path = '/rest/cluster/pending/devices'; // does not contain "nearby devices" :(
  const headers = {
    'Authorization': 'Bearer kVbbrXED7cWkhv7kt9UwoqpsdpkGpb9e', // ${process.env.SYNCTHING_API_KEY} ... only works in Electron
    'Content-Type': 'application/json'
  };
  fetch(`http://localhost:8384${path}`, { headers })
    .then(response => response.json())
    .then(data => neighbours.value = Object.keys(data));
};

const checkDevices = (): void => {
  const path = '/rest/config/devices';
  const headers = {
    'Authorization': 'Bearer kVbbrXED7cWkhv7kt9UwoqpsdpkGpb9e',
    'Content-Type': 'application/json'
  };
  fetch(`http://localhost:8384${path}`, { headers })
    .then(response => response.json())
    .then(data => devices.value = data);
};

const checkEvents = (): void => {
  const path = '/rest/events?events=DeviceConnected,DeviceDiscovered';
  const headers = {
    'Authorization': 'Bearer kVbbrXED7cWkhv7kt9UwoqpsdpkGpb9e',
    'Content-Type': 'application/json'
  };
  fetch(`http://localhost:8384${path}`, { headers })
    .then(response => response.json())
    .then(data => devices.value = data);
};

const pairWith = (deviceID:string): void => {
  const newDevice = createDevice(deviceID, "ziggo");

  const path = `/rest/config/devices`; // /${deviceID}
  const headers = {
    'Authorization': 'Bearer kVbbrXED7cWkhv7kt9UwoqpsdpkGpb9e',
    'Content-Type': 'application/json'
  };
  fetch(`http://localhost:8384${path}`, { 
    method: 'POST',
    headers: headers,
    body: JSON.stringify(newDevice)
  })
    // .then(response => {
    //   console.log(`response: ${response.body}`);
    //   response.json()})
    .then(data => lastPair.value = deviceID);
};

const createFolder = (): void => {
  const path = '/rest/config/folders';
  const headers = {
    'Authorization': 'Bearer kVbbrXED7cWkhv7kt9UwoqpsdpkGpb9e', // ${process.env.SYNCTHING_API_KEY} ... only works in Electron
    'Content-Type': 'application/json'
  };
  // fetch(`http://localhost:8384${path}`, { 
  //   method: 'POST',
  //   headers: {
  //       'Authorization': 'Bearer ' + this.token,
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json;charset=utf-8'
  //   },
  //   body: JSON.stringify( this.form )
  //  })
  //   .then(response => response.json())
  //   .then(data => neighbours.value = data);
}

</script>

<template>
  <div class="greetings">
    <button @click="createFolder()">Create Folder</button>
    <button @click="checkNeighbours2()">Check Neighbours</button>
    <button @click="checkDevices()">Check Devices</button>
    <button @click="checkEvents()">Check Events</button>
    <div v-for="neighbour in neighbours">
      <button @click="pairWith(neighbour)">{{ neighbour }}</button>
    </div>
    <label>Neighbours:</label>
    <p>{{ neighbours }}</p>
    <label>Last Device Paired:</label>
    <p>{{ lastPair }}</p>
    <label>Devices:</label>
    <p>{{ devices }}</p>
    <label>Events:</label>
    <p>{{ events }}</p>

    <!-- <h1 class="green">{{ msg }}</h1> -->
    
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>

