<template>
  <div id="commodityList">
    <listPreview 
      title="Commodity Management"
      :page="page"
      :pageSum="pageSum"
      :isLoading="isLoading"
      :byPage="byPage"
      :tableColumn="tableColumn"
      :filterConfig="filterConfig"
      :pureFilterConfig="pureFilterConfig"
      :handleEmptyFilterOne="handleEmptyFilterOne"
      :handleFilter="handleFilter"
      :handleChangePage="handleChangePage"
      :handleRefresh="handleRefresh"
      >
    </listPreview>
  </div>
</template>
<script type="text/babel">
import listPreview from "@/components/listPreview/listPreview.vue";
import listMixin from "@/mixins/list.js";

export default {
  mixins: [listMixin("commodity")],
  components: {
    listPreview
  }
};
</script>
<style>
#commodityList {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 0 20px;
}
</style>
