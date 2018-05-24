<template>
  <div id="app">
    <global-mask v-if="mask.isShow" />
    <Stage v-else />
  </div>
</template>
<script type="text/babel">
import { mapState, mapActions } from "vuex";
import globalMask from "@/components/mask/mask.vue";
import Stage from "./Stage";

export default {
  components: {
    globalMask,
    Stage
  },
  computed: {
    ...mapState(["mask"])
  },
  created() {
    this.checkToken();
  },
  updated() {
    this.checkToken();
  },
  mounted() {},
  methods: {
    ...mapActions(["checkToken"])
  }
};
</script>
<style scoped>
#app {
  width: 100vw;
  height: 100vh;
}
#top {
  display: flex;
}
.logo {
  min-width: var(--侧边宽度);
  height: var(--顶部高度);
  background-color: #ccc;
}

#center {
  display: flex;
  height: calc(100vh - var(--顶部高度));
  width: 100%;
}
.navigation {
  flex: none;
  width: var(--侧边宽度);
}
.content {
  flex: 1;
  width: calc(100% - var(--侧边宽度));
  background-color: var(--背景色);
}
.topbar-wrapper {
  flex: 1;
}
</style>
