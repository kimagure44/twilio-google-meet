import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    totalUsers: 0,
    token: null,
  },
  getters: {
    getTotalUsers(state) {
      return state.totalUsers;
    },
    getToken(state) {
      return state.token;
    },
  },
  mutations: {
    setTotalUser(state, totalUsers) {
      state.totalUsers = totalUsers;
    },
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {
    getTokenTwilio({ commit }, payload) {
      return new Promise((resolve, reject) => {
        console.log('payload', payload);
        const params = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: payload.username }),
        };
        fetch('http://localhost:3000/get_tokens', params)
          .then((response) => response.json())
          .then(({ token }) => {
            commit('setToken', token);
            resolve(token);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  modules: {},
});
