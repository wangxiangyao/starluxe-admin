<template>
  <div id="global-mask">
    <login v-if="mask.type === 'login'" />
  </div>
</template>
<script type="text/babel">
// 全局mask，处理全局loading，全局消息提示
// 在app.vue使用，覆盖全局

import { mapState } from "vuex";
const login = () => import("./login/login.vue");

export default {
  name: "global-mask",
  components: {
    login
  },
  computed: {
    ...mapState(["mask"])
  }
};
</script>
<style>
#global-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}
</style>
