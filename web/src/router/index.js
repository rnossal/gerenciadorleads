import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { authentication } from '@/assets/config';
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
    path: '/courses',
    name: 'courses',
    meta: { title: 'Cursos' },
    component: () => import(/* webpackChunkName: "courses" */ '@/views/Courses.vue'),
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
    try {
      const response = await router.app.$http.get(authentication.methods.get);

      store.commit('setUser', response.data.user);
    } catch (e) {
      if (e?.response?.status === 401) {
        // eslint-disable-next-line no-console
        try { await this.$http.delete(authentication.methods.logout); } catch { console.clear(); }

        localStorage.removeItem('auth');

        return router.replace({ name: 'login' });
      }

      router.app.$Modal.error({ title: 'Erro ao recuperar o usuário', content: e, okText: 'Ok' });

      return next(false);
    }
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
