import * as dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import type { App } from "vue";

dayjs.locale("zh-cn");
export function setupDayJS(app: App) {
  app.config.globalProperties.$dayjs = dayjs;
}
