<template>
  <div id="analyze-member">
    <loading v-if="isLoading"/>
    <div class="afterLoading" v-else>
      <div class="filter-wrapper">
        <filtration :filterProps="filterConfig" :config="pureFilterConfig"
          @closeTag="handleEmptyFilterOne"
          @filter="handleFilter"
        />
      </div>
      <div class="analyze-data">
        <div class="analyze-all">
          {{`总注册量: ${data.allRegister}`}}
          {{`总下单用户量: ${data.allOrders}`}}
          {{`总购卡用户量: ${data.allOrdersPeriod}`}}
        </div>
        <div class="analyze-echart" ref="echarts"></div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
import { mapActions, mapGetters } from "vuex";
import filtration from "@/components/filter/filter.vue";
import loading from "@/components/loading/loading.vue";
import echarts from "echarts/lib/echarts";
import moment from "moment";
require("echarts/lib/chart/bar");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/toolbox");
require("echarts/lib/chart/line");
require("echarts/lib/component/legend");
require("echarts/lib/component/markPoint");
require("echarts/lib/component/markLine");

export default {
  name: "analyze-member",
  components: {
    filtration,
    loading
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("analyze", [
      "isLoading",
      "data",
      "filterConfig",
      "pureFilterConfig"
    ])
  },
  created() {
    this.init("member");
    this.getAnalyze("member");
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.isLoading) {
        this.initEcharts();
      }
    });
  },
  updated() {
    this.$nextTick(() => {
      if (!this.isLoading) {
        this.initEcharts();
      }
    });
  },
  methods: {
    ...mapActions("analyze", ["getAnalyze", "init", "changeFilter"]),
    handleEmptyFilterOne(name) {
      console.log("清空一个过滤项：", name);
      this.changeFilter({
        type: "empty-one",
        data: name
      });
    },
    handleFilter(filter) {
      this.changeFilter({
        type: "all",
        data: filter
      });
    },
    initEcharts() {
      const myChart = echarts.init(this.$refs.echarts);
      const option = this.__formatEchartOption();
      console.log("图标配置", option);
      myChart.setOption({
        title: {
          text: "市场——用户分析"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: option.legendData
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: option.xAxis
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: option.series
      });
      window.onresize = function() {
        myChart.resize();
      };
    },
    __formatEchartOption() {
      const { data } = this;
      const a = {
        register: {
          text: "注册量",
          data: []
        },
        wxRegister: {
          text: "仅微信注册",
          data: []
        },
        mobileRegister: {
          text: "仅手机注册",
          data: []
        },
        orders: {
          text: "下单量",
          data: []
        },
        ordersPeriod: {
          text: "购卡用户量",
          data: []
        }
      };
      const obj = {
        legendData: [],
        xAxis: [],
        series: []
      };
      // 设置x轴,以及每个x坐标点上的数据
      for (let [key, value] of Object.entries(data.days)) {
        const dayMoment = moment(Number(key));
        const day = dayMoment.format("YYYY-M-D");
        obj.xAxis.push(day);
        for (let [name, data] of Object.entries(a)) {
          data.data.push(value[name]);
        }
      }
      // obj.xAxis.push("总计");
      // a.register.data.push(data.allRegister);
      // a.wxRegister.data.push(data.allWxRegister);
      // a.orders.data.push(data.allOrders);
      // a.mobileRegister.data.push(data.allMobileRegister);
      // a.ordersPeriod.data.push(data.allOrdersPeriod);
      // 设置具体的图例，与系列
      for (let value of Object.values(a)) {
        obj.legendData.push(value.text);
        obj.series.push({
          name: value.text,
          type: "bar",
          data: value.data,
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" }
            ]
          },
          markLine: {
            data: [{ type: "average", name: "平均值" }]
          }
        });
      }
      return obj;
    }
  }
};
</script>
<style scoped>
#analyze-member {
  width: 100%;
  height: 100%;
}
.afterLoading {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.analyze-data {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: auto;
  padding: 10px;
  background-color: #fff;
}
.analyze-all {
  flex: none;
  width: 100%;
  padding: 20px;
}
.analyze-echart {
  flex: 1;
}
</style>
