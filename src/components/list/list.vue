<template>
  <div class="list">
    <div class="loading" v-if="isLoading">
      <loading />
    </div>
    <div class="afterLoading" v-else>
      <div class="content" ref="content">
        <el-table
        :data="currentList"
        style="width: 100%"
        :max-height="tableMaxHeight"
        :style="{minHeight: `${tableMaxHeight}px`}"
        @row-dblclick="handleTableRowDbclick"
        @row-click="handleTableRowClick">
          <el-table-column type="expand" fixed>
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item v-for="extend in tableColumn.extend" :key="extend.prop" :label="extend.label">
                  <el-table
                    v-if="extend.sub"
                    :data="props.row[extend.prop]"
                    style="width: 100%">
                    <el-table-column
                      v-for="sub in extend.sub"
                      :key="sub.prop"
                      :prop="sub.prop"
                      :label="sub.label"
                      :width="sub.width ? sub.width: cloumnDefaultStyle.width">
                    </el-table-column>
                  </el-table>
                  <span v-else>{{props.row[extend.prop]}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column v-for="column in tableColumn.show" :key="column.prop"
            :fixed="column.fixed"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.width ? column.width : cloumnDefaultStyle.width">
            <el-table-column v-if="column.sub"
              v-for="sub in column.sub"
              :key="sub.prop"
              :prop="sub.prop"
              :label="sub.label"
              :fixed="sub.fixed"
              :min-width="sub.width ? sub.width: cloumnDefaultStyle.width"
            >
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrapper">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          layout="prev, pager, next, jumper"
          :page-size="1"
          :total="pageSum">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
/**
 * TODO: 双击往外发送双击事件
 */
/**
 * 局部mask
 *  - 展示loading
 * 列表
 * 分页
 */
import loading from "../loading/loading.vue";
// import { mapState } from "vuex"

export default {
  name: "list",
  components: {
    loading
  },
  props: {
    page: Number,
    pageSum: Number,
    list: Object,
    isLoading: Boolean,
    tableColumn: Object // 表格表头配置数组
  },
  data() {
    return {
      cloumnDefaultStyle: {
        width: 100
      },
      currentPage: this.page,
      tableMaxHeight: 250
    };
  },
  computed: {
    currentList() {
      if (this.isLoading) {
        return [];
      } else {
        let arr = [];
        for (let item of Object.values(this.list[this.page].item)) {
          arr.push(item);
        }
        return arr;
      }
    }
  },
  mounted() {
    if (!this.isLoading) {
      this.tableMaxHeight = this.$refs.content.clientHeight;
    }
  },
  updated() {
    // console.log(this.content.list[this.content.page]);
    if (!this.isLoading) {
      this.tableMaxHeight = this.$refs.content.clientHeight;
    }
    if (this.page !== this.currentPage) {
      this.currentPage = this.page;
    }
    // window.addEventListener("resize", (() => {
    //   this.tableMaxHeight = this.$refs.content.clientHeight;
    // })(this));
  },
  methods: {
    handleCurrentChange(page) {
      this.$emit("changePage", page);
    },
    handleTableRowDbclick(row) {
      console.log("双击行：", row);
    },
    handleTableRowClick(row) {
      console.log("单击行：", row);
    }
  }
};
</script>
<style scoped>
.list {
  height: 100%;
  width: 100%;
  --分页器上padding: 20px;
}
.loading {
  height: 100%;
}
.afterLoading {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.list .content {
  flex: 1;
  height: calc(100% - var(--分页器上padding) - 32px);
  width: 100%;
  overflow: auto;
}
.list .pagination-wrapper {
  display: flex;
  flex: none;
  justify-content: center;
  align-items: center;
  padding-top: var(--分页器上padding);
}
</style>
<style>
.list .el-table {
  height: 100%;
  overflow: auto;
}
.table-expand {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.table-expand label {
  color: var(--主题色);
}
.table-expand .el-form-item {
  margin-right: 40px;
  margin-bottom: 20px;
  padding-right: 40px;
  flex: 0 0 100%;
  min-width: 120px;
  border-right: 1px solid #000;
}
.pagination-wrapper .number.active {
  color: var(--主题色);
}
</style>
