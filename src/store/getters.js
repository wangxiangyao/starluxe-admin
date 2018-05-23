'use strict';


const getters = {
  menu(state) {
    // TODO: 根据权限地图，获取当前用户可用菜单
    return state.menu;
  }
};

export default getters;