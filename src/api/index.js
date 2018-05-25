import axios from "axios";
// TODO: 这里要从store里边获取到token
// 暂时先这样手写
axios.defaults.baseURL = process.env.VUE_APP_HOST + "/api/v1";
axios.defaults.headers.common.Authorization = "";

const listRouter = {
  member: "/user",
  order: "/purchase",
  commodity: "/commodity",
  brands: "/commodityBrand",
  commodityCategory: "/commodityCategory"
};

const analyzeRouter = {
  member: "/marketingReport"
};

export default {
  init(token) {
    axios.defaults.headers.common.Authorization = token;
  },
  async login({ account, password }) {
    return await axios.post("/login", {
      account,
      password
    });
  },
  async loginByToken({ id }) {
    return await axios.get(`/sysuser/${id}`);
  },
  getMemberList(config) {
    console.log("请求用户列表，配置项为：", config);
    return axios.get("/user", {
      params: {
        ...config
      }
    });
  },
  getList(name, config) {
    return axios.get(listRouter[name], {
      params: {
        ...config
      }
    });
  },
  async getAnalyze(name, config) {
    return await axios.get(analyzeRouter[name], {
      params: {
        ...config
      }
    });
  }
};
