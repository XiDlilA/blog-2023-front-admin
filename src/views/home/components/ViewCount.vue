<template>
  <div ref="main" style="height: 350px" />
</template>

<script setup>
import * as echarts from "echarts";
const props = defineProps({
  xdata: {
    default: [], //默认值
    required: true, //是否必须传递
  },
  ydata: {
    default: [], //默认值
    required: true, //是否必须传递
  },
});
const main = ref();
let viewCountChart;
function initChart() {
  if (
    viewCountChart != null &&
    viewCountChart !== "" &&
    viewCountChart !== undefined
  ) {
    viewCountChart.dispose(); //销毁
  }
  viewCountChart = echarts.init(main.value);
  viewCountChart.showLoading({
    text: "loading",
    color: "#c23531",
    textColor: "#000",
    maskColor: "rgba(255, 255, 255, 0.2)",
    zlevel: 0,
  });
  setTimeout(() => {
    // setOption前隐藏loading事件
    viewCountChart.hideLoading();
    viewCountChart.setOption(option);
  }, 1000);
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    color: ["#3888fa"],
    legend: {
      data: ["访问量"],
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      data: props.xdata,
      axisLine: {
        lineStyle: {
          // 设置x轴颜色
          color: "#666",
        },
      },
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          // 设置y轴颜色
          color: "#048CCE",
        },
      },
    },
    series: [
      {
        name: "访问量",
        type: "line",
        data: props.ydata,
        smooth: true,
      },
    ],
  };
  option && viewCountChart.setOption(option);
  window.onresize = function () {
    //自适应大小, 不用的话不会自适应大小。
    viewCountChart.resize();
  };
}
onMounted(() => {
  initChart();
});
onUpdated(() => {
  initChart();
});
</script>

<style scoped></style>
