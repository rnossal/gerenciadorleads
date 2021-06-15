<template>
  <div class="manage-users">
    <Content :style="{padding: '20px 50px'}">
      <h1>Gerenciar usuários</h1>
      <Card :dis-hover="true">
        <div id="manage-users-card">
          <Layout id="manage-users-layout">
            <Sider id="users-sider" width="300">
              <Input
                search
                enter-button
                placeholder="Pesquisar por nome/email/usuário"
                v-model="searchTerm"
                @on-search="onSearch"
              />
              <Divider id="users-list-divider" />
              <Button @click="mountCreateUser" type="primary" long>Criar usuário</Button>
              <Divider id="users-list-divider" />
              <List>
                <ListItem
                  :class="`user-list-item ${userItem.selected ? 'user-list-item-selected' : ''}`"
                  v-for="userItem in usersList"
                  :key="userItem.id"
                  @click.native="loadUser(userItem)"
                >
                  <div>
                    <p><b>Nome</b>: {{userItem.name}}</p>
                    <p><b>Usuário</b>: {{userItem.username}}</p>
                    <p><b>Email</b>: {{userItem.email}}</p>
                  </div>
                </ListItem>
              </List>
            </Sider>
            <Content id="user-content">
              <i-form
                ref="user-form"
                :model="formData"
                :rules="formRules"
                :disabled="saving || disabled"
              >
                <FormItem prop="name" label="Nome">
                  <Input prefix="ios-person" v-model="formData.name" />
                </FormItem>
                <FormItem prop="email" label="E-mail">
                  <Input prefix="ios-mail" v-model="formData.email" />
                </FormItem>
                <FormItem prop="admin" label="Administrador">
                  <Tooltip
                    v-if="userInfo.id === $store.state.user.id"
                    content="Não é possível mudar as permissões do próprio usuário"
                    placement="top"
                    max-width="250"
                  >
                    <i-switch
                      v-model="formData.admin"
                      :disabled="userInfo.id === $store.state.user.id"
                    />
                  </Tooltip>
                  <i-switch
                    v-else
                    v-model="formData.admin"
                    :disabled="userInfo.id === $store.state.user.id"
                  />
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
                  <Tooltip
                    class="user-actions"
                    v-if="userInfo.id === $store.state.user.id"
                    content="Não é possível deletar o próprio usuário"
                    placement="top"
                    max-width="200"
                  >
                    <Button
                      type="error"
                      :loading="saving"
                      @click="creatingUser ? cancelCreateUser() : deleteUser()"
                      :disabled="disabled || userInfo.id === $store.state.user.id"
                      long
                    >{{creatingUser ? 'Calcelar' : 'Deletar'}}</Button>
                  </Tooltip>
                  <Button
                    v-else
                    class="user-actions"
                    type="error"
                    :loading="saving"
                    @click="creatingUser ? cancelCreateUser() : deleteUser()"
                    :disabled="disabled || userInfo.id === $store.state.user.id"
                    long
                  >{{creatingUser ? 'Calcelar' : 'Deletar'}}</Button>
                  <Button
                    class="user-actions"
                    type="primary"
                    :loading="saving"
                    @click="creatingUser ? createUser() : saveUser()"
                    :disabled="disabled"
                    long
                  >{{creatingUser ? 'Criar usuário' : 'Salvar'}}</Button>
                </FormItem>
              </i-form>
            </Content>
          </Layout>
        </div>
      </Card>
    </Content>
  </div>
</template>

<script>
import { users } from '@/assets/config';
import handleError from '@/mixins/handleError';

