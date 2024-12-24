<script setup lang="ts">
import { onMounted } from 'vue';
import { reactive, computed } from 'vue'

const health = reactive({
  value: null,
  pollInterval: null
});

const checkHealth = async (): Promise<void> => {
  try {
    const response = await fetch('http://localhost:8384/rest/noauth/health');
  } catch (error) {
    console.log("Syncthing not running...trying to start Syncthing...");
    window.electronAPI.startSyncthing(null);
  }
};

onMounted(() => {
  checkHealth();
  health.pollInterval = setInterval(checkHealth, 1000);
});

</script>

<template>
  <div>
    <label>Health:</label>
    <p>{{ health }}</p>
  </div>
</template>
