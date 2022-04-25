<template>
  <v-container
    fluid
    class="white fill-height d-flex align-start justify-center d-flex"
    id="login-container"
  >
    <v-row class="d-flex align-start justify-center">
      <v-col
        cols="12"
        class="d-flex justify-center align-start header col col-12 pt-10"
      >
        <v-icon x-large color="white" class="logotype">
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
              class="mx-4 mt-4 local-video-thumb blue lighten-4 d-flex justify-center align-center"
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
                :rules="nameRules"
                label="Username"
                required
                class="mr-2"
              />
              <v-btn
                :disabled="!isValidForm"
                color="info"
                icon
                large
                type="submit"
              >
                <v-icon>mdi-login</v-icon>
              </v-btn>
            </v-card-title>
          </v-card>
        </v-col>
      </v-form>
    </v-row>
  </v-container>
</template>
<script>
import Twilio from 'twilio-video';
const USER_MINLENGTH = 6;
const requiredName = (v) => !!v || 'Username is required';
const minimunName = (v) =>
  (v && v.length > USER_MINLENGTH) || 'Username must have minimum 6 characters';

export default {
  name: 'LoginView',
  data() {
    return {
      isValidForm: false,
      username: '',
      nameRules: [requiredName, minimunName],
      isConnected: false,
      room: null,
      count: 0,
      videoLoading: true,
    };
  },
  methods: {
    async addLocalVideo() {
      const track = await Twilio.createLocalVideoTrack();
      console.log(track);
      this.videoLoading = false;
      this.$nextTick(() => {
        this.$refs['local-video'].appendChild(track.attach());
      });
    },
    async onSubmit() {
      this.$refs.form.validate();
      if (this.username.length && this.isValidForm) {
        if (this.isConnected) {
          this.disconnect();
          return;
        }
        this.$router.push({ name: 'Chat' });
        try {
          await this.connect({ username: this.username });
          this.$router.push({
            name: 'Chat',
            params: {
              username: this.username,
              connected: this.isConnected,
              room: this.room,
            },
          });
        } catch (e) {
          console.error(e);
          alert('Failed to connect');
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
      this.room = await Twilio.connect(token);
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
    background: rgba(0, 86, 245, 1);
    background: linear-gradient(
      135deg,
      rgba(0, 86, 245, 1) 0%,
      rgba(39, 179, 230, 1) 100%
    );
    .logotype {
      font-size: 6rem !important;
      background: #00a2ff;
      padding: 40px;
      border-radius: 30% 10%;
      box-shadow: 7px 7px 14px -2px rgba(0, 0, 0, 0.2);
    }
  }
  .custom-card {
    top: 30vh;
    min-height: 320px;
    position: absolute;
  }
}
</style>
