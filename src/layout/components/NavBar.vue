<template>
  <div>
    <!-- 导航栏 -->
    <div class="nav-bar">
      <!-- 折叠按钮 -->
      <div class="hamburger-container" @click="trigger">
        <el-icon v-if="tabManager.collapse"><Expand /></el-icon>
        <el-icon v-else><Fold /></el-icon>
      </div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="|">
        <el-breadcrumb-item v-for="item of breadcrumbList" :key="item.path">
          <span v-if="item.redirect">{{ item.name }}</span>
          <router-link v-else :to="item.path">{{ item.name }}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 右侧菜单 -->
      <div class="right-menu">
        <!-- 用户选项 -->
        <el-dropdown @command="handleCommand">
          <el-avatar :size="40" :src="user.user.avatar" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="setting">
                <el-icon><UserFilled /></el-icon> 个人中心
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><Promotion /></el-icon> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 历史标签栏 -->
    <div class="tabs-view-container">
      <div class="tabs-wrapper">
        <span
          :class="isActive(item)"
          v-for="item of tabManager.tabList"
          :key="item.path"
          @click="goTo(item)"
        >
          {{ item.name }}
          <el-icon v-if="item.path !== '/home'" @click.stop="removeTab(item)">
            <Close />
          </el-icon>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { resetRouter } from "../../router";
import { useTab } from "../../stores/tab";
import request from "../../utils/request";
import { useUser } from "../../stores/user";
import {
  Fold,
  Expand,
  UserFilled,
  Promotion,
  Close,
} from "@element-plus/icons-vue";
const router = useRouter();
const route = useRoute();
const tabManager = useTab();
const user = useUser();
const isSearch = false;
let breadcrumbList = [];

onBeforeMount(() => {
  let matched = route.matched.filter((item) => item.name);
  const first = matched[0];
  if (first && first.name === "layout") {
    matched.shift();
  }
  breadcrumbList = matched;
  console.log(route.name);
  //保存当前页标签
  tabManager.saveTab(route);
});
function goTo(tab) {
  //跳转标签
  router.push({ path: tab.path });
}
function removeTab(tab) {
  //删除标签
  tabManager.removeTab(tab);
  //如果删除的是当前页则返回上一标签页
  if (tab.path === route.path) {
    const tabList = tabManager.tabList;
    router.push({ path: tabList[tabList.length - 1].path });
  }
}
function trigger() {
  tabManager.trigger();
}
function handleCommand(command) {
  if (command === "setting") {
    router.push({ path: "/setting" });
  }
  if (command === "logout") {
    // 调用注销接口
    request.post("/logout");
    // 清空用户信息
    user.logout();
    tabManager.resetTab();
    // 清空用户菜单
    resetRouter();
    router.push({ path: "/login" });
  }
}
//标签是否处于当前页
const isActive = computed(() => {
  return function (tab) {
    if (tab.path === route.path) {
      return "tabs-view-item-active";
    }
    return "tabs-view-item";
  };
});
const isFold = computed(() => {
  return tabManager.collapse ? "Expand" : "Fold";
});
</script>

<style scoped>
.nav-bar {
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 30px;
  height: 50px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.hamburger-container {
  font-size: 1.25rem;
  cursor: pointer;
  margin-right: 24px;
}
.tabs-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  width: 95%;
}
.tabs-view-container {
  display: flex;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
  height: 33px;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}
.tabs-view-item {
  display: inline-block;
  cursor: pointer;
  height: 25px;
  line-height: 25px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 5px;
}
.tabs-close-item {
  position: absolute;
  right: 10px;
  display: inline-block;
  cursor: pointer;
  height: 25px;
  line-height: 25px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 5px;
}
.tabs-view-item-active {
  display: inline-block;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  padding: 0 8px;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 5px;
  background-color: #42b983;
  color: #fff;
  border-color: #42b983;
}
.tabs-view-item-active:before {
  content: "";
  background: #fff;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  margin-right: 2px;
}
.el-icon-close {
  padding: 0.1rem;
}
.el-icon-close:hover {
  border-radius: 50%;
  background: #b4bccc;
  transition-duration: 0.3s;
}
.right-menu {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.el-icon-caret-bottom {
  margin-left: 0.5rem;
  font-size: 0.75rem;
}
.screen-full {
  cursor: pointer;
  margin-right: 1rem;
  font-size: 1.25rem;
}
*::-webkit-scrollbar {
  width: 0.5rem;
  height: 6px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: rgba(144, 147, 153, 0.3);
}
</style>
