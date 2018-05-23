// list类module通用的一些设置
/**
 * list通用Module，通过传入config，传出一个完整Module
 * config:
 * - 必传字段
 *  listActivityTimeBucket: 活性时长，时间戳
 *  name: 当前module名字，用于调用api时候传递，生成新的list时候，需要在api下边添加新的路由
 *  state:
 *    filterMap
 *    dataMap
 */
/**
 * 可选扩展字段: extend 策略：
 * extend：包含list的state, actions, mutations等字段。
 * 对于，actions,mutations,Getters等字段，在各个字段对应下的方法将根据规则扩展到对应位置。
 * 对于state, 将会覆盖（TODO: 具体规则）
 */
/**
 * filterMap说明：
 * 每一项：
 * - type表示输入类型
 * - kind表示此过滤项对应的组件类别
 * - text 表示此项的中文描述
 * - value 是过滤项的值
 * - isEnum 表示是否为枚举值，如果是枚举值
 *  - enum，是枚举值的各个值：val表示值，text表示中文描述
 */

import * as TYPE from './mutatison-type';
import api from '@/api';
import { deepCopy } from '@/lib/tool.js';
import { isNeedDestroy, normalise } from './tool.js';

export default function initListModule(config = {}) {
  const LIST_ACTIVITY_TIME_BUCKET = config.listActivityTimeBucket;
  const { name, state, getters, actions, mutations } = config;

  const extend = {
    state: {},
    getters: {},
    actions: {},
    mutations: {},
    ...config.extend
  };

  return {
    namespaced: true,
    state() {
      return {
        /**
         * 策略：以页为单位，记录所有存储的项的id到all中。
         *  - 查询条件不变
         *    - 当请求某一页，判断数据是否需要被销毁（needDestroy）
         *      - 如果是，清空byPage all amount pageSum page next pre。
         *      - 否，判断byPage中是否有此页，如果没有，重新向后端请求此页。
         *  - 查询条件改变
         *    - 设置需要销毁
         */
        byPage: {},
        all: [],
        amount: 0, // 总数
        limit: 12,
        pageSum: 0, // 总页数
        page: 1,
        next: 2,
        pre: 1,
        isLoading: false,
        needDestroy: false,
        lastUpdate: 0,
        remind: {
          // TODO: 局部的消息提示，这一块再设计一下,暂时用不到
          type: '',
          message: '',
        },
        /**
         * dataMap: 当前list的table项，包括，详情，列表预览，所有可能的table字段
         *  - tableColumn 列表预览的配置
         *    - show 列表预览表头
         *    - extend 列表展开form
         *  - detail 详情页的form配置
         */
        dataMap: {},
        filterMap: {},
        ...state,
      };
    },
    getters: {
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
        const obj = JSON.parse(JSON.stringify(state.filterMap));
        for (const [key, value] of Object.entries(obj)) {
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
          if (value.value !== '' && value.value.length !== 0) {
            if (Array.isArray(value.value)) {
              //  对于数组，判断是否所有项都为空值项，如果不是，再添加进有效配置项
              const arr = value.value.filter(item => {
                return item !== '';
              });
              if (arr.length !== 0) {
                c[key] = `${value.value.join(',')}`;
              }
            } else {
              c[key] = value.value;
            }
          }
        }
        return c;
      },
      tableColumn: (state, getters) => {
        // 根据全局的权限地图，由state.tableColumn计算出当前用户可用的tableColumn
        // TODO: 关于计算函数，应当抽象出来
        // 目前的话，先直接返回列数据
        return getters.dataMap.tableColumn;
      },
      detail: (state, getters) => {
        return getters.dataMap.detail;
      },
      dataMap: state => {
        // 根据权限地图，返回dataMap
        return state.dataMap;
      },
      ...getters
    },
    actions: {
      getListIfNeed({ state, dispatch, commit }) {
        // 根据缓存情况，判断是否请求数据
        if (isNeedDestroy({ state, commit }, { type: 1, page: state.page, LIST_ACTIVITY_TIME_BUCKET })) {
          dispatch('getList');
        }
      },
      getList({ state, getters, commit }) {
        console.log('请求list:', name);
        const { pureFilterConfig } = getters;
        const { page, limit } = state;
        const { getList } = extend.actions;
        commit(TYPE.LOADING, { type: 0 });
        api.getList(name, {
          ...pureFilterConfig,
          page,
          limit
        })
          .then(res => {
            console.log('用户列表请求响应:', res);
            if (getList) {
              res = getList(res);
            }
            if (res.status === 200) {
              commit(TYPE.STORE, res.data);
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      changePage({ dispatch, commit }, page) {
        commit(TYPE.CHANGE_PAGE, page);
        dispatch('getListIfNeed');
      },
      changeFilter({ dispatch, commit }, { type = 'all', data = {} } = {}) {
        /**
         * 只要改变了过滤条件，则直接触发重新获取数据（不用判断销毁状态）
         */
        /**
         * type: all empty-one empty-all
         */
        if (type === 'all') {
          commit(TYPE.CHANGE_FILTER, data);
        } else if (type === 'empty-one') {
          commit(TYPE.EMPTY_FILTER_ONE, data);
        } else if (type === 'empty-all') {
          // TODO: 看情况，还没有做
          commit(TYPE.EMPTY_FILTER);
        }
        commit(TYPE.DESTORY, { type: 0 });
        dispatch('getList');
      },
      refresh({ dispatch, commit }) {
        commit(TYPE.DESTORY, { type: 0 });
        dispatch('getList');
      },
      ...actions
    },
    mutations: {
      [TYPE.STORE](state, { count, list }) {
        const { byPage, page, limit } = state;
        const result = normalise(list, 'id');
        // 为每一页，添加 是否销毁，isLoading，lastUpdate
        byPage[page] = {
          item: result.data,
          isLoading: false,
          needDestroy: false,
          lastUpdate: +new Date(),
        };
        result.all.forEach((item) => {
          if (!state.all.includes(item)) {
            state.all.push(item);
          }
        });
        state.amount = count;
        state.pageSum = Math.ceil(count / limit);
        state.needDestroy = false;
        state.isLoading = false;
        state.lastUpdate = +new Date();
      },
      [TYPE.CHANGE_PAGE](state, page) {
        let next = page + 1;
        let pre = page - 1;
        // 虽然再界面上，会做上一页，下一页的置灰处理，但是数据也要设置正确
        if (next > state.count) {
          next = state.count;
        }
        if (pre < 1) {
          pre = 1;
        }
        state.page = page;
        state.next = next;
        state.pre = pre;
      },
      [TYPE.DESTORY](state, what) {
        /**
         * what: 销毁那一部分数据
         *  - @type: 0
         *  - @type: 1
         *    - @page: '要销毁的页码'
         *  - @type: 2
         *    - @id: '要销毁的member的id'，
         *    - @page: '此member所在page'
         */
        const { type } = what;
        switch (type) {
          case 0:
            state.byPage = {};
            state.all = [];
            state.page = 1;
            state.next = 2;
            state.pre = 1;
            break;
          case 1:
            state.byPage[what.page].forEach((item) => {
              state.all.splice(state.all.includes(item), 1);
            });
            delete state.byPage[what.page];
            break;
          case 2:
            delete state.byPage[what.page][what.id];
            state.all.splice(state.all.includes(what.id));
            break;
          default:
            throw new Error('不存在的销毁类型。');
        }
      },
      [TYPE.LOADING](state, what) {
        // 规则同上
        const { type } = what;
        switch (type) {
          case 0:
            state.isLoading = true;
            break;
          case 1:
            state.byPage[what.page].isLoading = true;
            break;
          case 2:
            state.byPage[what.page][what.id].isLoading = true;
            break;
          default:
            throw new Error('不存在的loading类型。');
        }
      },
      [TYPE.EMPTY_FILTER_ONE](state, name) {
        // 根据type判断空值类型
        const config = state.filterMap[name];
        const type = config.type;
        switch (type) {
          case 'String':
            config.value = '';
            break;
          case 'Array':
            config.value = [];
            break;
          default:
        }
      },
      [TYPE.CHANGE_FILTER](state, data) {
        // 批量更改，直接覆盖
        state.filterMap = Object.assign({}, state.filterMap, deepCopy(data));
      },
      ...mutations
    }
  };
}