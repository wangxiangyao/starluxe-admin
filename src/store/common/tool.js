// store中常用到的一些工具函数
import * as TYPE from "./mutatison-type";
import reflection from "../reflection";

export const normalise = (arr, by = "id") => {
  /**
   * @by: 根据arr中项的哪一个字段范式化
   * @arr: 数据数组
   *  - 如果没有by字段，报错
   *  - 如果有by：
   *    将by保存进数据
   * 对每一个有效项：应添加 是否销毁，isLoading，hasMore，lastUpdate
   * 确保数据的唯一性，不会有重复数据存在
   */
  const obj = {};
  const all = [];
  arr.forEach(item => {
    if (item.hasOwnProperty(by)) {
      const key = item[by];
      if (by === "id") {
        if (!all.includes(key)) {
          // 添加额外状态项
          obj[key] = {
            ...item,
            hasMore: true,
            isLoading: false,
            needDestroy: false,
            lastUpdate: +new Date()
          };
          all.push(key);
        }
      } else {
        obj[key] = {
          ...item,
          hasMore: true,
          isLoading: false,
          needDestroy: false,
          lastUpdate: +new Date()
        };
      }
    } else {
      throw new Error(`范式化的数据，没有${by}，无法执行范式化`);
    }
  });
  return {
    data: obj,
    all
  };
};

export const isNeedDestroy = (
  { state, commit },
  { type = 0, page, id, LIST_ACTIVITY_TIME_BUCKET = 0 } = {}
) => {
  /**
   * @type: 销毁级别;
   * @page: 销毁页码
   * @id: 销毁具体id
   * @LIST_ACTIVITY_TIME_BUCKET: 活性持续时长
   */
  /**
   * level: 表示要检查销毁标志的层级。all表示最外层，默认为true
   *  - 0: all: Boolean
   *  - 1: { page }
   *  - 2: { page, id }
   *        * currentType: 函数递归时候使用的标志量，不需要外部传递
   */
  /**
   * 1. 首先，判断module级别的销毁标志
   *  - 若不销毁，判断是否超过活性期间
   *    - 若不超过，检查level级别，判断是否深入检查
   *      - 若是：重复以上步骤
   *      - 若否，返回False
   *    - 若超过，派发对应销毁mutation，返回True
   *  - 若销毁，返回True
   */
  const now = +new Date();
  // 循环变量
  let ctx = state; // 当前级别的module
  let currentType = 0;
  for (;;) {
    const { needDestroy, lastUpdate } = ctx;
    if (needDestroy === undefined) {
      // 如果没有定义needDestroy表示需要请求
      return true;
    }
    if (!needDestroy) {
      if (now < lastUpdate + LIST_ACTIVITY_TIME_BUCKET) {
        currentType++;
        if (currentType <= type) {
          // 这里，如果有特殊之处，需要手动改
          if (type === 1) {
            console.log("需要检查某个页面", page, state.byPage[page]);
            if (state.byPage[page] === undefined) {
              // 如果没有此页，表示需要请求
              return true;
            }
            ctx = state.byPage[page];
          }
          if (type === 2) {
            ctx = ctx.byPage[page][id];
          }
          continue;
        } else {
          console.log("不需要销毁");
          return false;
        }
      } else {
        // 如果数据超期，不具有活性
        commit(TYPE.DESTORY, {
          type: 0
        });
        console.log("数据超过活性期限，销毁");
        return true;
      }
    } else {
      console.log("销毁标记为true, 销毁");
      return true;
    }
  }
};

export const getByPermission = (all, permissionMap) => {
  // 判断all是不是对象如果是，判断是不是数组
  // 如果是数组，递归调用
  // 如果是对象，找对象中的key字段，如果没有，报错（必须有key）,
  //  找到key之后，去reflection中找映射，找到后，去permissionMap中
  /**
   * - 判断是否为对象
   *    - 是，判断是否为数组
   *      - 是，递归调用自身
   *      - 否，判断是否含有key字段,且为字符串
   *        - 是，查找reflection是否有此字段
   *          - 是，根据reflection，查找permissionMap是否有对应权限
   *            - 是，记录obj，判断是否有sub字段
   *              - 是，递归调用自身
   *              - 否，返回obj
   *            - 否，不返回此obj
   *          - 否，默认拥有权限，返回此obj
   *        - 否，报错，必须有有效key
   *    - 否，判断是否为字符串
   *      - 是，默认此字符串为key，执行查找逻辑
   *      - 否，报错（无效的参数）
   */
  const type = typeof all;
  let result;
  if (type === "object") {
    if (Array.isArray(all)) {
      result = all.filter(v => {
        return getByPermission(v, permissionMap);
      });
    } else {
      let key = all.key;
      if (key && typeof key === "string") {
        // console.log("存在有效key：", key);
        if (checkPermission(key, permissionMap)) {
          console.log("通过权限检查", key);
          result = all;
          if (all.sub) {
            result.sub = all.sub.filter(v => {
              return getByPermission(v, permissionMap);
            });
          }
          return result;
        } else {
          return null;
        }
      } else {
        throw new Error("应包含有效key值");
      }
    }
  } else {
    if (type === "string") {
      // 调用查询拿一套
      if (checkPermission(all, permissionMap)) {
        return true;
      } else {
        return false;
      }
    } else {
      throw new Error("请输入有效的参数");
    }
  }
  return result;
};

function checkPermission(key, permissionMap) {
  if (reflection[key] === undefined) {
    return true;
  }
  const { name, permissionName } = reflection[key];
  if (permissionMap[name]) {
    if (permissionMap[name][permissionName]) {
      return true;
    }
  }
  return false;
}
