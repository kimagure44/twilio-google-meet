<template>
  <v-snackbar
    v-model="configNotify.show"
    :timeout="4000"
    absolute
    top
    right
    tile
    :color="stautsNotify"
  >
    <slot>{{ message }}</slot>
    <template v-slot:action="{ attrs }">
      <v-btn
        color="white"
        icon
        v-bind="attrs"
        @click="configNotify.show = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Notify',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'success',
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(value) {
        this.configNotify.show = value;
      },
    },
    type: {
      immediate: true,
      handler(value) {
        this.configNotify.type = value;
      },
    },
  },
  computed: {
    stautsNotify() {
      return `accent-4 rounded ${
        this.configNotify.type === 'success' ? 'green' : 'red'
      }`;
    },
  },
  data() {
    return {
      configNotify: {
        show: false,
        type: 'success',
      },
    };
  },
};
</script>

<style></style>
