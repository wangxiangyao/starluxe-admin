<template>
  <div id="app">
    <global-mask v-if="mask.isShow" />
    <header id="top">
      <div class="logo"></div>
      <div class="topbar-wrapper">
        <topBar />
      </div>
    </header>
    <main id="center">
      <div class="navigation">
        <navigation />
      </div>
      <div class="content">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </main>
  </div>
</template>
<script type="text/babel">
import { mapState, mapMutations, mapActions } from "vuex";
import globalMask from "@/components/mask/mask.vue";
import topBar from "@/components/topBar/topBar.vue";
import navigation from "@/components/navigation/navigation.vue";
import * as type from "./store/mutation-type";

export default {
  components: {
    globalMask,
    topBar,
    navigation
  },
  computed: {
    ...mapState(["mask"])
  },
  mounted() {
    // this.showMask({
    //   type: "login"
    // })
    this.getBrands();
    this.getCommodityCategory();
  },
  methods: {
    ...mapMutations({
      showMask: type.SHOW_MASK
    }),
    ...mapActions(["getBrands", "getCommodityCategory"])
  }
};
</script>
<style>
:root {
  --顶部高度: 70px;
  --侧边宽度: 300px;
}
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
