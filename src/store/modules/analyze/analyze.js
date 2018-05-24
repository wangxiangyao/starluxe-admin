import api from "@/api";
import { deepCopy } from "@/lib/tool.js";
import {
  STORE,
  LOADING,
  CHANGE_FILTER,
  EMPTY_FILTER_ONE,
  EMPTY_FILTER,
  CHANGE_MODULE
} from "./mutatison-type";

export default {
  namespaced: true,
  state() {
    return {
      current: "member",
      member: {
        isLoading: false,
        data: {
          allRegister: 155,
          allWxRegister: 140,
          allMobileRegister: 15,
          allOrders: 5,
          allOrdersPeriod: 2,
          days: {
            "1527145456000": {
              register: 10,
              wxRegister: 5,
              mobileRegister: 5,
              orders: 1,
              ordersPeriod: 1
            },
            "1527059056000": {
              register: 10,
              wxRegister: 5,
              mobileRegister: 5,
              orders: 1,
              ordersPeriod: 1
            },
            "1526972656000": {
              register: 10,
              wxRegister: 5,
              mobileRegister: 5,
              orders: 1,
              ordersPeriod: 1
            }
          }
        },
        filterMap: {
          /**
           * 每一项：
           * - type表示输入类型
           * - kind表示此过滤项对应的组件类别
           * - text 表示此项的中文描述
           * - value 是过滤项的值
           * - isEnum 表示是否为枚举值，如果是枚举值
           *  - enum，是枚举值的各个值：val表示值，text表示中文描述
           */
          channel: {
            type: "String",
            value: "",
            text: "渠道",
            isEnum: false,
            kind: "input"
          },
          invitationCode: {
            type: "String",
            value: "",
            text: "邀请码",
            isEnum: false,
            kind: "input"
          },
          memberType: {
            type: "String",
            value: "",
            text: "用户类型",
            isEnum: true,
            enum: [], // 监听STORE_ENUM_BRANDS获得具体数据
            key: "memberType",
            kind: "select"
          },
          detailDays: {
            type: "String",
            value: "",
            text: "细化天数",
            isEnum: false,
            kind: "input"
          },
          timeRange: {
            type: "Array",
            value: [],
            isEnum: false,
            text: "起止时间",
            kind: "datePicker"
          }
        },
        dataMap: {}
      }
    };
  },
  getters: {
    data(state) {
      const { current } = state;
      return state[current].data;
    },
    isLoading(state) {
      const { current } = state;
      return state[current].isLoading;
    },
    filterConfig: (state, getters, rootState) => {
      // 同样，需要根据权限地图，获得当卡用户可用的过滤项
      /**
       * 关于过滤项策略：
       *  过滤统一保存在filterMap中
       *  filterConfig用于根据权限地图选择过滤项
       *  提交过滤时候（下边的pureFilterConfig），通过遍历filterConfig，判断value，如果是空，就不传递此过滤项
       *    空值判断
       *      - String：空字符串
       *      - Array：空数组
       */
      const { current } = state;
      const obj = JSON.parse(JSON.stringify(state[current].filterMap));
      for (const value of Object.values(obj)) {
        if (value.isEnum) {
          console.log(`在module：${name}检测到枚举值`);
          value.enum = rootState.enumber[value.key];
        }
      }
      return obj;
    },
    pureFilterConfig: (state, getters) => {
      const c = {};
      for (const [key, value] of Object.entries(getters.filterConfig)) {
        if (value.value !== "" && value.value.length !== 0) {
          if (Array.isArray(value.value)) {
            //  对于数组，判断是否所有项都为空值项，如果不是，再添加进有效配置项
            const arr = value.value.filter(item => {
              return item !== "";
            });
            if (arr.length !== 0) {
              c[key] = `${value.value.join(",")}`;
            }
          } else {
            c[key] = value.value;
          }
        }
      }
      return c;
    },
    dataMap: state => {
      // 根据权限地图，返回dataMap
      return state.dataMap;
    }
  },
  actions: {
    init({ commit }, name) {
      commit(CHANGE_MODULE, name);
    },
    getAnalyze({ state, getters, commit }) {
      console.log("请求analyze:", state.current);
      const { pureFilterConfig } = getters;
      commit(LOADING, { type: 0 });

      api
        .getAnalyze(state.current, { ...pureFilterConfig })
        .then(res => {
          console.log("数据分析——响应:", res);
          if (res.data.code === 200) {
            commit(STORE, res.data.data);
          } else {
            throw new Error("没有权限");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeFilter({ dispatch, commit }, { type = "all", data = {} } = {}) {
      /**
       * 只要改变了过滤条件，则直接触发重新获取数据（不用判断销毁状态）
       */
      /**
       * type: all empty-one empty-all
       */
      if (type === "all") {
        commit(CHANGE_FILTER, data);
      } else if (type === "empty-one") {
        commit(EMPTY_FILTER_ONE, data);
      } else if (type === "empty-all") {
        // TODO: 看情况，还没有做
        commit(EMPTY_FILTER);
      }
      dispatch("getAnalyze");
    },
    refresh({ dispatch }) {
      dispatch("getAnalyze");
    }
  },
  mutations: {
    [CHANGE_MODULE](state, name) {
      if (state[name]) {
        state.current = name;
      } else {
        throw new Error("analyze: 不存在的模块");
      }
    },
    [STORE](state, data) {
      const { current } = state;
      state[current].data = data;
      state[current].isLoading = false;
    },
    [LOADING](state) {
      const { current } = state;
      state[current].isLoading = true;
    },
    [EMPTY_FILTER_ONE](state, name) {
      // 根据type判断空值类型
      const { current } = state;
      const config = state[current].filterMap[name];
      const type = config.type;
      switch (type) {
        case "String":
          config.value = "";
          break;
        case "Array":
          config.value = [];
          break;
        default:
      }
    },
    [CHANGE_FILTER](state, data) {
      // 批量更改，直接覆盖
      const { current } = state;
      state[current].filterMap = Object.assign(
        {},
        state[current].filterMap,
        deepCopy(data)
      );
    }
  }
};
