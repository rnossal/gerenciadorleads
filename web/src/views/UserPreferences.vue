<template>
  <div class="user-preferences">
    <Content :style="{padding: '20px 50px'}">
      <h1>Configurações do usuário</h1>
      <Card :dis-hover="true">
        <i-form ref="preferences-form" :model="formData" :rules="formRules" :disabled="saving">
          <FormItem prop="name" label="Nome">
            <Input prefix="ios-person" v-model="formData.name" />
          </FormItem>
          <FormItem prop="email" label="E-mail">
            <Input prefix="ios-mail" v-model="formData.email" />
          </FormItem>
          <FormItem prop="username" label="Usuário">
            <Input prefix="ios-contact" v-model="formData.username" />
          </FormItem>
          <FormItem prop="user" label="Usuário" class="fake-user">
            <Input prefix="ios-contact" value="f3d224f82a774382b95f4a168e20ff52" />
          </FormItem>
          <FormItem prop="password" label="Senha (informar somente se quiser alterar)">
            <Input type="password" prefix="ios-key" v-model="formData.password" password />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              :loading="saving"
              @click="savePreferences"
              long
            >Salvar</Button>
          </FormItem>
        </i-form>
      </Card>
    </Content>
  </div>
</template>

<script>
import { authentication, users } from '@/assets/config';
import handleError from '@/mixins/handleError';

export default {
  name: 'UserPreferences',
  mixins: [handleError],
  data: () => ({
    userInfo: {},
    formData: {
      name: null,
      username: null,
      email: null,
      password: null,
    },
    formRules: {
      name: [
        {
          required: true,
          message: 'Informe o nome',
          trigger: 'blur',
        },
      ],
      username: [
        {
          required: true,
          message: 'Informe o usuário',
          trigger: 'blur',
        },
      ],
      email: [
        {
          required: true,
          message: 'Informe o e-mail',
          trigger: 'blur',
        },
        {
          type: 'email',
          message: 'E-mail inválido',
          trigger: 'blur',
        },
      ],
      password: [
        {
          type: 'string',
          min: 8,
          message: 'A senha não pode ser menor que 8 caracteres',
          trigger: 'blur',
        },
      ],
    },
    saving: false,
  }),
  methods: {
    async fetch() {
      let graphqlResponse = null;

      try {
        const response = await this.$http.get(users.methods.get, {
          params: {
            query: `{
              user(id: "${this.$store.state.user.id}") {
                id
                name
                username
                email
              }
            }`,
          },
        });

        graphqlResponse = response.data;
      } catch (e) {
        this.handleError('Falha ao recuperar o usuário', e);

        return;
      }

      if (graphqlResponse) {
        if (graphqlResponse.errors) {
          this.handleError('Falha ao recuperar o usuário', graphqlResponse);
        } else {
          this.userInfo = graphqlResponse.data.user;

          this.formData = Object.assign(this.formData, this.userInfo);
          delete this.formData.id;
          this.formData.password = null;
        }
      } else {
        this.handleError('Falha ao recuperar o usuário', 'Sem resposta do servidor');
      }
    },
    async savePreferences() {
      if (!(await this.$refs['preferences-form'].validate())) return;

      this.saving = true;

      let savedUser = null;
      try {
        const response = await this.$http.put(users.methods.update, {
          userId: this.$store.state.user.id,
          name: this.formData.name,
          username: this.formData.username,
          email: this.formData.email,
          password: this.formData.password,
          prefs: true,
        });

        savedUser = response.data;
      } catch (e) {
        this.handleError('Falha ao salvar', e);
      }

      if (savedUser) {
        this.$Notice.success({
          desc: 'Preferências salvas com sucesso.',
        });
      }

      try {
        const response = await this.$http.get(authentication.methods.get);

        this.$store.commit('setUser', response.data.user);
      } catch (e) {
        this.handleError('Falha ao recuperar o usuário alterado', e);
      }

      this.saving = false;
    },
  },
  beforeMount() {
    this.$Spin.show();
  },
  async mounted() {
    await this.fetch();
    this.$Spin.hide();
  },
};
</script>

<style lang="less">
.fake-user {
  margin-bottom: 0;
  height: 0;
  overflow: hidden;
}
</style>
