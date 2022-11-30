import type { Router, RouteRecordRaw } from "vue-router";
import request from "@/utils/request";
import { useTab } from "@/stores/tab";

let routes: RouteRecordRaw[];
/**
 * 路由自动装配
 * @param router 路由实例
 */
async function autoload(router: Router) {
  // 根据后端传来的消息分析组装路由，路由关键信息就是，name，component和children；
  // 同时保存其数据便于显示，如 icon 数据
  // const data = request.get("/api/admin/user/menus");
  const data = {
    flag: true,
    data: [
      {
        path: "/",
        name: "layout",
        redirect: { name: "home" },
        component: () => import("@/layout/index.vue"),
        meta: { menu: { title: "首页", icon: "Monitor" } },
        children: [
          {
            path: "home",
            name: "home",
            meta: { menu: { title: "首页", icon: "Monitor" } },
            component: () => import("@/views/home/home.vue"),
          },
        ],
      },
    ],
  };

  if (data.flag) {
    const userMenuList = data.data;
    const tab = useTab();
    tab.userMenuList = userMenuList as RouteRecordRaw[];
    routes = userMenuList as RouteRecordRaw[];
    routes.forEach((r) => router.addRoute(r));
  } else {
    await router.push({ name: "login" });
  }
}

export default autoload;
