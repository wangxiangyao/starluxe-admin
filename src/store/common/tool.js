// store中常用到的一些工具函数
import * as TYPE from './mutatison-type';

export const normalise = (arr, by) => {
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
  arr.forEach((item) => {
    if (item.hasOwnProperty('id')) {
      const id = item.id;
      if (!all.includes(id)) {
        // 添加额外状态项
        obj[item.id] = {
          ...item,
          hasMore: true,
          isLoading: false,
          needDestroy: false,
          lastUpdate: +new Date(),
        };
        all.push(id);
      }
    } else {
      throw new Error('范式化的数据，没有id，无法执行范式化');
    }
  });
  return {
    data: obj,
    all
  };
};

export const isNeedDestroy = ({ state, commit }, { type = 0, page, id, LIST_ACTIVITY_TIME_BUCKET = 0 } = {}) => {
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
  for (; ;) {
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
            console.log('需要检查某个页面', page, state.byPage[page]);
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
          console.log('不需要销毁');
          return false;
        }
      } else {
        // 如果数据超期，不具有活性
        commit(TYPE.DESTORY, {
          type: 0
        });
        console.log('数据超过活性期限，销毁');
        return true;
      }
    } else {
      console.log('销毁标记为true, 销毁');
      return true;
    }
  }
};
