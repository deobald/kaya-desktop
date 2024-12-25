<script setup lang="ts">
import { onMounted } from 'vue';
import { reactive, computed } from 'vue'
import { ref } from 'vue';
import { createDevice } from '../devices';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const logos = [
  'fa-jedi-order', 'fa-galactic-senate', 'fa-galactic-republic', 'fa-fulcrum', 'fa-first-order',
  'fa-connectdevelop', 'fa-canadian-maple-leaf', 'fa-diaspora'
]

const headersWithKey = (): {} => {
  // TODO: obviously don't pass data arond in the UI ...rrriiiiiiight?
  const apiKey = document.getElementById('api-key').innerHTML;
  if (apiKey === "") {
    throw Error("API key not set.");
  }
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

const neighbours = ref(null);
const pairedDevices = ref([]);
const whoami = reactive({
  value: null,
  pollInterval: null
})
const events = reactive({
  value: null,
  pollInterval: null
});

const askWhoami = (): void => {
  const path = `/rest/noauth/health`;
  fetch(`http://localhost:8384${path}`, { 
    method: 'GET',
    headers: headersWithKey(),
  })
  .then(response => whoami.value = response.headers.get('x-syncthing-id'));
  if (whoami.value != null) {
    clearInterval(whoami.pollInterval);
  }
};

const checkNeighbours = (): void => {
  const path = '/rest/system/discovery';
  fetch(`http://localhost:8384${path}`, request())
    .then(response => response.json())
    .then(data => neighbours.value = Object.keys(data));
};

const pairWith = (deviceID:string): void => {
  const newDevice = createDevice(deviceID);

  const path = `/rest/config/devices`;
  fetch(`http://localhost:8384${path}`, { 
    method: 'POST',
    headers: headersWithKey(),
    body: JSON.stringify(newDevice)
  })
  .then(_ => pairedDevices.value.push(deviceID));
};

const fetchDiscovery = (): void => {
  let req = {};
  try { 
    req = request();
  } catch (error) {
    console.log("API Key not set. Not fetching events yet.");
    return;
  }
  
  const path = '/rest/events?events=DeviceDiscovered'; // DeviceConnected,
  // net::ERR_INSUFFICIENT_RESOURCES
  fetch(`http://localhost:8384${path}`, req)
    .then(response => response.json())
    .then(data => {
      events.value = data.map((e:any) => e.id);
      checkNeighbours();
    });
};

onMounted(() => {
  whoami.pollInterval = setInterval(askWhoami, 1000);
  events.pollInterval = setInterval(fetchDiscovery, 5000);
});

</script>

<template>
  <div>
    <label>Who am I?</label>
    <p>{{ whoami.value }}</p>

    <div v-for="neighbour in neighbours">
      <button @click="pairWith(neighbour)">{{ neighbour }}</button>
    </div>
    <label>Paired Devices:</label>
    <p>{{ pairedDevices }}</p>
    <label>Events:</label>
    <p>{{ events }}</p>
  </div>
</template>
