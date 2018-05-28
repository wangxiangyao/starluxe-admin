"use strict";

import api from "@/api";

import {
  STORE_BRANDS,
  STORE_ENUM,
  STORE_TOKEN,
  SHOW_MASK,
  LOGIN,
  UNLOGIN,
  CLOSE_MASK
} from "./mutation-type";

const actions = {
  checkToken({ commit, dispatch }) {
    // 如果有就把token存一下
    // 如果没有，就派发mask-loding页面展示事件
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    console.log("检查token:", token);
    if (token) {
      dispatch("storeToken", token);
      dispatch("loginByToken", { id });
    } else {
      commit(SHOW_MASK, { type: "login" });
    }
    // commit(SHOW_MASK, { type: "login" });
  },
  storeToken({ commit }, token) {
    if (!token.startsWith("Venus")) {
      token = "Venus " + token;
    }
    api.init(token);
    commit(STORE_TOKEN, token);
  },
  async login({ commit, dispatch }, data) {
    const result = await api.login(data);
    console.log("用户登录");
    if (result.status >= 200 && result.status < 300) {
      const { data } = result.data;
      console.log("用户登录成功", data);
      dispatch("storeToken", data.token);
      commit(LOGIN, data);
      commit(CLOSE_MASK);
    }
  },
  async loginByToken({ commit }, data) {
    console.log("根据token，id请求用户数据");
    const result = await api.loginByToken(data);
    const status = result.data.code;
    if (status >= 200 && status < 300) {
      const { data } = result.data;
      console.log("by-token-id响应：", data);
      commit(LOGIN, data);
    } else if (status === 401) {
      console.log("重新登录");
      api.init("");
      commit(UNLOGIN);
      commit(SHOW_MASK, { type: "login" });
    }
  },
  getBrands({ commit }) {
    // 获取品牌枚举值，存入enumber
    console.log("请求品牌");
    return api.getList("brands").then(res => {
      console.log("获得品牌列表——响应", res);
      if (res.status >= 200 && res.status < 300) {
        const { data } = res.data;
        commit(STORE_BRANDS, data);
        const enumber = data.map(item => {
          return {
            val: item.id,
            text: item.nameEn
          };
        });
        commit(STORE_ENUM, { enumber, key: "brands" });
      }
    });
  },
  getCommodityCategory({ commit }) {
    console.log("请求商品类别枚举字段");
    return api.getList("commodityCategory").then(res => {
      console.log("获得商品类别枚举——响应", res);
      if (res.status >= 200 && res.status < 300) {
        const { data } = res.data;
        const enumber = data.map(item => {
          return {
            val: item.id,
            text: item.name
          };
        });
        commit(STORE_ENUM, { enumber, key: "commodityCategory" });
      }
    });
  }
};

export default actions;
