<script setup lang="ts">
defineProps<{
  msg: string
}>()

import { ref } from 'vue';

const friends = ref(null);

const checkNeighbours2 = (): void => {
  const path = '/rest/system/discovery';
  const headers = {
    'Authorization': 'Bearer kVbbrXED7cWkhv7kt9UwoqpsdpkGpb9e', // ${process.env.SYNCTHING_API_KEY} ... works in Electron
    'Content-Type': 'application/json'
  };
  fetch(`http://localhost:8384${path}`, { headers })
    .then(response => response.json())
    .then(data => friends.value = data);
};

</script>

<template>
  <div class="greetings">
    <button @click="checkNeighbours2()">Check Neighbours</button>
    <p>{{ friends }}</p>
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

