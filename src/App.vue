<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'AppView',
  data() {
    return {};
  },
};
</script>
<style lang="scss">
body {
  font-family: 'Roboto', sans-serif;
}
</style>
