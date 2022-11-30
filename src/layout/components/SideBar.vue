<template>
  <div>
    <el-menu
      class="side-nav-bar"
      router
      :collapse="tab.collapse"
      :default-active="route.path"
      background-color="#304156"
      text-color="#BFCBD9"
      active-text-color="#409EFF"
    >
      <template v-for="route in tab.userMenuList">
        <!-- 二级菜单 -->
        <template v-if="route.name !== 'layout' && route.children">
          <el-sub-menu :key="route.path" :index="route.path">
            <!-- 二级菜单标题 -->
            <template slot="title">
              <el-icon> <component :is="route.meta.menu.icon" /></el-icon>
              <span>{{ route.meta.menu.title }}</span>
            </template>
            <!-- 二级菜单选项 -->
            <template v-for="item in route.children">
              <el-menu-item :index="item.path">
                <el-icon> <component :is="item.meta.menu.icon" /></el-icon>
                <span slot="title">{{ item.meta.menu.title }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <!-- 一级菜单 -->
        <template v-else>
          <el-menu-item
            v-for="item in route.children"
            :index="route.path"
            :key="route.path"
          >
            <el-icon> <component :is="item.meta.menu.icon" /></el-icon>
            <span slot="item.meta.menu.title">{{ item.meta.menu.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { useTab } from "../../stores/tab";
const tab = useTab();
const route = useRoute();
</script>
<style scoped>
.side-nav-bar:not(.el-menu--collapse) {
  width: 210px;
}
.side-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.side-nav-bar i {
  margin-right: 1rem;
}
*::-webkit-scrollbar {
  width: 0.5rem;
  height: 1px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: rgba(144, 147, 153, 0.3);
}
</style>
