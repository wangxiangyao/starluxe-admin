"use strict";

import * as TYPE from "./mutation-type";
import enumberStore from "./enum.js";

const mutations = {
  [TYPE.STORE_TOKEN](state, token) {
    state.token = token;
    localStorage.setItem("token", token);
  },
  [TYPE.LOGIN](state, data) {
    const { user } = state;
    user.id = data.userId;
    user.account = data.account;
    user.realName = data.realName;
    user.roles = data.roles.split(",");
    user.isLoading = false;
    user.needDestroy = false;
    user.lastUpdate = +new Date();
    user.permission = data.permissions;
    localStorage.setItem("userId", data.userId);

    let permission = data.permissions;
    const map = {};
    permission = permission.split(",");
    console.log("拆分一级权限字符串", permission);
    permission.map(item => {
      const one = item.split(":");
      if (map.hasOwnProperty(one[0])) {
        map[one[0]][one[1]] = true;
      } else {
        map[one[0]] = {};
        map[one[0]][one[1]] = true;
      }
    });
    const permissionMap = state.user.permissionMap;
    state.user.permissionMap = Object.assign({}, permissionMap, map);
  },
  [TYPE.STORE_USER](state, user) {
    state.user = user;
  },
  [TYPE.SHOW_MASK](state, data) {
    const { mask } = state;
    const type = data.type.toLowerCase();
    const isOk = mask.all.some(item => {
      return item === type;
    });
    if (isOk) {
      mask.isShow = true;
      mask.type = type;
      /**
       *  switch type: login
       */
    } else {
      mask.isShow = true;
      mask.type = "error";
      mask.message = "不存在的mask类型";
    }
  },
  [TYPE.CLOSE_MASK](state) {
    const { mask } = state;
    mask.isShow = false;
    mask.type = "";
  },
  [TYPE.STORE_BRANDS](state, brands) {
    state.brands = brands;
  },
  [TYPE.STORE_ENUM](state, { enumber, key }) {
    enumberStore[key] = enumber;
  }
};
export default mutations;
