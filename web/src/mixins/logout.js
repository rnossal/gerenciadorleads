import { authentication } from '@/assets/config';
import handleError from '@/mixins/handleError';

export default {
  mixins: [handleError],
  methods: {
    async logout() {
      try {
        await this.$http.delete(authentication.methods.logout);

        localStorage.removeItem('auth');
        this.$store.commit('setUser', null);

        this.$router.replace({ name: 'login' });
      } catch (e) {
        this.handleError('Falha ao sair', e);
      }
    },
  },
};
