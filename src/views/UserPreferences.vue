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
export default {
  name: 'UserPreferences',
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
    fetch() {
      this.userInfo = {
        id: '60514cb64084b319b1c512cd',
        name: 'Admin',
        username: 'admin',
        email: 'admin@admin.com',
      };

      this.formData = Object.assign(this.formData, this.userInfo);
      delete this.formData.id;
      this.formData.password = null;
    },
    savePreferences() {
      this.$Notice.success({
        desc: 'Preferências salvas com sucesso.',
      });
    },
  },
  beforeMount() {
    this.fetch();
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
