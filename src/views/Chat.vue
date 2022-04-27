<template>
  <v-container fluid class="grey fill-height align-start chat">
    <template v-if="connected">
      <div class="white--text">{{ room }}</div>
      <v-navigation-drawer right app v-model="sidebar">
        <template v-slot:prepend>
          <v-list-item two-line>
            <v-list-item-avatar>
              <img src="https://randomuser.me/api/portraits/women/81.jpg" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Jane Smith</v-list-item-title>
              <v-list-item-subtitle>Logged In</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item v-for="item in items" :key="item.title">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-row class="text-center video-container">
        <v-col cols="12">
          <div class="chat-grid">
            <v-card
              class="ma-auto custom-card"
              color="black"
              outlined
              v-for="(user, index) in users"
              :key="`video-${index}`"
            >
              <v-list-item class="pa-0">
                <video src=""></video>
              </v-list-item>
            </v-card>
          </div>
        </v-col>
      </v-row>
      <v-footer
        color="white"
        absolute
        min-width="100%"
        padless
        elevation="8"
        min-height="94px"
      >
        <v-row justify="space-between" class="mx-3">
          <div class="align-center d-flex black--text justify-start">
            Room title
          </div>
          <div class="action-buttons d-flex align-center">
            <v-tooltip
              top
              v-for="(
                { icon, tooltip, key, cb, status }, index
              ) in actionButtons"
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
    </template>
    <template v-else>
      <div
        class="container d-flex fill-height align-center justify-center container--fluid"
      >
        <h1 class="white--text">Access not allowed</h1>
      </div>
    </template>
  </v-container>
</template>

<script>
import { buttonStatus } from '@/helpers/methods';
export default {
  name: 'Home',
  props: {
    username: {
      type: String,
      default: '',
    },
    connected: {
      type: Boolean,
      default: false,
    },
    room: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      audio: false,
      video: false,
      sidebar: false,
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
          cb: this.showSidebar,
        },
        users: {
          key: 'users',
          tooltip: 'Show users',
          icon: 'mdi-account-multiple-outline',
          cb: this.showSidebar,
        },
      },
      users: new Array(2).fill(0).map((_, index) => ({
        name: `User ${index}`,
        video: true,
        audio: true,
      })),
      items: [
        { title: 'Home', icon: 'mdi-home-city' },
        { title: 'My Account', icon: 'mdi-account' },
        { title: 'Users', icon: 'mdi-account-group-outline' },
      ],
    };
  },
  methods: {
    redirect() {
      setTimeout(() => {
        this.$router.push({ name: 'Login' });
      }, 3000);
    },
    showSidebar() {
      this.sidebar = !this.sidebar;
    },
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
      const iKey = this.actionButtons[key];
      iKey.icon = buttonStatus(key, status);
      iKey.tooltip = status ? 'Activated' : 'Deactivated';
      iKey.status = status;
    },
    hangup() {
      this.$router.push({ name: 'Login' });
    },
  },
  mounted() {
    !this.connected && this.redirect();
  },
};
</script>
<style lang="scss">
* {
  overflow: hidden !important;
}
.chat {
  video {
    width: 100%;
    height: 100%;
  }
  .action-buttons {
    min-height: 70px;
  }
  .chat-grid {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
  .video-container {
  }

  .custom-card {
    width: 100%;
  }
}
</style>
