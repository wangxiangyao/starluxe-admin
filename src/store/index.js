"use strict";
import Vue from "vue";
import Vuex from "vuex";

import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import member from "./modules/member/";
import order from "./modules/order/order.js";
import commodity from "./modules/commodity/commodity.js";
import analyze from "./modules/analyze/analyze.js";

import enumber from "./enum";
import reflection from "./reflection.js";

Vue.use(Vuex);

/**
 * TODO: 全局反馈的数据流动设计（mask）
 * TODO: 权限地图
 */
const state = {
  token: "",
  brands: [],
  enumber,
  style: {
    mainColor: "#FF7F00"
  },
  user: {
    id: "",
    roles: "",
    realName: "",
    account: "",
    lastUpdate: "",
    isLoading: true,
    needDestroy: false,
    permission: "",
    permissionMap: {}
  },
  mask: {
    isShow: false,
    type: "",
    message: "",
    all: ["login", "error", "success", "hite", "warning"]
  },
  menu: {
    // 每个菜单都有key值，用于映射后端传入的权限表
    ready: true,
    item: [
      {
        key: "home",
        title: "首页",
        to: "/home",
        icon: "el-icon-w-home"
      },
      {
        key: "data",
        title: "数据管理",
        icon: "el-icon-menu",
        sub: [
          {
            key: "dataMember",
            to: "/member",
            title: "用户",
            icon: "el-icon-star-off"
          },
          {
            key: "dataOrder",
            to: "/order",
            title: "订单",
            icon: "el-icon-document"
          },
          {
            key: "dataCommodity",
            to: "/commodity",
            title: "商品",
            icon: "el-icon-goods"
          }
        ]
      },
      {
        key: "analyze",
        title: "数据分析",
        icon: "el-icon-menu",
        sub: [
          {
            key: "analyzeAll",
            title: "总览",
            icon: "el-icon-goods",
            to: "/analyze/all"
          },
          {
            key: "analyzeChannel",
            to: "/analyze/member",
            title: "用户分析",
            icon: "el-icon-star-off"
          }
        ]
      }
    ]
  },
  reflection
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    member,
    order,
    commodity,
    analyze
  }
});
