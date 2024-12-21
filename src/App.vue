<script setup lang="ts">
import DeviceTimer from './components/DeviceTimer.vue';
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <DeviceTimer />
      <hr/>
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <!-- stuff -->
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

hr {
  margin: 3rem;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
