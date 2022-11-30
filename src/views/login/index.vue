<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-title">管理员登录</div>
      <!-- 登录表单 -->
      <el-form
        ref="ruleFormRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        status-icon
      >
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :prefix-icon="User"
            placeholder="用户名"
            @keyup.enter.native="login"
          />
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :prefix-icon="Lock"
            show-password
            placeholder="密码"
            @keyup.enter.native="login"
          />
        </el-form-item>
        <!--   登录   -->
        <el-form-item>
          <el-button type="primary" @click="login(ruleFormRef)">登录</el-button>
        </el-form-item>
      </el-form>
      <!-- 登录按钮 -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import request from "../../utils/request";
import { useUser } from "../../stores/user";
import { User, Lock } from "@element-plus/icons-vue";
import config from "../../assets/js/config";
import autoload from "../../router/aotuload";
// data
const router = useRouter();
const user = useUser();
const ruleFormRef = ref();
const loginForm = ref({
  username: "",
  password: "",
});
const rules = {
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
};
// methods
const login = async (formEl) => {
  await formEl.validate((valid) => {
    if (valid) {
      // eslint-disable-next-line no-undef
      const captcha = new TencentCaptcha(config.TENCENT_CAPTCHA, function (
        res
      ) {
        if (res.ret === 0) {
          //发送登录请求
          let param = new URLSearchParams();
          param.append("username", loginForm.username);
          param.append("password", loginForm.password);
          user.loginState = true;
          autoload(router);
          router.push({ path: "/" });
          request.post("login", param).then(({ data }) => {
            if (data.flag) {
              // 登录后保存用户信息
              user.login(data.data);
              // 加载用户菜单
              autoload(router);
              console.log("登录成功");
              router.push({ path: "/" });
            } else {
              console.log(data.message);
            }
          });
        }
      });
      // 显示验证码
      captcha.show();
    } else {
      return false;
    }
  });
};
</script>

<style scoped>
.login-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: url(https://static.talkxj.com/config/0w3pdr.jpg) center center /
    cover no-repeat;
}
.login-card {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  padding: 170px 60px 180px;
  width: 350px;
}
.login-title {
  color: #303133;
  font-weight: bold;
  font-size: 1rem;
}
.login-form {
  margin-top: 1.2rem;
}
.login-card button {
  margin-top: 1rem;
  width: 100%;
}
</style>
