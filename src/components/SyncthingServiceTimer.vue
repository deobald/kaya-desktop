<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { reactive, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

enum Status {
  UNKNOWN = "unknown",
  STARTING = "starting",
  OK = "ok"
}

const sysStyle = ref('fa-regular');
const sysStatus = ref('fa-circle-question');
const sysColor = ref('#e8e8d5');
const sysThrobber = ref(false);

const health = reactive({
  serviceStatus: Status.UNKNOWN,
  pollInterval: null
});

const renderIcon = (status:string): void => {
  sysColor.value = status;
  switch (status) {
    case Status.OK:
      sysStyle.value = "fa-solid";
      sysStatus.value = "fa-globe";
      sysThrobber.value = false;
      break;
    case Status.STARTING:
      sysStyle.value = "fa-solid";
      sysStatus.value = "fa-spinner";
      sysThrobber.value = true;
      break;
    case Status.UNKNOWN:
      sysStyle.value = "fa-regular";
      sysStatus.value = "fa-circle-question";
      sysThrobber.value = false;
      break;
  }
}

const checkHealth = async (): Promise<void> => {
  // GET http://localhost:8384/rest/noauth/health net::ERR_INSUFFICIENT_RESOURCES
  // checkHealth @ SyncthingServiceTimer.vue:45

  fetch('http://localhost:8384/rest/noauth/health')
  .then(response => {
    if (response.ok) {
      health.serviceStatus = Status.OK;
      renderIcon(health.serviceStatus);
    } else {
      console.log("Health status not ok");
    }
  })
  .catch(error => {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      health.serviceStatus = Status.STARTING;
      renderIcon(health.serviceStatus);
      console.log("Syncthing not running...trying to start Syncthing...");
      window.electronAPI.startSyncthing(null);
    } else {
      console.dir(error);
    }
  });
};

onMounted(() => {
  checkHealth();
  health.pollInterval = setInterval(checkHealth, 1000);
});

</script>

<template>
  <div>
    <font-awesome-icon :class="sysColor" :spin-pulse="sysThrobber" :icon="[sysStyle, sysStatus]" size="3x" fixed-width />
  </div>
</template>


<style scoped>
.ok {
  color: #20abd7;
}

.starting {
  color: #df4655;
}

.unknown {
  color: #e8e8d5;
}
</style>
