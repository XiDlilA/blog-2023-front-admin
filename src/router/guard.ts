import NProgress from "@/utils/progress";
import type {
  RouteLocationNormalized,
  Router
} from "vue-router";
import { useUser } from "@/stores/user";

class Guard {
  constructor(private router: Router) {
  }

  public run() {
    this.router.beforeEach(this.beforeEach.bind(this));
    this.router.afterEach(this.afterEach.bind(this));
  }

  private async beforeEach(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: any
  ) {
    const user = useUser();
    NProgress.start();
    if (to.path == "/login") {
      next();
    } else if (!user.loginState) {
      next({ path: "/login" });
    } else {
      next();
    }
  }

  private async afterEach() {
    NProgress.done();
  }
}

export default (router: Router) => {
  new Guard(router).run();
};
