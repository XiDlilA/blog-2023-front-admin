<template>
  <el-card class="main-card">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="修改信息" name="info">
        <div class="info-container">
          <!-- 头像加载 -->
          <el-upload
            class="avatar-uploader"
            action="/api/users/avatar"
            :show-file-list="false"
            :on-success="updateAvatar"
          >
            <img v-if="avatar" :src="avatar" class="avatar" alt="头像" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <!-- 信息表格 -->
          <el-form
            label-width="70px"
            :model="infoForm"
            style="width: 320px; margin-left: 3rem"
          >
            <el-form-item label="昵称">
              <el-input v-model="infoForm.nickname" size="small" />
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input v-model="infoForm.intro" size="small" />
            </el-form-item>
            <el-form-item label="个人网站">
              <el-input v-model="infoForm.webSite" size="small" />
            </el-form-item>
            <el-button
              @click="updateInfo"
              type="primary"
              size="default"
              style="margin-left: 4.375rem"
            >
              修改
            </el-button>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="password">
        <div class="info-container">
          <el-form
            label-width="70px"
            :model="passwordForm"
            :rules="rules"
            style="width: 320px"
          >
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input
                @keyup.enter.native="updatePassword"
                v-model="passwordForm.oldPassword"
                size="small"
                show-password
              />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                @keyup.enter.native="updatePassword"
                v-model="passwordForm.newPassword"
                size="small"
                show-password
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                @keyup.enter.native="updatePassword"
                v-model="passwordForm.confirmPassword"
                size="small"
                show-password
              />
            </el-form-item>
            <el-button
              type="primary"
              size="default"
              style="margin-left: 4.4rem"
              @click="updatePassword"
            >
              修改
            </el-button>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
import { useUser } from "../../stores/user";
import { Plus } from "@element-plus/icons-vue";
import request from "../../utils/request";
const user = useUser();
const activeName = ref("info");
const infoForm = reactive({
  nickname: user.user.nickname,
  intro: user.user.intro,
  webSite: user.user.webSite,
});
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== passwordForm.newPassword) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};
const rules = {
  oldPassword: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  newPassword: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 6, max: 15, message: "密码长度需在 6 到 15 之间", trigger: "blur" },
  ],

  confirmPassword: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 6, max: 15, message: "密码长度需在 6 到 15 之间", trigger: "blur" },
    { validator: validatePass, trigger: "blur" },
  ],
};

function updateInfo() {
  if (infoForm.nickname.trim() === "") {
    console.log("昵称不能为空");
    return false;
  }
  request.put("/api/users/info", infoForm).then(({ data }) => {
    if (data.flag) {
      console.log(data.message);
      user.updateUserInfo(infoForm);
    } else {
      console.log(data.message);
    }
  });
}
function updateAvatar(response) {
  if (response.flag) {
    console.log(response.message);
    user.updateAvatar(response.data);
  } else {
    console.log(response.message);
  }
}
function updatePassword() {
  if (passwordForm.oldPassword.trim() === "") {
    console.log("旧密码不能为空");
    return false;
  }
  if (passwordForm.newPassword.trim() === "") {
    console.log("新密码不能为空");
    return false;
  }
  if (passwordForm.newPassword.length < 6) {
    console.log("新密码不能少于6位");
    return false;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    console.log("两次密码输入不一致");
    return false;
  }
  request.put("/api/admin/users/password", passwordForm).then(({ data }) => {
    if (data.flag) {
      passwordForm.oldPassword = "";
      passwordForm.newPassword = "";
      passwordForm.confirmPassword = "";
      console.log(data.message);
    } else {
      console.log(data.message);
    }
  });
}
const avatar = computed(() => {
  return user.user.avatar;
});
</script>

<style scoped>
.avatar-container {
  text-align: center;
}
.el-icon-message-solid {
  color: #f56c6c;
  margin-right: 0.3rem;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.info-container {
  display: flex;
  align-items: center;
  margin-left: 20%;
  margin-top: 5rem;
}
</style>
