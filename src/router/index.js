import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/chat',
    name: 'Chat',
    props: true,
    component: () => import(/* webpackChunkName: "chat" */ '@/views/chat.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
});

export default router;
