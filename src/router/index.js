import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import Leads from '@/views/Leads.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'leads',
    meta: { title: 'Leads' },
    component: Leads,
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: 'Login' },
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
  },
  {
    path: '/manage-users',
    name: 'manage-users',
    meta: { title: 'Gerenciar usuários' },
    component: () => import(/* webpackChunkName: "manageUsers" */ '@/views/ManageUsers.vue'),
  },
  {
    path: '/preferences',
    name: 'preferences',
    meta: { title: 'Configurações de usuário' },
    component: () => import(/* webpackChunkName: "preferences" */ '@/views/UserPreferences.vue'),
  },
  {
    path: '*',
    name: 'not-found',
    meta: { title: 'Página não encontrada' },
    component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFound.vue'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!localStorage.auth) {
    if (to.name === 'login') return next();
    if (from.name === 'login') return next(false);

    return router.replace({ name: 'login' });
  }

  if (!store.state.user) {
    store.commit('setUser', {
      name: 'Admin',
      username: 'admin',
      email: 'admin@admin.com',
      password: '$2b$12$J8O3MGLZ05uF0/F.Ti9JQO.5acMP8/iUlZk9tkB0tO/zFl5uiZ.qa',
      createdAt: '2021-03-17T00:26:30.728Z',
      updatedAt: '2021-03-31T00:09:46.804Z',
      admin: true,
      id: '60514cb64084b319b1c512cd',
    });
  }

  if (to.name === 'login') {
    if (from.name === 'leads') return next(false);

    return router.replace({ name: 'leads' });
  }

  return next();
});

router.afterEach((to) => {
  if (to?.meta?.title) document.title = `${to.meta.title}`;
});

export default router;
