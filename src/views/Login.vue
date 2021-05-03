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
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    formData: {
      username: null,
      password: null,
    },
    formRules: { },
    authenticating: false,
  }),
  methods: {
    async authenticate() {
      localStorage.setItem('auth', 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDUxNGNiNjQwODRiMzE5YjFjNTEyY2QiLCJpYXQiOjE2MTk5OTk2MzMsImV4cCI6MTYyMDYwNDQzM30.E6YVSieWXxBroQ0-vWIU6emeSE8EL0InvluwfkN4r73znwiBXiijWdKdrQNriQKauaTRL_PjaLimXXl2RmLXfB-xUscqa7nkx2DJpq9516QEj0Cb0JMHUrRHhOCtt-hfDMaGvldui_mhHU-PP3_O3YX5Gwp1RE7l_ID4bOgMpSWjE6MQWiH1SosHPMMyGtj4N9_FX4-luHdfam3Ly5BEGpq2MuWqfqGtdBXs1TofEbH4GfDjXbap-CvMSegEiZDvdJcXOktkoOBvOqVtI7IHnVoJYoX-l0E4KciZVclqD86chBqvzklkipiwx2cksydVuRu1kyrrpgF0N2WrKwLeWQ');
      this.$store.commit('setUser', {
        name: 'Admin',
        username: 'admin',
        email: 'admin@admin.com',
        password: '$2b$12$J8O3MGLZ05uF0/F.Ti9JQO.5acMP8/iUlZk9tkB0tO/zFl5uiZ.qa',
        createdAt: '2021-03-17T00:26:30.728Z',
        updatedAt: '2021-03-31T00:09:46.804Z',
        admin: true,
        id: '60514cb64084b319b1c512cd',
      });

      this.$router.push('/');
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
