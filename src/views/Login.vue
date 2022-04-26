<template>
  <v-container
    fluid
    class="white fill-height d-flex align-start justify-center d-flex"
    id="login-container"
  >
    <v-row class="d-flex align-start justify-center">
      <v-col
        cols="12"
        class="d-flex justify-center align-end header col col-12 pt-10 grey"
      >
        <v-icon large color="black" class="logotype white">
          mdi-message-video
        </v-icon>
      </v-col>
      <v-form
        ref="form"
        v-model="isValidForm"
        lazy-validation
        @submit.prevent="onSubmit"
      >
        <v-col cols="12" class="d-flex justify-center align-center">
          <v-card class="mx-auto custom-card" max-width="450px" elevation="12">
            <div
              class="mx-4 mt-4 local-video-thumb black d-flex justify-center align-center"
              v-if="videoLoading"
            >
              <v-progress-circular
                :size="90"
                :width="3"
                color="white"
                indeterminate
              ></v-progress-circular>
            </div>
            <div class="px-4 pt-4 local-video" v-else ref="local-video" />
            <v-card-title class="d-flex align-center ma-0 justify-center">
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                required
                class="mr-2"
                placeholder="Username"
              />
            </v-card-title>
          </v-card>
        </v-col>
      </v-form>
    </v-row>
    <v-snackbar
      v-model="notify"
      :timeout="4000"
      absolute
      top
      right
      tile
      :color="stautsNotify"
    >
      {{ notifyMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" icon v-bind="attrs" @click="notify = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import { validations } from '@/helpers';
export default {
  name: 'LoginView',
  data() {
    return {
      isValidForm: false,
      username: '',
      usernameRules: [
        validations.requiredUsername,
        validations.minLengthUsername,
      ],
      isConnected: false,
      room: null,
      count: 0,
      videoLoading: true,
      notify: false,
      notifyType: 'success',
      notifyMessage: '',
      hasDevice: false,
    };
  },
  computed: {
    stautsNotify() {
      return `accent-4 rounded ${
        this.notifyType === 'success' ? 'green' : 'red'
      }`;
    },
  },
  methods: {
    showNotify({ success, message }) {
      this.notifyType = success ? 'success' : 'error';
      this.notifyMessage = message;
      this.notify = true;
    },
    async addLocalVideo() {
      try {
        const track = await this.$Twilio.createLocalVideoTrack();
        this.videoLoading = false;
        this.hasDevice = true;
        await this.$nextTick();
        this.$refs['local-video'].appendChild(track.attach());
      } catch (error) {
        this.hasDevice = false;
        this.showNotify({ success: false, message: error.message });
      }
    },
    async onSubmit() {
      this.$refs.form.validate();
      if (this.username.length && this.isValidForm) {
        try {
          this.isConnected = true;
          this.$router.push({
            name: 'Chat',
            params: {
              username: this.username,
              connected: this.isConnected,
              room: this.room,
            },
          });
          if (this.isConnected) {
            this.disconnect();
            return;
          }
          if (!this.hasDevice) {
            throw new Error('Requested device not found');
          }
          await this.connect({ username: this.username });
          this.$router.push({
            name: 'Chat',
            params: {
              username: this.username,
              connected: this.isConnected,
              room: this.room,
            },
          });
        } catch (error) {
          this.showNotify({ success: false, message: error.message });
        }
      }
    },
    disconnect() {
      this.room.disconnect();
      this.isConnected = false;
      this.updateParticipantCount();
    },
    async connect({ username }) {
      const params = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      };
      const { token } = await (await fetch('/get_tokens', params)).json();
      this.room = await this.$Twilio.connect(token);
      this.room.participants.forEach(this.participantConnected);
      this.room.on('participantConnected', this.participantConnected);
      this.room.on('participantDisconnected', this.participantDisconnected);
      this.isConnected = true;
      this.updateParticipantCount();
    },
    updateParticipantCount() {
      this.count = `${this.room.participants.size + 1} online users`;
    },
    participantConnected(participant) {
      const template = `<div id='participant-${participant.id}' class="participant">
    <div class="video"></div>
    <div>${participant.identity}</div>
  </div>`;
      this.$refs.container.insertAdjacentHTML('beforeend', template);
      participant.tracks.forEach((localTrackPublication) => {
        const { isSubscribed, track } = localTrackPublication;
        if (isSubscribed) this.attachTrack(track);
      });
      participant.on('trackSubscribed', this.attachTrack);
      participant.on('trackUnsubscribed', (track) => track.detach());
      this.updateParticipantCount();
    },
    participantDisconnected(participant) {
      console.log('participant disconnected', participant);
    },
    attachTrack(track) {
      const $video = this.$refs.container.querySelector(
        '.participant:last-child .video'
      );
      $video.appendChild(track.attach());
    },
  },
  mounted() {
    this.addLocalVideo();
  },
};
</script>

<style lang="scss">
#login-container {
  .local-video {
    width: 350px;
    height: 265px;
  }
  .blue-gradient {
    background: rgba(0, 86, 245, 1);
    background: linear-gradient(
      135deg,
      rgba(0, 86, 245, 1) 0%,
      rgba(39, 179, 230, 1) 100%
    );
  }
  .local-video-thumb {
    width: 316px;
    height: 237px;
    border-radius: 5px;
  }
  video {
    border-radius: 5px;
    width: 100%;
    height: auto;
    background: #000000;
  }
  .header {
    height: 40vh;

    .logotype {
      font-size: 2rem !important;
      padding: 25px;
      z-index: 1;
      bottom: 66px;
      border-radius: 100px 100px 0 0;
      height: 25px;
    }
  }
  .custom-card {
    top: 30vh;
    min-height: 320px;
    position: absolute;
  }
}
</style>
