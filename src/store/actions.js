"use strict";

import api from "@/api";

import { STORE_BRANDS, STORE_ENUM } from "./mutation-type";

const actions = {
  getBrands({ commit }) {
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
