import axios from "axios";

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
    // 在进入登录成功时候，初始化token，用于之后的各种请求
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
