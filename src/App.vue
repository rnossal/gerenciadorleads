// https://markus.oberlehner.net/blog/vue-router-page-transitions/
<template>
  <div id="app">
    <HeaderMenu v-if="$store.state.user" />
    <transition
      name="fade"
      mode="out-in"
      @beforeLeave="beforeLeave"
      @enter="enter"
      @afterEnter="afterEnter"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
import HeaderMenu from '@/components/HeaderMenu.vue';

export default {
  name: 'App',
  components: {
    HeaderMenu,
  },
  data: () => ({
    prevHeight: 0,
  }),
  methods: {
    beforeLeave(element) {
      this.prevHeight = getComputedStyle(element).height;
    },
    enter(element) {
      const { height } = getComputedStyle(element);

      element.style.height = this.prevHeight;

      setTimeout(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = 'auto';
    },
  },
};
</script>

<style lang="less">
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.05s;
  transition-property: height, opacity;
  transition-timing-function: ease;
  overflow: hidden;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
