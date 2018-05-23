<template>
  <div class="loading">
    <i class="el-icon-loading"></i>
  </div>
</template>
<script type="text/babel">
export default {
  name: "loading"
};
</script>
<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
}
.el-icon-loading {
  font-size: 36px;
  color: #fff;
}
</style>
