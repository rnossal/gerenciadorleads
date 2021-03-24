<template>
  <div class="login">
    <Row id="title-row" type="flex" justify="center">
      <h1>Login</h1>
    </Row>
    <Row id="login-row" type="flex" justify="center">
      <i-col :md="10">
        <Card :dis-hover="true">
          <i-form ref="login-form" :model="formData" :rules="formRules" :disabled="authenticating">
            <FormItem prop="username" label="Nome de usuário ou e-mail">
              <Input prefix="ios-contact" v-model="formData.username" />
            </FormItem>
            <FormItem prop="password" label="Senha">
              <Input
                type="password"
                prefix="ios-key"
                v-model="formData.password"
                @on-enter="authenticate"
                password
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                :loading="authenticating"
                @click="authenticate"
                long
              >Login</Button>
            </FormItem>
          </i-form>
        </Card>
      </i-col>
    </Row>
    <!-- <Row id="register-row" type="flex" justify="center">
      <i-col :md="10" type="flex" align="middle">
        <Card :dis-hover="true">
          <p>
            Novo por aqui?
            <Button type="dashed" to="register">Crie uma conta</Button>
          </p>
        </Card>
      </i-col>
    </Row> -->
  </div>
</template>

<script>
import handleError from '@/mixins/handleError';
import { authentication } from '@/assets/config';

export default {
  name: 'Login',
  mixins: [handleError],
  data: () => ({
    formData: {
      username: null,
      password: null,
    },
    formRules: {
      username: [
        {
          required: true,
          message: 'Informe o usuário',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: 'Informe a senha',
          trigger: 'blur',
        },
        {
          type: 'string',
          min: 8,
          message: 'A senha não pode ser menor que 8 caracteres',
          trigger: 'blur',
        },
      ],
    },
    authenticating: false,
  }),
  methods: {
    async authenticate() {
      if (!await this.$refs['login-form'].validate()) return;

      this.authenticating = true;

      let auth = null;
      try {
        const response = await this.$http.post(
          authentication.methods.login,
          {
            username: this.formData.username,
            password: this.formData.password,
          },
        );

        auth = response.data;
      } catch (e) {
        this.handleError('Falha ao autenticar', e);

        this.authenticating = false;

        return;
      }

      localStorage.setItem('auth', auth.token);
      this.$store.commit('setUser', auth.user);

      this.$router.push('/');

      this.authenticating = false;
    },
  },
};
</script>

<style lang="less">
#title-row,
#login-row,
#register-row {
  margin-top: 20px;
}
</style>
