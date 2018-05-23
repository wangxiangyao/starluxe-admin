<template>
  <div id="login">
    <img class="bg" src="./bg.jpg" alt="星洞-登陆页背景">
    <!-- 登陆的mask调用全局mask -->
    <div class="content">
      <div class="logo"></div>
      <div class="form">
        <el-input class="input-item" type="text" v-model="username" placeholder="请输入用户名" />
        <el-input class="input-item" type="password" v-model="password" placeholder="请输入密码" />
        <el-button class="login" type="primary">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
/**TODO:
 * 1. 随机背景图
 * 2. 登录后，过度动画
 */

export default {
  name: "login",
  data() {
    return {
      username: "",
      password: ""
    };
  }
};
</script>
<style scoped>
#login {
  position: relative;
  width: 100%;
  height: 100%;
}
.bg {
  width: 100%;
  height: 100%;
}
.content {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 960px;
  height: 100%;
  padding: 150px 0;
  margin: 0 auto;
}
.form {
  width: 334px;
  background-color: #fff;
  padding: 20px;
}
.input-item {
  margin-bottom: 20px;
}
.login {
  width: 100%;
}
</style>
