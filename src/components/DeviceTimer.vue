<script setup lang="ts">
import { onMounted } from 'vue';
import { reactive, computed } from 'vue'
import { ref } from 'vue';
import { createDevice } from '../devices';

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

const neighbours = ref(null);
const pairedDevices = ref([]);
const events = reactive({
  value: null,
  pollInterval: null
});

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

const fetchData = (): void => {
  const path = '/rest/events?events=DeviceDiscovered'; // DeviceConnected,
  fetch(`http://localhost:8384${path}`, request())
    .then(response => response.json())
    .then(data => {
      events.value = data.map((e:any) => e.id);
      checkNeighbours();
    });
};

onMounted(() => {
  fetchData();
  events.pollInterval = setInterval(fetchData, 1000);
});

</script>

<template>
  <div>
    <div v-for="neighbour in neighbours">
      <button @click="pairWith(neighbour)">{{ neighbour }}</button>
    </div>
    <label>Paired Devices:</label>
    <p>{{ pairedDevices }}</p>
    <label>Events:</label>
    <p>{{ events }}</p>
  </div>
</template>
