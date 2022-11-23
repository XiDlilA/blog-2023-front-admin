import Layout from "@/layout/index.vue";
import { useRouter } from "vue-router";
import { useUser } from "../../stores/user";
import request from "../../utils/request";

export function generaMenu() {
  const user = useUser();
  const router = useRouter();
  // 查询用户菜单
  request.get("/admin/user/menus").then(({ data }) => {
    if (data.flag) {
      const userMenuList = data.data;
      userMenuList.forEach((item) => {
        if (item.icon != null) {
          item.icon = "iconfont " + item.icon;
        }
        if (item.component === "Layout") {
          item.component = Layout;
        }
        if (item.children && item.children.length > 0) {
          item.children.forEach((route) => {
            route.icon = "iconfont " + route.icon;
            route.component = loadView(route.component);
          });
        }
      });
      // 添加侧边栏菜单
      user.saveUserMenuList(userMenuList);
      // 添加菜单到路由
      router.addRoute(userMenuList);
    } else {
      console.error(data.message);
      router.push({ path: "/login" }).then();
    }
  });
}

export const loadView = (view) => {
  const modules = import.meta.glob('@/views/*/*.vue')
  // 路由懒加载
  return modules[`@/views/${view}`];
};
