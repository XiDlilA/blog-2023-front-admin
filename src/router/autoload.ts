import type { Router, RouteRecordRaw } from "vue-router";
import request from "@/utils/request";
import { useUser } from "@/stores/user";

let routes: RouteRecordRaw[];
/**
 * 路由自动装配
 * @param router 路由实例
 */
async function autoload(router: Router) {
  // 根据后端传来的消息分析组装路由，路由关键信息就是，name，component和children；
  // 同时保存其数据便于显示，如 icon 数据
  // const data = request.get("/api/admin/user/menus");
  const menu = [
    {
      path: "article",
      name: "文章管理",
      meta: {
        menu: {
          title: "文章管理",
          icon: "Document",
        },
        child: 1,
        children: [
          {
            path: "articlePublish",
            icon: "DocumentAdd",
            title: "发表文章",
          },
        ],
      },
      component: () =>
        import("@/views/articleManager/articlePublish/index.vue"),
    },
    {
      path: "articlePublish",
      name: "发表文章",
      meta: { menu: { title: "发表文章", icon: "DocumentAdd" }, child: 2 },
      component: () =>
        import("@/views/articleManager/articlePublish/index.vue"),
    },
    {
      path: "setting",
      name: "个人中心",
      meta: { menu: { title: "个人中心", icon: "UserFilled" }, child: 0 },
      component: () => import("@/views/setting/index.vue"),
    },
  ];
  const data = {
    flag: true,
    data: [
      {
        path: "/",
        name: "layout",
        redirect: { name: "home" },
        component: () => import("@/layout/index.vue"),
        meta: { menu: { title: "首页", icon: "Monitor" }, child: 0 },
        children: [
          {
            path: "home",
            name: "首页",
            meta: { menu: { title: "首页", icon: "Monitor" }, child: 0 },
            component: () => import("@/views/home/home.vue"),
          },
        ],
      },
    ],
  };
  // @ts-ignore
  menu.forEach((item) => {
    data.data[0].children.push(item);
  });
  console.log(data.data);
  if (data.flag) {
    const userMenuList = data.data;
    const user = useUser();
    user.saveUserMenuList(userMenuList as RouteRecordRaw[]);
    routes = userMenuList as RouteRecordRaw[];
    routes.forEach((r) => router.addRoute(r));
    user.success();
  } else {
    await router.push({ name: "login" });
  }
}

export default autoload;
