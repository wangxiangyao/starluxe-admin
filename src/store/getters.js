"use strict";

import { getByPermission } from "./common/tool";

const getters = {
  menu(state) {
    // TODO: 根据权限地图，获取当前用户可用菜单
    if (state.user.isLoading) {
      return state.menu.item;
    }
    return getByPermission(state.menu.item, state.user.permissionMap);
  }
};

export default getters;
