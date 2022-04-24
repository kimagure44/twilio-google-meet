<template>
  <v-container
    fluid
    class="grey darken-3 fill-height d-flex align-center justify-center d-flex"
    id="login-container"
  >
    <v-row class="d-flex align-center justify-center">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-col cols="12" class="d-flex justify-center align-center">
          <h1 class="white--text">Twilio Meet</h1>
        </v-col>
        <v-col cols="12" class="d-flex justify-end align-center">
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="Name"
            required
            filled
            dense
            solo
            flat
            background-color="grey darken-1"
            class="mt-6 mr-5"
          />
          <v-btn :disabled="!valid" color="success" @click="validate">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </v-col>
      </v-form>
    </v-row>
  </v-container>
</template>
<script>
const requiredName = (v) => !!v || 'Name is required';
const minimunName = (v) =>
  (v && v.length > 6) || 'Name must have minimum 6 characters';
export default {
  name: 'LoginView',
  data() {
    return {
      valid: false,
      name: '',
      nameRules: [requiredName, minimunName],
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
      debugger;
      this.name.length && this.valid && this.$router.push({ name: 'Chat' });
    },
  },
};
</script>

<style></style>
