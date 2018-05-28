<template>
  <div id="topBar">
    <div class="name bar-item">
      账户：{{ user.realName ? user.realName : user.account }}
    </div>
    <div class="message bar-item">
      <i class="el-icon-bell"></i>
    </div>
    <div class="unlogin bar-item">
      <el-button type="primary">退出</el-button>
    </div>
  </div>
</template>
<script type="text/babel">
// import { createNamespacedHelpers } from "vuex"
// const { mapState } = createNamespacedHelpers("member")
import { mapState } from "vuex";

export default {
  name: "topBar",
  computed: {
    ...mapState(["user"])
  }
};
</script>
<style>
#topBar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0 20px;
}
#topBar .bar-item {
  padding: 0 10px;
}
#topBar .message .el-icon-bell {
  font-size: 30px;
}
</style>
