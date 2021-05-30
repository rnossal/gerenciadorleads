<template>
  <div class="header-menu">
    <Menu
      id="app-menu"
      :mode="viewWidth > 450 ? 'horizontal' : 'vertical'"
      theme="light"
      :active-name="$route.name"
      width="auto"
    >
      <div id="menu-container">
        <div id="menu-left">
          <MenuItem name="leads" :to="{ name: 'leads' }">Início</MenuItem>
          <!-- <Submenu name="cadsub">
            <template slot="title">
              <span>Cadastros</span>
            </template>
            <MenuItem name="courses-menu" :to="{ name: 'manage-courses' }">
              <Icon type="ios-people" />Cursos
            </MenuItem>
          </Submenu> -->
        </div>
        <div id="menu-middle">
        </div>
        <div id="menu-right">
          <Submenu id="usersub" name="usersub">
            <template slot="title">
              <Icon type="ios-person" />
              <span id="user-name">
                {{$store.state.user ? $store.state.user.name : 'Não autenticado'}}
              </span>
            </template>
            <MenuItem v-if="isAdmin" name="logout-menu" :to="{ name: 'manage-users' }">
              <Icon type="ios-people" />Gerenciar usuários
            </MenuItem>
            <MenuItem name="logout-menu" :to="{ name: 'preferences' }">
              <Icon type="ios-cog" />Configurações do usuário
            </MenuItem>
            <MenuItem name="logout-menu" @click.native="logout">
              <Icon type="ios-exit" />Sair
            </MenuItem>
          </Submenu>
        </div>
      </div>
    </Menu>
  </div>
</template>

<script>
import logout from '@/mixins/logout';

export default {
  name: 'HeaderMenu',
  mixins: [logout],
  data: () => ({
    viewWidth: 0,
  }),
  methods: {
    handleResize() {
      this.viewWidth = window.innerWidth;
    },
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.admin;
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style lang="less">
#app-menu {
  height: auto;
}

#usersub {
  .ivu-menu-submenu-title {
    display: flex;
    align-items: center;
  }
}

#user-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 5px;
}

.ivu-menu-horizontal {
  #user-name {
    max-width: 150px;
  }
  .header-menu {
    z-index: 99;
    position: sticky !important;
    top: 0;
  }

  #menu-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    * {
      user-select: none;
    }
  }
}
</style>
