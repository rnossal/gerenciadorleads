<template>
  <div class="manage-users">
    <Content :style="{padding: '20px 50px'}">
      <h1>Gerenciar usuários</h1>
      <Card :dis-hover="true">
        <Layout>
          <Sider id="users-sider" width="300">
            <Input
              search
              enter-button
              placeholder="Pesquisar por nome/email/usuário"
              v-model="searchTerm"
            />
            <Divider id="users-list-divider" />
            <Button @click="mountCreateUser" type="primary" long>Criar usuário</Button>
            <Divider id="users-list-divider" />
            <List>
              <ListItem
                class="user-list-item"
                v-for="userItem in usersList"
                :key="userItem.id"
                @click.native="loadUser(userItem.id)"
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
                <i-switch v-model="formData.admin" />
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
                  class="user-actions"
                  type="error"
                  :loading="saving"
                  @click="creatingUser ? cancelCreateUser() : deleteUser()"
                  :disabled="disabled"
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
      </Card>
    </Content>
  </div>
</template>

<script>
export default {
  name: 'ManageUsers',
  data() {
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
      formRules: { },
      saving: false,
      disabled: true,
    };
  },
  methods: {
    fetch() {
      this.usersList = [
        {
          id: '60514cb64084b319b1c512cd',
          name: 'Admin',
          username: 'admin',
          email: 'admin@admin.com',
          admin: true,
        },
        {
          id: '608f3e6c23301b0b0ccc029d',
          name: 'Rafael Nossal',
          username: 'rnossal',
          email: 'rafael.nossal@gmail.com',
          admin: false,
        },
      ];
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
    loadUser(userId) {
      const user = this.usersList.find((u) => u.id === userId);

      this.userInfo = user;

      this.formData = Object.assign(this.formData, this.userInfo);
      delete this.formData.id;
      this.formData.password = null;

      this.disabled = false;
    },
    createUser() {
      this.$Notice.success({
        desc: 'Usuário criado com sucesso.',
      });

      this.saving = false;
      this.creatingUser = false;
    },
    deleteUser() {
      this.$Notice.success({
        desc: 'Usuário deletado com sucesso.',
      });

      this.saving = false;
      this.creatingUser = false;
    },
    saveUser() {
      this.$Notice.success({
        desc: 'Usuário salvo com sucesso.',
      });

      this.saving = false;
    },
  },
  beforeMount() {
    this.fetch();
  },
};
</script>

<style lang="less">
.user-actions:first-child {
  margin-right: 10px;
}

.user-actions {
  width: calc(50% - 5px);
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
  border: 1px solid #e8eaec;
  border-radius: 0px 3px 3px 0px;
}

#users-list-divider {
  margin: 5px 0;
}

.user-list-item:hover {
  background: #f7f7f7;
}

.fake-user {
  margin-bottom: 0;
  height: 0;
  overflow: hidden;
}
</style>
