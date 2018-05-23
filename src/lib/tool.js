export const deepCopy = (origin, deep) => {
  // 当前是无限拷贝
  // TODO: 加入控制层级的参数，默认值为0
  deep = deep === undefined ? -1 : deep;
  let data;
  if (typeof origin === "object") {
    // 判断深度，如果为0，结束迭代
    if (deep === 0) {
      data = origin;
    } else {
      deep--;
      if (Array.isArray(origin)) {
        data = [];
        for (let i = 0, len = origin.length; i < len; i++) {
          data[i] = deepCopy(origin[i], deep);
        }
      } else {
        data = {};
        for (const [key, value] of Object.entries(origin)) {
          data[key] = deepCopy(value, deep);
        }
      }
    }
  } else {
    data = origin;
  }
  return data;
};
