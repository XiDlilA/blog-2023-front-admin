<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="auto">
      <SideBar />
    </el-aside>
    <el-container :style="isFold">
      <!-- 导航栏 -->
      <el-header height="84px" style="padding: 0">
        <NavBar :key="route.fullPath" />
      </el-header>
      <!-- 内容 -->
      <el-main style="background: #f7f9fb">
        <div class="fade-transform-box">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import SideBar from "./components/SideBar.vue";
import { useTab } from "../stores/tab";
const route = useRoute();
const tabManager = useTab();
const isFold = computed(() => ({
  transition: "margin-left 0.45s",
  "margin-left": tabManager.collapse ? "64px" : "210px",
  "min-height": "100vh",
}));
</script>

<style scoped>
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s ease 0s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.fade-transform-box {
  position: relative;
  top: 0px;
  bottom: 0px;
  width: 100%;
  overflow: hidden;
}
</style>
