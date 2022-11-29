import type { App } from "vue";
import VueCalendarHeatmap from "vue3-calendar-heatmap";
import * as echarts from "echarts";

export function setupCharts(app: App) {
  app.use(VueCalendarHeatmap);
  app.config.globalProperties.$echarts = echarts;
}

export function initChart(chart: any, refMain: any, option: {}) {
  if (chart != null && chart !== "" && chart !== undefined) {
    chart.dispose(); //销毁
  }
  chart = echarts.init(refMain.value);
  chart.showLoading({
    text: "loading",
    color: "#30a14e",
    textColor: "#000",
    maskColor: "rgba(255, 255, 255, 0.2)",
    zlevel: 0,
  });
  setTimeout(() => {
    // setOption前隐藏loading事件
    chart.hideLoading();
    chart.setOption(option);
  }, 1000);
  option && chart.setOption(option);
  window.onresize = function () {
    //自适应大小, 不用的话不会自适应大小。
    chart.resize();
  };
}
