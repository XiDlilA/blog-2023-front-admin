import { defineStore } from "pinia";
import type { Tab } from "#/constant";
import type { RouteRecordRaw } from "vue-router";

export const useTab = defineStore("tab", {
  state: () => ({
    collapse: false,
    tabList: [{ name: "home", path: "/home" }],
    userId: null,
    roleList: null,
    avatar: null,
    nickname: null,
    intro: null,
    webSite: null,
  }),
  actions: {
    saveTab(tab: Tab) {
      if (this.tabList.findIndex((item) => item.path === tab.path) == -1) {
        this.tabList.push({ name: tab.name, path: tab.path });
      }
    },
    removeTab(tab: Tab) {
      const index = this.tabList.findIndex((item) => item.name === tab.name);
      this.tabList.splice(index, 1);
    },
    resetTab() {
      this.tabList = [{ name: "home", path: "/home" }];
    },
    trigger() {
      this.collapse = !this.collapse;
    },
  },
});
