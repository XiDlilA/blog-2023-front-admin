<template>
  <div ref="main" style="height: 350px" />
</template>

<script setup>
import { useHome } from "../../../stores/home";
import { storeToRefs } from "pinia";
import { initChart } from "../../../plugins/charts";
const home = useHome();
const { viewCountData: data } = storeToRefs(home);
const main = ref();
let viewCountChart;
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
    data: data?.value?.map((item) => item.date),
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
      data: data?.value?.map((item) => item.count),
      smooth: true,
    },
  ],
};
onMounted(() => {
  initChart(viewCountChart, main, option);
});
onUpdated(() => {
  initChart(viewCountChart, main, option);
});
</script>

<style scoped></style>
