/**
 * 静态枚举值，从这个文档获取，动态枚举值，获取后，保存再store.enumber中。
 * 在各个module中，如果需要使用枚举，需从getters中，自行获取全局的enumber。
 * 对于枚举字段，需表明其isEnum，key
 */

export default {
  activeFlah: [
    {
      val: "NO",
      text: "无效"
    },
    {
      val: "YES",
      text: "有效"
    }
  ],
  sex: [
    {
      val: "MALE",
      text: "男"
    },
    {
      val: "FEMALE",
      text: "女"
    }
  ],
  realNameAuthStatus: [
    {
      val: "NO_AUTH",
      text: "未认证"
    },
    {
      val: "IN_AUTH",
      text: "认证中"
    },
    {
      val: "AUTH_SUCCESS",
      text: "认证成功"
    },
    {
      val: "AUTH_FAIL",
      text: "认证失败"
    }
  ],
  memberType: [
    {
      val: "COMMON",
      text: "普通会员"
    },
    {
      val: "EXPERIENCE",
      text: "体验卡会员"
    },
    {
      val: "TWO_STAR",
      text: "双星卡会员"
    },
    {
      val: "FOUR_STAR",
      text: "四星卡会员"
    },
    {
      val: "SIX_STAR",
      text: "六星卡会员"
    }
  ],
  periodCardHoldFlag: [
    {
      val: "YES",
      text: "持有"
    },
    {
      val: "NO",
      text: "未持有"
    }
  ],
  brands: [],
  rentMethod: [
    {
      val: "RENT_BY_PERIOD_CARD",
      text: "包期卡租赁"
    },
    {
      val: "RENT_BY_DEPOSIT",
      text: "押金租赁"
    }
  ],
  orderStatus: [
    {
      val: "NEW_PURCHASE_WAIT_PAY",
      text: "新订单待付款"
    },
    {
      val: "PAYED_AND_PREPARING",
      text: "准备中"
    },
    {
      val: "PREPARED_AND_DISPATCHING",
      text: "派送中"
    },
    {
      val: "RECEIVED_AND_SIGNED",
      text: "已签收"
    },
    {
      val: "LEASE_TIMEOUT",
      text: "租期超时"
    },
    {
      val: "RESERVED_FOR_RETURN",
      text: "已预约还货"
    },
    {
      val: "RETURN_ON_THE_WAY",
      text: "返仓中"
    },
    {
      val: "WAIT_COMPENSATE",
      text: "待赔付"
    },
    {
      val: "RETURNED_AND_SUCCESS",
      text: "交易成功"
    },
    {
      val: "CANCELED",
      text: "已取消"
    },
    {
      val: "PAY_TIMEOUT",
      text: "超时未支付"
    }
  ],
  freezedQuota: [
    {
      val: "1",
      text: "一星"
    },
    {
      val: "2",
      text: "二星"
    },
    {
      val: "3",
      text: "三星"
    },
    {
      val: "4",
      text: "四星"
    },
    {
      val: "5",
      text: "五星"
    },
    {
      val: "6",
      text: "六星"
    }
  ]
};
