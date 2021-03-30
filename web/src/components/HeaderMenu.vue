<template>
  <div class="header-menu">
    <Menu
      mode="horizontal"
      theme="light"
      :active-name="$route.name"
      width="auto"
    >
      <div id="menu-container">
        <div id="menu-left">
          <MenuItem name="leads" :to="{ name: 'leads' }">Início</MenuItem>
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
              <Icon type="ios-cog" />Configurações
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
  computed: {
    isAdmin() {
      return this.$store.state.user.admin;
    },
  },
};
</script>

<style lang="less">
.header-menu {
  z-index: 9999;
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

#menu-left, #menu-middle, #menu-right {
  display: flex;
  flex-basis: 100%;
}

#menu-left {
  justify-content: flex-start;
}

#menu-middle {
  align-items: center;
  justify-content: center;
}

#menu-right {
  justify-content: flex-end;
}

.ivu-menu-horizontal {
  height: 50px !important;
  line-height: 50px !important;
}

.editor-actions {
  margin-left: 5px;
}

#usersub {
  .ivu-menu-submenu-title {
    display: flex;
    align-items: center;
  }
}

#user-name {
  max-width: 180px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 5px;
}
</style>
