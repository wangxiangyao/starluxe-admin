import init from "../../common/list";

const commodityModule = init({
  name: "commodity",
  listActivityTimeBucket: 1 * 60 * 60 * 1000,
  state: {
    // 外边: 商品id,商品货号,品牌，商品信息系列，品牌英文，颜色，租赁价格，星级，市场价，库存数量，商品状态，
    // 里边：类别，
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
      commodityId: {
        type: "String",
        value: "",
        text: "商品id",
        isEnum: false,
        kind: "input"
      },
      commodityNo: {
        type: "String",
        value: "",
        text: "商品货号",
        isEnum: false,
        kind: "input"
      },
      commodityName: {
        type: "String",
        value: "",
        text: "商品名称",
        isEnum: false,
        kind: "input"
      },
      series: {
        type: "String",
        value: "",
        text: "系列",
        isEnum: false,
        kind: "input"
      },
      model: {
        type: "String",
        value: "",
        text: "型号",
        isEnum: false,
        kind: "input"
      },
      commodityBrandId: {
        type: "String",
        value: "",
        text: "品牌",
        isEnum: true,
        enum: [], // 监听STORE_ENUM_BRANDS获得具体数据
        key: "brands",
        kind: "select",
        filterable: true
      },
      freezedQuota: {
        type: "String",
        value: "",
        text: "所需额度",
        isEnum: true,
        kind: "select",
        key: "freezedQuota",
        enum: []
      },
      commodityCategoryId: {
        type: "String",
        value: "",
        text: "商品类别",
        isEnum: true,
        kind: "select",
        key: "commodityCategory",
        enum: []
      },
      rentPriceRange: {
        type: "String",
        value: [],
        text: "租赁价格区间",
        isEnum: false,
        kind: "numberRange"
      },
      marketPriceRange: {
        type: "String",
        value: [],
        text: "市场价格区间",
        isEnum: false,
        kind: "numberRange"
      }
    },
    dataMap: {
      tableColumn: {
        show: [
          // 所有的可显示列，服务端渲染进来
          {
            label: "商品ID",
            prop: "id",
            fixed: true,
            width: "70"
          },
          {
            label: "商品货号",
            prop: "no",
            fixed: true,
            width: "100"
          },
          {
            label: "状态",
            prop: "publishFlag",
            fixed: true,
            width: "50"
          },
          {
            label: "缩略图"
          },
          {
            label: "商品名称",
            prop: "name",
            width: "200"
          },
          {
            label: "品牌",
            prop: "commodityBrandNameEn",
            width: "150"
          },
          {
            label: "所属系列",
            prop: "series",
            width: "120"
          },
          {
            label: "型号",
            prop: "model",
            width: "50"
          },
          {
            label: "颜色",
            prop: "color",
            width: 70
          },
          {
            label: "市场价",
            prop: "marketPrice",
            width: "90"
          },
          {
            label: "租赁价",
            prop: "price",
            width: "110"
          },
          {
            label: "星级",
            prop: "freezedQuota",
            width: "50"
          },
          {
            label: "总余量",
            prop: "totalDiffQuantity",
            width: "70"
          }
        ],
        extend: []
      },
      detail: {}
    }
  },
  extend: {
    actions: {
      getList(res) {
        console.log("commodity对res扩展");
        /**
         * 1. 租赁价：price
         *    由`${rentPrice} / ${rentCycleName}` 拼接而成
         * 2. 缩略图
         */
        const list = res.data.data.list.map(item => {
          const { rentPrice, rentCycleName } = item;

          item.price = `${rentPrice} / ${rentCycleName}`;
          return item;
        });
        res.data.data.list = list;
        return res;
      }
    }
  }
});
export default commodityModule;
