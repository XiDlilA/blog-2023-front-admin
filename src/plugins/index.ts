import type { App } from "vue";
import { setupCharts } from "@/plugins/charts";
import { setupRouter } from "@/router";
import { setupPinia } from "@/plugins/pinia";
import { setupDayJS } from "@/plugins/dayjs";
import * as Icons from "@element-plus/icons-vue";
import { setupMdEditor } from "@/plugins/mdEditor";

export function setupPlugins(app: App) {
  setupCharts(app);
  setupPinia(app);
  setupDayJS(app);
  setupMdEditor(app);
  setupRouter(app);
  Object.keys(Icons).forEach((key) => {
    app.component(key, Icons[key as keyof typeof Icons]);
  });
}
