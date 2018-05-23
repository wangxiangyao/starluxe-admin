<template>
  <div class="list-preview">
    <div class="topBar">
      <div class="title">{{title}}</div>
      <div class="bar">
        <el-button type="primary" @click="handleRefresh">刷新</el-button>
      </div>
    </div>
    <div class="filter-wrapper">
      <filtration :filterProps="filterConfig" :config="pureFilterConfig"
        @closeTag="handleEmptyFilterOne"
        @filter="handleFilter"
      />
    </div>
    <div class="content-wrapper">
      <div class="list-wrapper">
        <list :page="page" :pageSum="pageSum" :list="byPage" :isLoading="isLoading" :tableColumn="tableColumn"
          @changePage="handleChangePage"
        />
      </div>
      
    </div>
  </div>
</template>
<script type="text/babel">
  import list from '@/components/list/list.vue'
  import filtration from '@/components/filter/filter.vue'

  export default {
    name: 'listPreview',
    components: {
      list,
      filtration
    },
    props: {
      title: String,
      page: [Number, String],
      pageSum: [Number, String],
      isLoading: Boolean,
      byPage: Object,
      tableColumn: Object,
      filterConfig: Object,
      pureFilterConfig: Object,
      handleEmptyFilterOne: Function,
      handleFilter: Function,
      handleChangePage: Function,
      handleRefresh: Function
    }
  }
</script>
<style scoped>
  .list-preview {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .topBar {
    display: flex;
    align-items: center;
  }
  .title {
    flex: none;
    padding: 20px 0;
    font-size: 20px;
    margin-right: 40px;
  }
  .filter-wrapper {
    display: flex;
    flex: none;
  }
  .content-wrapper {
    flex: 1;
    max-height: calc(100% - 110px);
    max-width: 100%;
    padding: 20px 0 20px;
  }
  .list-wrapper {
    height: 100%;
    width: 100%;
  }
</style>

