<script setup lang="ts">
defineProps<{
  msg: string
}>()

import { ref } from 'vue';
import { createStDevice } from '../devices';

const neighbours = ref(null);
const lastPair = ref(null);
const devices = ref(null);
const events = ref(null);

const headersWithKey = (): {} => {
  // TODO: obviously don't pass data arond in the UI ...rrriiiiiiight?
  const apiKey = document.getElementById('api-key').innerHTML;
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
}

const request = (): {} => {
  return {
    headers: headersWithKey()
  }
}

const checkConnections = (): void => {
  const path = `/rest/system/connections`;
  fetch(`http://localhost:8384${path}`, { 
    method: 'GET',
    headers: headersWithKey(),
  })
  .then(response => response.json())
  .then(json => {
    console.log(json);
  });
};

const checkNeighbours2 = (): void => {
  // const path = '/rest/system/connections'; // connected devices and this device (as not connected), but only when there is another device connected...?
  const path = '/rest/system/discovery'; // contains "nearby devices"! <3
  // const path = '/rest/cluster/pending/devices'; // does not contain "nearby devices" :(
  fetch(`http://localhost:8384${path}`, request())
    .then(response => response.json())
    .then(data => neighbours.value = Object.keys(data));
};

const checkDevices = (): void => {
  const path = '/rest/config/devices';
  fetch(`http://localhost:8384${path}`, request())
    .then(response => response.json())
    .then(data => devices.value = data);
};

const checkEvents = (): void => {
  const path = '/rest/events?events=DeviceDiscovered'; // DeviceConnected,
  fetch(`http://localhost:8384${path}`, request())
    .then(response => response.json())
    .then(data => events.value = data);
};

const pairWith = (deviceID:string): void => {
  const newDevice = createStDevice(deviceID);

  const path = `/rest/config/devices`; // /${deviceID}
  fetch(`http://localhost:8384${path}`, { 
    method: 'POST',
    headers: headersWithKey(),
    body: JSON.stringify(newDevice)
  })
    // .then(response => {
    //   console.log(`response: ${response.body}`);
    //   response.json()})
    .then(data => lastPair.value = deviceID);
};

const createFolder = (): void => {
  const path = '/rest/config/folders';
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
    <div>
      <button @click="checkConnections()">Check Connections</button>
    </div>
    <div>
      <button @click="checkNeighbours2()">Check Neighbours</button>
      <label>Neighbours:</label>
      <p>{{ neighbours }}</p>
      <label>Last Device Paired:</label>
      <p>{{ lastPair }}</p>
      <label>Click to pair:</label>
      <div v-for="neighbour in neighbours">
        <button @click="pairWith(neighbour)">{{ neighbour }}</button>
      </div>
    </div>
    <div>
      <button @click="checkDevices()">Check Devices</button>
      <label>Devices:</label>
      <p>{{ devices }}</p>
    </div>
    <div>
      <button @click="checkEvents()">Check Events</button>
      <label>Events:</label>
      <p>{{ events }}</p>
    </div>
    <button @click="createFolder()">Create Folder</button>
    
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

