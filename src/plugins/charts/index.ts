import type { App } from "vue";
import VueCalendarHeatmap from "vue3-calendar-heatmap";

import "echarts";
import ECharts from "vue-echarts";

export function setupCharts(app: App) {
  app.use(VueCalendarHeatmap);
  app.component("v-chart", ECharts);
}
