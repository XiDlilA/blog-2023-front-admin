import { defineStore } from "pinia";
import type { User } from "#/constant";
import type { RouteRecordRaw } from "vue-router";

export const useUser = defineStore("user", {
  state: () => ({
    user: <User>{},
    loginState: false,
    userMenuList: [] as RouteRecordRaw[],
  }),
  actions: {
    login(user: User) {
      this.user.userInfoId = user.userInfoId;
      this.user.roleList = user.roleList;
      this.user.avatar = user.avatar;
      this.user.nickname = user.nickname;
      this.user.intro = user.intro;
      this.user.webSite = user.webSite;
      this.loginState = true;
    },
    saveUserMenuList(userMenuList: RouteRecordRaw[]) {
      this.userMenuList = userMenuList;
    },
    logout() {
      this.user.userInfoId = "";
      this.user.roleList = [""];
      this.user.avatar = "";
      this.user.nickname = "";
      this.user.intro = "";
      this.user.webSite = "";
      this.userMenuList = [];
      this.loginState = false;
    },
    updateAvatar(avatar: string) {
      this.user.avatar = avatar;
    },
    updateUserInfo(user: User) {
      this.user.nickname = user.nickname;
      this.user.intro = user.intro;
      this.user.webSite = user.webSite;
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: sessionStorage }],
  },
});
