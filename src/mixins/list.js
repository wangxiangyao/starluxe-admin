/**
 * TODO: 双击，跳转到对应详情页
 */
/**
  表单处理策略：
    局部保存表单数据
    得到提交事件再更改vuex中对应数据
    具体做法：使用getter获得一个拷贝
  过滤器 浮动，可折叠：
    - 折叠状态：
      - 小卡片形式显示当前选择过滤条件，可快捷删除
      - 改变状态后，有过滤按钮高亮（之前置灰）
    - 展开：
      - 过滤按钮高亮
      - 小卡片显示单枪过滤条件
      - 下边是按输入类型分类的过滤器
  */
/**
 * 组件数据思路：
 * - 首次加载组件：根据store中状态，请求当前页数据
 * - 组件更新页码：发起更新页码mutation，再次请求数据，更新视图
 */

import { createNamespacedHelpers } from "vuex";

export default function list(name) {
  const { mapState, mapGetters, mapActions } = createNamespacedHelpers(name);
  return {
    name,
    data() {
      return {
        mask: {
          type: "",
          message: "",
          all: this.$store.state.mask.all
        }
      };
    },
    created() {
      this.getListIfNeed();
    },
    computed: {
      ...mapState(["byPage", "page", "pageSum", "isLoading"]),
      ...mapGetters(["filterConfig", "pureFilterConfig", "tableColumn"])
    },
    methods: {
      ...mapActions(["getListIfNeed", "changePage", "changeFilter", "refresh"]),
      handleChangePage(val) {
        this.changePage(val);
      },
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
      handleRefresh() {
        this.refresh();
      }
    }
  };
}
