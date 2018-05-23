<template>
  <div id="navigation">
    <el-menu
      :default-active="currentPath"
      class="menu"
      @open="handleOpen"
      @close="handleClose"
      :active-text-color="style.mainColor"
      :router="true">
      <template v-for="(item, index) in menu">
        <el-submenu :key="index" :index="item.title" v-if="item.sub">
          <template slot="title">
            <i :class="[item.icon ? item.icon : 'el-icon-menu']"></i>
            <span :class="{'fill-grey': !item.title}">{{item.title}}</span>
          </template>
          <template v-for="(sub, index) in item.sub">
            <el-submenu :key="index" :index="sub.title" v-if="sub.sub">
              <template slot="title">
                <i :class="[sub.icon ? sub.icon : 'el-icon-location']"></i>
                <span :class="{'fill-grey': !sub.title}">{{sub.title}}</span>
              </template>
              <el-menu-item v-for="(sub3, index) in sub.sub" :key="index" :index="sub3.to">
                <i :class="[sub3.icon ? sub3.icon : 'el-icon-location']"></i>
                <span slot="title" :class="{'fill-grey': !sub3.title}">{{sub3.title}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item :key="index" :index="sub.to" v-else>
              <i :class="[sub.icon ? sub.icon : 'el-icon-location']"></i>
              <span slot="title" :class="{'fill-grey': !sub.title}">{{sub.title}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item :key="index" :index="item.to" v-else>
          <i :class="[item.icon ? item.icon : 'el-icon-location']"></i>
          <span slot="title" :class="{'fill-grey': !Boolean(item.title)}">{{item.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script type="text/babel">
/**
  TODO: 权限管理
  TODO: 收起，展开功能

  */

import { mapGetters } from "vuex";

export default {
  name: "navigation",
  data() {
    return {
      style: this.$store.state.style
    };
  },
  computed: {
    ...mapGetters(["menu"]),
    menuList() {
      let menu;
      if (this.menu.ready) {
        menu = this.menu.item;
      } else {
        menu = [
          {
            title: "",
            to: ""
          },
          {
            title: "",
            sub: [
              {
                to: "",
                title: ""
              },
              {
                title: "",
                sub: [
                  {
                    to: "",
                    title: ""
                  }
                ]
              },
              {
                to: "",
                title: ""
              },
              {
                to: "",
                title: ""
              },
              {
                to: "",
                title: ""
              }
            ]
          },
          {
            title: "",
            sub: [
              {
                to: "",
                title: ""
              }
            ]
          }
        ];
      }
      return menu;
    },
    currentPath() {
      return this.$route.path;
    }
  },
  methods: {
    handleOpen() {},
    handleClose() {}
  }
};
</script>
<style>
.fill-grey {
  display: inline-block;
  background-color: rgb(235, 235, 235);
  width: calc(100% - 50px);
  height: 36px;
  margin: 10px 0;
}
</style>
