<template>
  <v-container fluid class="grey darken-3 fill-height align-start">
    <v-row class="text-center">
      <v-col cols="12">
        <v-text-field
          filled
          dense
          solo
          flat
          readonly
          background-color="grey darken-2"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-card
          class="ma-auto"
          color="black"
          outlined
          v-for="(user, index) in users"
          :key="`video-${index}`"
        >
          <v-list-item class="pa-0">
            <video src=""></video>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-footer
      color="transparent"
      absolute
      min-width="100%"
      padless
      class="mb-3"
      min-height="70px"
    >
      <v-row justify="space-between" class="mx-3">
        <div class="align-center d-flex white--text justify-start">
          Room title
        </div>
        <div class="action-buttons d-flex align-center">
          <v-tooltip
            top
            v-for="({ icon, tooltip, key, cb, status }, index) in actionButtons"
            :key="`action-btn-${index}`"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :color="colorStatus(status)"
                fab
                small
                dark
                v-on="on"
                v-bind="attrs"
                @click="cb(key)"
                class="mx-2"
              >
                <v-icon normal>{{ icon }}</v-icon>
              </v-btn>
            </template>
            <span v-text="tooltip" />
          </v-tooltip>
        </div>
        <div class="align-center d-flex white--text justify-start">
          <v-tooltip
            top
            v-for="({ icon, tooltip, key, cb }, index) in sidebarActions"
            :key="`sidebar-btn-${index}`"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="grey darken-2"
                icon
                v-on="on"
                v-bind="attrs"
                @click="cb(key)"
                class="mx-2"
              >
                <v-icon normal>{{ icon }}</v-icon>
              </v-btn>
            </template>
            <span v-text="tooltip" />
          </v-tooltip>
        </div>
      </v-row>
    </v-footer>
  </v-container>
</template>

<script>
const ICON = {
  microphone: {
    on: 'mdi-microphone',
    off: 'mdi-microphone-off',
  },
  video: {
    on: 'mdi-video',
    off: 'mdi-video-off',
  },
};

const buttonStatus = (key, status) => ICON[key][status ? 'on' : 'off'];

export default {
  name: 'Home',
  data() {
    return {
      audio: false,
      video: false,
      actionButtons: {
        microphone: {
          key: 'microphone',
          tooltip: this.audio ? 'Open' : 'Mute',
          icon: buttonStatus('microphone', this.audio),
          cb: this.activateAudio,
          status: this.audio,
        },
        video: {
          key: 'video',
          tooltip: this.video ? 'Activated' : 'Deactivated',
          icon: buttonStatus('video', this.audio),
          cb: this.activateVideo,
          status: this.video,
        },
        phone: {
          key: 'phone',
          tooltip: 'Hangup',
          icon: 'mdi-phone-hangup',
          cb: this.hangup,
          status: false,
        },
      },
      sidebarActions: {
        chat: {
          key: 'chat',
          tooltip: 'Show chat',
          icon: 'mdi-comment-text-outline',
          cb: () => {},
        },
        users: {
          key: 'users',
          tooltip: 'Show users',
          icon: 'mdi-account-multiple-outline',
          cb: () => {},
        },
      },
      users: new Array(1).fill(0).map((_, index) => ({
        name: `User ${index}`,
        video: true,
        audio: true,
      })),
    };
  },
  methods: {
    colorStatus(status) {
      return status ? 'grey darken-2' : 'red darken-2';
    },
    activateAudio(key) {
      this.audio = !this.audio;
      this.statusButton(key, this.audio);
    },
    activateVideo(key) {
      this.video = !this.video;
      this.statusButton(key, this.video);
    },
    statusButton(key, status) {
      const iKey = this.links[key];
      iKey.icon = buttonStatus(key, status);
      iKey.tooltip = status ? 'Activated' : 'Deactivated';
      iKey.status = status;
    },
    hangup() {
      console.log('Hangup');
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  overflow: hidden !important;
}
video {
  width: 100%;
  height: 100%;
}
.action-buttons {
  min-height: 70px;
}
</style>
