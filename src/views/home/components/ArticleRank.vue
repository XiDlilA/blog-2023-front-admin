<template>
  <div ref="main" style="height: 350px" />
</template>

<script setup>
// todo: 将这类 Charts 打包成一个组件
import { useHome } from "../../../stores/home";
import { storeToRefs } from "pinia";
import { initChart } from "../../../plugins/charts";
const home = useHome();
const { articleRankData: data } = storeToRefs(home);
const main = ref();
const option = reactive({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
  },
  color: ["#58AFFF"],
  grid: {
    left: "0%",
    right: "0%",
    bottom: "0%",
    top: "10%",
    containLabel: true,
  },
  xAxis: {
    data: data?.value?.map((item) => item.title),
  },
  yAxis: {},
  series: [
    {
      name: "浏览量",
      type: "bar",
      data: data?.value?.map((item) => item.count),
    },
  ],
});
let articleRankChart;
onMounted(() => {
  initChart(articleRankChart, main, option);
});
onUpdated(() => {
  initChart(articleRankChart, main, option);
});
</script>

<style scoped></style>
