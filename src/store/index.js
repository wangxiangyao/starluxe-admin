"use strict";
import Vue from "vue";
import Vuex from "vuex";

import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import member from "./modules/member/";
import order from "./modules/order/order.js";
import commodity from "./modules/commodity/commodity.js";
import enumber from "./enum";

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
    isLoading: false,
    needDestroy: false
  },
  mask: {
    isShow: false,
    type: "",
    message: "",
    all: ["login", "error", "success", "hite", "warning"]
  },
  menu: {
    ready: true,
    item: [
      {
        title: "首页",
        to: "/home",
        icon: "el-icon-w-home"
      },
      {
        title: "数据管理",
        icon: "el-icon-menu",
        sub: [
          {
            to: "/member",
            title: "用户",
            icon: "el-icon-star-off"
          },
          {
            to: "/order",
            title: "订单",
            icon: "el-icon-document"
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
            to: "/commodity",
            title: "商品",
            icon: "el-icon-goods"
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
    ]
  }
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    member,
    order,
    commodity
  }
});
