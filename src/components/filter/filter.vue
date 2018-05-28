<template>
  <div class="filtration">
    <div class="pack-up" @click.self="handleToggleUnfold">
      <div class="showUnfold">
        <i class="el-icon-caret-bottom" @click.self="handleToggleUnfold"></i>
      </div>
      <el-tag
        :style="{marginRight: '10px'}"
        v-for="(value, key) in tagConfig"
        :key="key"
        size="mini"
        :closable="!filterProps[key].noClose"
        @close="handleEmptyOne(key)">
        {{`${filterProps[key].text}：${value}`}}
      </el-tag>
    </div>
    <div class="unfold" v-if="isUnfold">
      <div class="filter-items">
        <div class="item" 
          v-for="(filterItem, key) in filterItems"
          :key="key"
          >
          <el-input size="mini" v-if="filterItem.kind === 'input'" v-model="filterItem.value" clearable placeholder="请输入内容">
            <template slot="prepend">{{filterItem.text}}：</template>
          </el-input>
          <template v-else-if="filterItem.kind === 'radio'">
            <div class="label">{{filterItem.text}}：</div>
            <el-radio-group  v-model="filterItem.value" size="mini">
              <el-radio-button :label="''">不限</el-radio-button>
              <el-radio-button v-for="option in filterItem.enum" :key="option.val" :label="option.val">{{option.text}}</el-radio-button>
            </el-radio-group>
          </template>
          <template v-else-if="filterItem.kind === 'select'">
            <div class="label">{{filterItem.text}}：</div>
            <el-select v-model="filterItem.value" size="mini" clearable :filterable="filterItem.filterable" placeholder="请选择">
              <el-option
                v-for="item in filterItem.enum"
                :key="item.val"
                :label="item.text"
                :value="item.val">
              </el-option>
            </el-select>
          </template>
          <template v-else-if="filterItem.kind === 'datePicker'">
            <span class="label">{{filterItem.text}}：</span>
            <el-date-picker
              v-model="filterItem.value"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="timestamp">
            </el-date-picker>
          </template>
          <template v-else-if="filterItem.kind === 'numberRange'">
            <span class="label">{{filterItem.text}}：</span>
            <el-input size="mini" v-model="filterItem.value[0]" clearable placeholder="请输入内容"></el-input>
            <el-input size="mini" v-model="filterItem.value[1]" clearable placeholder="请输入内容"></el-input>
          </template>
        </div>
      </div>
      <div class="filter-actions">
        <el-button @click="handleInit">重置</el-button>
        <el-button icon="el-icon-arrow-up" @click="handleToggleUnfold">收起</el-button>
        <!-- <el-button icon="el-icon-close" @click="handleCancel">取消</el-button> -->
        <!-- <el-button icon="el-icon-close" @click="handleEmpty">清空</el-button> -->
        <el-button type="primary" icon="el-icon-check" @click="handleEnter">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
/**
 * TODO: 回车键等于点确定
 * TODO: 点击空白，等于取消
 */
/**
  从对应store中引入过滤配置 下对应各个过滤配置引用 { filterProps: Object, config: Object }
  filterProps是组件的所有过滤设置，config是当前有效的设置项（用户选择过的）：
    - 配置项名称，
    - 类型，
    - form类型，
    - 前置条件
      - 前置条件改变，不可更改当前条件到适当值，而是在当前条件设置提示
      - 当前条件改变，前置条件改动到合适位置
    - 是否枚举，
      - 枚举集合
  */

/**
 * 可能的form类型： input radio/select DateTimePicker
 * 枚举值使用radio/select:如果枚举超过三个，使用select
 */

/**
 * 组件样式说明：
 * 过滤器可以展开收起：
 * - 收起：收起行高50px，从左到右排，以小卡片形式排列有效筛选项，可点击小X 清空此筛选项。在鼠标hover时，显示展开按钮，单机空白区域或者展开按钮，展开具体过滤项
 * - 展开：展开后，显示所有可用过滤项，按输入类别分类排列。点击确定按钮，收起并更新过滤项。点击取消按钮，撤销本次所有过滤更改，还原至上次过滤条件并收起
 */
import { deepCopy } from "@/lib/tool.js";
import moment from "moment";
export default {
  name: "filtration",
  props: {
    filterProps: {
      type: Object,
      default() {
        return {};
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      isUnfold: false, // 是否展开标志
      filterItems: this.__getFilterItems(),
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {
    tagConfig() {
      const { config, filterProps } = this;
      const tagConfig = {};
      for (let [key, value] of Object.entries(config)) {
        let tagContent = value;
        if (filterProps[key].kind === "datePicker") {
          tagContent = value.split(",").map(time => {
            return moment(Number(time)).format("YYYY-M-D");
          });
        }
        tagConfig[key] = tagContent;
      }
      return tagConfig;
    }
  },
  methods: {
    handleEmptyOne(name) {
      this.$emit("closeTag", name);
    },
    handleToggleUnfold() {
      this.isUnfold = !this.isUnfold;
    },
    handleCancel() {
      this.filterItems = this.__getFilterItems();
      this.handleToggleUnfold();
    },
    handleEmpty() {
      for (let value of Object.values(this.filterItems)) {
        switch (value.type) {
          case "String":
            value.value = "";
            break;
          case "Array":
            value.value = [];
            break;
          default:
        }
      }
    },
    handleEnter() {
      console.log("确定");
      this.$emit("filter", this.filterItems);
      this.handleToggleUnfold();
    },
    handleInit() {
      this.filterItems = this.__getFilterItems();
    },
    __getFilterItems() {
      return deepCopy(this.filterProps);
    }
  },
  watch: {
    filterProps: function() {
      this.handleInit();
    }
  }
};
</script>
<style scoped>
.filtration {
  position: relative;
  height: 50px;
  width: 100%;
}
.unfold {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  z-index: 101;
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 5px 10px -4px rgba(0, 0, 0, 0.3),
    0 2px 4px 0 rgba(232, 237, 250, 0.5);
}
.unfold .filter-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.unfold .filter-items .item {
  display: flex;
  align-items: center;
  padding: 10px;
}
.unfold .filter-items .item .label {
  flex: none;
  font-size: 12px;
}
.unfold .filter-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}
.pack-up {
  display: flex;
  position: relative;
  flex-wrap: nowrap;
  overflow: auto;
  padding: 5px 0 0 5px;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}
.showUnfold {
  display: block;
  position: absolute;
  left: 50%;
  bottom: 5px;
  font-size: 24px;
}
.pack-up:hover {
  background-color: #ccc;
}
.pack-up .el-icon-caret-bottom {
  color: var(--主题色);
}
</style>
<style>
.filtration .el-date-editor .el-range-separator {
  width: auto;
}
</style>