export default {
  name: 'ManageUsers',
  mixins: [handleError],
  data() {
    const validatePassword = (_, value, callback) => {
      if ((!value || value.trim().lenght === 0) && this.creatingUser) {
        callback(new Error('Você precisa informar a senha'));
      } else {
        callback();
      }
    };

    return {
      creatingUser: false,
      searchTerm: null,
      usersList: [],
      userInfo: {},
      formData: {
        name: null,
        username: null,
        email: null,
        password: null,
        admin: false,
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
          {
            validator: validatePassword,
            trigger: 'blur',
          },
        ],
      },
      saving: false,
      disabled: true,
    };
  },
  methods: {
    async fetch() {
      this.formData = {};
      this.userInfo = {};
      this.disabled = true;

      let graphqlResponse = null;
      try {
        const response = await this.$http.get(users.methods.get, {
          params: {
            query: `{
              users(
                username: "${this.searchTerm ? this.searchTerm : ''}",
                name: "${this.searchTerm ? this.searchTerm : ''}",
                email: "${this.searchTerm ? this.searchTerm : ''}"
              ) {
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
        this.handleError('A lista de usuários', e);

        return;
      }

      if (graphqlResponse) {
        if (graphqlResponse.errors) {
          this.handleError('A lista de usuários', graphqlResponse);
        } else {
          this.usersList = graphqlResponse.data.users;
        }
      } else {
        this.handleError('A lista de usuários', 'Sem resposta do servidor');
      }
    },
    mountCreateUser() {
      this.disabled = false;
      this.creatingUser = true;
      this.formData = {};
    },
    cancelCreateUser() {
      this.disabled = true;
      this.creatingUser = false;
      this.formData = {};
    },
    async loadUser(user) {
      this.usersList.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.selected = false;
      });
      // eslint-disable-next-line no-param-reassign
      user.selected = true;
      this.disabled = true;
      this.creatingUser = false;
      this.formData = {
        name: null,
        username: null,
        email: null,
        password: null,
        admin: false,
      };

      let graphqlResponse = null;
      try {
        const response = await this.$http.get(users.methods.get, {
          params: {
            query: `{
              user(id: "${user.id}") {
                id
                name
                username
                email
                admin
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

          this.disabled = false;
        }
      } else {
        this.handleError('Falha ao recuperar o usuário', 'Sem resposta do servidor');
      }
    },
    async createUser() {
      if (!(await this.$refs['user-form'].validate())) return;

      this.saving = true;

      let savedUser = null;
      try {
        const response = await this.$http.post(users.methods.post, {
          name: this.formData.name,
          username: this.formData.username,
          email: this.formData.email,
          password: this.formData.password,
          admin: this.formData.admin,
        });

        savedUser = response.data;
      } catch (e) {
        this.handleError('Falha ao criar o usuário', e);
      }

      if (savedUser) {
        this.$Notice.success({
          desc: 'Usuário criado com sucesso.',
        });

        await this.fetch();
      }

      this.saving = false;
      this.creatingUser = false;
    },
    async deleteUser() {
      if (!(await this.$refs['user-form'].validate())) return;

      if (this.userInfo.id === this.$store.state.user.id) {
        this.$Notice.error({
          desc: 'Não é possível deletar o próprio usuário',
        });

        return;
      }

      this.saving = true;

      let deletedUser = null;
      try {
        const response = await this.$http.delete(users.methods.delete, {
          data: {
            userId: this.userInfo.id,
          },
        });

        deletedUser = response.data;
      } catch (e) {
        this.handleError('Falha ao deletar o usuário', e);
      }

      if (deletedUser) {
        this.$Notice.success({
          desc: 'Usuário deletado com sucesso.',
        });

        await this.fetch();
      }

      this.saving = false;
      this.creatingUser = false;
    },
    async saveUser() {
      if (!(await this.$refs['user-form'].validate())) return;

      this.saving = true;

      let savedUser = null;
      try {
        const response = await this.$http.put(users.methods.update, {
          userId: this.userInfo.id,
          name: this.formData.name,
          username: this.formData.username,
          email: this.formData.email,
          password: this.formData.password,
          admin: this.formData.admin,
        });

        savedUser = response.data;
      } catch (e) {
        this.handleError('Falha ao salvar', e);
      }

      if (savedUser) {
        this.$Notice.success({
          desc: 'Usuário salvo com sucesso.',
        });

        await this.fetch();
      }

      this.saving = false;
    },
    async onSearch() {
      await this.fetch();
    },
  },
  beforeMount() {
    if (!this.$store.state.user.admin) {
      this.$router.replace({ name: 'leads' });

      return;
    }

    this.$Spin.show();
  },
  async mounted() {
    await this.fetch();
    this.$Spin.hide();
  },
};
</script>

<style lang="less">
.user-actions:first-child {
  margin-right: 10px;
}

.user-actions {
  width: calc(50% - 5px);
  .ivu-tooltip-rel {
    width: 100%;
  }
}

#users-sider,
#user-content {
  background: white;
  padding: 5px;
}

#users-sider {
  border-color: #e8eaec;
  border-style: solid;
  border-width: 1px 0 1px 1px;
  border-radius: 3px 0px 0px 3px;
}

#user-content {
  overflow: unset;
  border: 1px solid #e8eaec;
  border-radius: 0px 3px 3px 0px;
}

#users-list-divider {
  margin: 5px 0;
}

.user-list-item:hover {
  background: #f7f7f7;
  cursor: pointer;
}

.user-list-item-selected {
  background: #f7f7f7;
}

.fake-user {
  margin-bottom: 0;
  height: 0;
  overflow: hidden;
}

#manage-users-card {
  overflow-x: auto;
}

#manage-users-layout {
  min-width: 600px;
}

.ivu-tooltip-inner {
  word-break: unset !important;
  text-align: center !important;
}
</style>
