<script setup lang="ts">
import { onMounted } from 'vue';
import { reactive, computed } from 'vue'
import { ref } from 'vue';
import path from 'path';
import { createStDevice, createDeviceLogo, createDeviceColor } from '../devices';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const whoami = reactive({
  style: 'fa-regular',
  value: 'fa-circle-question',
  color: '#df4655',
  pollInterval: null
})
const neighbours = ref([])
const pairedDevices = ref([]);
const events = reactive({
  value: null,
  pollInterval: null
});

const getHomeDir = (): string => {
  // TODO: get this out of the UI
  const homeDir = document.getElementById('home-dir').innerHTML;
  if (homeDir === "") {
    throw Error("Home directory not set.");
  }
  return homeDir;
}

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

const askWhoami = (): void => {
  const path = `/rest/noauth/health`;
  fetch(`http://localhost:8384${path}`, { 
    method: 'GET',
    headers: headersWithKey(),
  })
  .then(response => {
    whoami.value = createDeviceLogo(response.headers.get('x-syncthing-id'));
    whoami.style = 'fa-brands';
    whoami.color = createDeviceColor(response.headers.get('x-syncthing-id'));
  });
  if (whoami.value != null) {
    clearInterval(whoami.pollInterval);
  }
};

const checkNeighbours = (): void => {
  const path = '/rest/system/discovery';
  fetch(`http://localhost:8384${path}`, request())
    .then(response => response.json())
    .then(data => {
      if (data == null) {
        neighbours.value = [{
          deviceID: null,
          style: 'fa-regular',
          value: 'fa-circle-question',
          color: '#df4655',
        }];
        return;
      }
      neighbours.value = [];
      Object.keys(data).forEach((id) => {
        neighbours.value.push({
          deviceID: id,
          style: 'fa-brands',
          value: createDeviceLogo(id),
          color: createDeviceColor(id),
        });
      })
    });
};

const checkRemoteDevices = (): void => {
  const path = `/rest/config/devices`;
  fetch(`http://localhost:8384${path}`, request())
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      console.log("### Request failed with:");
      response.text().then((text: any) => console.log(text));
    }
  })
  .then(data => {
    pairedDevices.value = data.map((dev: { deviceID: any; }) => dev.deviceID);
  })
  .catch(error => console.dir(error));
};

const pairWith = (deviceID:string): void => {
  const newDevice = createStDevice(deviceID);

  const path = `/rest/config/devices`;
  fetch(`http://localhost:8384${path}`, { 
    method: 'POST',
    headers: headersWithKey(),
    body: JSON.stringify(newDevice)
  })
  .then(response => {
    if (response.ok) {
      pairedDevices.value.push(deviceID);
    } else {
      console.log("### Request failed with:");
      response.text().then(text => console.log(text));
    }
  })
  .catch(error => console.dir(error));
};

const pushKayaFolder = (): void => {
  if (pairedDevices.value.length <= 1) {
    throw Error("Please pair with another device or wait until it is visible.");
  }

  const kayaFolder = {
    id: "kaya",
    path: [getHomeDir(), ".kaya"].join("/"), // TODO: this sucks, but path.join() doesn't exist in Vue client code
    filesystemType: "basic", 
    type: "sendreceive",
    devices: pairedDevices.value.map(id => { return {deviceID: id}; })
  };

  const uriPath = `/rest/config/folders`;
  fetch(`http://localhost:8384${uriPath}`, { 
    method: 'POST',
    headers: headersWithKey(),
    body: JSON.stringify(kayaFolder)
  })
  .then(response => {
    if (response.ok) {
      console.log("### Folder Posted");
    } else {
      console.log("### Request failed with:");
      response.text().then(text => console.log(text));
    }
  })
  .catch(error => console.dir(error));
};

const fetchDiscovery = (): void => {
  let req = {};
  try { 
    req = request();
  } catch (error) {
    console.log("API Key not set. Not fetching events yet.");
    return;
  }
  
  const path = '/rest/events?events=DeviceConnected,DeviceDiscovered';
  // net::ERR_INSUFFICIENT_RESOURCES
  fetch(`http://localhost:8384${path}`, req)
    .then(response => response.json())
    .then(data => {
      events.value = data.map((e:any) => e.id);
      checkNeighbours();
      checkRemoteDevices();
    });
};

onMounted(() => {
  whoami.pollInterval = setInterval(askWhoami, 1000);
  events.pollInterval = setInterval(fetchDiscovery, 5000);
});

</script>

<template>
  <div>
    <div>
      <label>Who am I?</label>
      <font-awesome-icon :style="{color: whoami.color}" :icon="[whoami.style, whoami.value]" size="3x" fixed-width />
    </div>

    <div>
      <label>Nearby Devices:</label>
      <div v-for="neighbour in neighbours">
        <button @click="pairWith(neighbour.deviceID)">
          <font-awesome-icon :style="{color: neighbour.color}" :icon="[neighbour.style, neighbour.value]" size="3x" fixed-width />
      </button>
      </div>
    </div>

    <div>
      <label>Add Kaya Folder:</label>
      <button @click="pushKayaFolder()">Add Folder</button>
    </div>

    <hr />

    <label>Paired Devices:</label>
    <p>{{ pairedDevices }}</p>
    <label>Events:</label>
    <p>{{ events }}</p>
  </div>
</template>


<style scoped>
.ok {
  color: #20abd7;
}

.bad {
  color: #df4655;
}

.unknown {
  color: #e8e8d5;
}
</style>
