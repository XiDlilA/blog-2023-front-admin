<template>
  <div ref="main" style="height: 350px" />
</template>

<script setup>
import { useHome } from "../../../stores/home";
import { storeToRefs } from "pinia";
import { initChart } from "../../../plugins/charts";
const home = useHome();
const { categoryData: data } = storeToRefs(home);
const main = ref();
const option = reactive({
  color: ["#7EC0EE", "#FF9F7F", "#FFD700", "#C9C9C9", "#E066FF", "#C0FF3E"],
  legend: {
    data: data?.value?.map((item) => item.title),
    bottom: "bottom",
  },
  tooltip: {
    trigger: "item",
  },
  series: [
    {
      name: "文章分类",
      type: "pie",
      roseType: "radius",
      data: data?.value?.map((item) => {
        return {
          value: item.count,
          name: item.title,
        };
      }),
    },
  ],
});
let categoryChart;
onMounted(() => {
  initChart(categoryChart, main, option);
});
onUpdated(() => {
  initChart(categoryChart, main, option);
});
</script>

<style scoped></style>
