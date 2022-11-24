import type { App } from "vue";
import { setupCharts } from "@/plugins/charts";
import { setupRouter } from "@/router";
import { setupPinia } from "@/plugins/pinia";
import { setupDayJS } from "@/plugins/dayjs";

export function setupPlugins(app: App) {
  setupCharts(app);
  setupRouter(app);
  setupPinia(app);
  setupDayJS(app);
}
