<template>
  <v-container
    fluid
    class="white fill-height d-flex align-start justify-center d-flex"
    id="login-container"
  >
    <v-row class="d-flex align-start justify-center">
      <v-col cols="12" class="d-flex justify-start align-center">
        <v-icon x-large color="info">mdi-message-video</v-icon>
        <span class="info--text text-center ml-3 text-uppercase"
          >Tecnops Meet</span
        >
      </v-col>
      <v-form
        ref="form"
        v-model="isValidForm"
        lazy-validation
        @submit.prevent="onSubmit"
      >
        <v-col cols="12" class="d-flex justify-center align-center">
          <v-card class="mx-auto" max-width="400px" elevation="7">
            <div class="px-4 pt-4" ref="local-video" />
            <v-card-title class="d-flex align-start ma-0">
              <v-text-field
                v-model="username"
                :rules="nameRules"
                label="Name"
                required
                filled
                dense
                solo
                flat
                background-color="grey darken-1"
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
    <!-- FROM -->
    <div class="TEST">
      <form id="form">
        Name: <input id="username" placeholder="Type your username..." />
        <button id="join">Join Call</button>
      </form>
      <p v-text="count" />
      <div ref="container">
        <div id="local" class="participant">
          <div>Yo</div>
        </div>
        <!-- al resto de participantes -->
      </div>
    </div>
    <!-- TO -->
  </v-container>
</template>
<script>
import Twilio from 'twilio-video';
const USER_MINLENGTH = 6;
const requiredName = (v) => !!v || 'Name is required';
const minimunName = (v) =>
  (v && v.length > USER_MINLENGTH) || 'Name must have minimum 6 characters';

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
    };
  },
  methods: {
    async addLocalVideo() {
      const track = await Twilio.createLocalVideoTrack();
      this.$refs['local-video'].appendChild(track.attach());
    },
    async onSubmit() {
      this.$refs.form.validate();
      if (this.username.length && this.isValidForm) {
        if (this.isConnected) {
          this.disconnect();
          return;
        }
        this.isConnected = true;
        this.$router.push({
          name: 'Chat',
          params: { username: this.username, connected: this.isConnected },
        });
        try {
          await this.connect({ username: this.username });
          // this.$router.push({ name: 'Chat' });
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
video {
  width: 100%;
  border-radius: 5px;
}
</style>
