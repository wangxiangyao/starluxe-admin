import init from "../../common/list";
import moment from "moment";

const orderModule = init({
  name: "order",
  listActivityTimeBucket: 1 * 60 * 60 * 1000,
  state: {
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
      id: {
        type: "String",
        value: "",
        text: "订单ID",
        isEnum: false,
        kind: "input"
      },
      purchaseNo: {
        type: "String",
        value: "",
        text: "订单编号",
        isEnum: false,
        kind: "input"
      },
      receiveMobile: {
        type: "String",
        value: "",
        text: "收货电话",
        isEnum: false,
        kind: "input"
      },
      returnMobile: {
        type: "String",
        value: "",
        text: "还货电话",
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
      commodityNo: {
        type: "String",
        value: "",
        text: "货号",
        isEnum: false,
        kind: "input"
      },
      userRealName: {
        type: "String",
        value: "",
        text: "下单用户真实姓名",
        isEnum: false,
        kind: "input"
      },
      rentMethod: {
        type: "String",
        value: "",
        text: "租赁方式",
        isEnum: true,
        enum: [],
        key: "rentMethod",
        kind: "radio"
      },
      status: {
        type: "String",
        value: "",
        text: "订单状态",
        isEnum: true,
        enum: [],
        key: "orderStatus",
        kind: "select"
      },
      createTime: {
        type: "Array",
        value: [],
        isEnum: false,
        text: "下单区间",
        kind: "datePicker"
      },
      rentTime: {
        type: "Array",
        value: [],
        isEnum: false,
        text: "租赁区间",
        kind: "datePicker"
      },
      appointmentReceiveTime: {
        type: "Array",
        value: [],
        isEnum: false,
        text: "预约取货区间",
        kind: "datePicker"
      },
      appointmentReturnTime: {
        type: "Array",
        value: [],
        isEnum: false,
        text: "预约还货区间",
        kind: "datePicker"
      }
    },
    dataMap: {
      tableColumn: {
        // show: 三个id，租赁方式，支付租金，总支付金额，抱起卡id，订单状态，商品星级，收货/还货 ：日期，时间，城市，区，姓名，手机号
        // extend: 货号 租赁周期，还货/收获地址详情，订单编号，商品品牌，名称
        show: [
          // 所有的可显示列，服务端渲染进来
          {
            label: "订单ID",
            prop: "id",
            width: "70",
            fixed: true
          },
          {
            label: "下单用户ID",
            prop: "userId"
          },
          {
            label: "商品ID",
            prop: "commodityId",
            width: "70"
          },
          {
            label: "用户昵称",
            prop: "userNickName",
            width: "120"
          },
          {
            label: "订单状态",
            prop: "statusName"
          },
          {
            label: "租赁方式",
            prop: "rentMethodName"
          },
          {
            label: "租赁周期",
            prop: "rent"
          },
          {
            label: "支付租金",
            prop: "payRentAmount"
          },
          {
            label: "支付总金额",
            prop: "payTotalAmount"
          },
          {
            label: "包期卡ID",
            prop: "userPeriodCardId",
            width: "80"
          },
          {
            label: "商品星级",
            prop: "freezedQuota",
            width: "80"
          },
          {
            label: "收货相关",
            sub: [
              {
                label: "收货日期",
                prop: "receiveDate"
              },
              {
                label: "时间",
                prop: "receiveTime",
                width: "120"
              },
              {
                label: "城市",
                prop: "receiveAreaParentCommonAreaName"
              },
              {
                label: "县/区",
                prop: "receiveAreaCommonAreaName"
              },
              {
                label: "姓名",
                prop: "receiveName"
              },
              {
                label: "电话",
                prop: "receiveMobile",
                width: "120"
              }
            ]
          },
          {
            label: "还货相关",
            sub: [
              {
                label: "还货日期",
                prop: "returnDate"
              },
              {
                label: "时间",
                prop: "returnTime",
                width: "120"
              },
              {
                label: "城市",
                prop: "returnAreaParentCommonAreaName"
              },
              {
                label: "县/区",
                prop: "returnAreaCommonAreaName"
              },
              {
                label: "姓名",
                prop: "returnName"
              },
              {
                label: "电话",
                prop: "returnMobile",
                width: "120"
              }
            ]
          }
        ],
        extend: [
          {
            label: "订单编号",
            prop: "purchaseNo"
          },
          {
            label: "商品货号",
            prop: "commodityNo"
          },
          {
            label: "商品名称",
            prop: "commodityName"
          },
          {
            label: "订单支付详情",
            prop: "purchaseList",
            sub: [
              {
                label: "支付流水号",
                prop: "payTradeNo",
                width: "270"
              },
              {
                label: "支付渠道",
                prop: "payChannelName"
              }
            ]
          }
        ]
      },
      detail: {}
    }
  },
  extend: {
    actions: {
      getList(res) {
        console.log("order对res扩展");
        /**
         * 1. 租赁周期：rent
         *    由`${rentCycleNumber}${rentCycleName}` 拼接而成
         * 2. 收货/还货日期 与 收货/还货时间
         *  不管收货还是还货，开始/结束，都是两个字段，现在需要把每个字段解析为两个字段（日期和时间），将日期放在一列，时间放在一列
         *   具体字段：
         *    - 收货日期：receiveDate
         *    - 收货时间：receiveTime: []
         *    - 还货日期: returnDate
         *    - 还货时间: returnTime: []
         */
        const list = res.data.data.list.map(item => {
          const {
            purchaseDetailList,
            rentCycleName,
            appointmentReceiveStartDatetime,
            appointmentReceiveEndDatetime,
            appointmentReturnStartDatetime,
            appointmentReturnEndDatetime
          } = item;

          // 对purchaseDetailList进行处理，得到租赁总周期，每次租赁的流水号，支付渠道
          let number = 0;
          item.purchaseList = purchaseDetailList.map(item => {
            const { rentCycleNumber, payTradeNo, payChannelName } = item;
            number += rentCycleNumber;
            return {
              payTradeNo,
              payChannelName
            };
          });

          // 合并rent
          item.rent = number ? `${number} ${rentCycleName}` : "";

          // 计算收货/还货日期 和 时间
          const receiveStart = moment(appointmentReceiveStartDatetime);
          const receiveEnd = moment(appointmentReceiveEndDatetime);
          const returnStart = moment(appointmentReturnStartDatetime);
          const returnEnd = moment(appointmentReturnEndDatetime);

          item.receiveDate = receiveStart.format("YYYY-M-D");
          item.receiveTime = `${receiveStart.format(
            "HH:mm"
          )} 至 ${receiveEnd.format("HH:mm")}`;
          item.returnDate = returnStart.format("YYYY-M-D");
          item.returnTime = `${returnStart.format(
            "HH:mm"
          )} 至 ${returnEnd.format("HH:mm")}`;

          return item;
        });
        res.data.data.list = list;
        return res;
      }
    }
  }
});
export default orderModule;
