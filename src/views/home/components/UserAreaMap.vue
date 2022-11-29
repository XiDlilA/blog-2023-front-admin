<template>
  <div ref="main" style="height: 350px; width: 100%" />
</template>

<script setup>
// http://datav.aliyun.com/portal/school/atlas/area_selector#&lat=30.332329214580188&lng=106.72278672066881&zoom=3.5
import { useHome } from "../../../stores/home";
import { storeToRefs } from "pinia";
import { initChart } from "../../../plugins/charts";
import * as echarts from "echarts";
import chinaJSON from "../../../assets/json/china.json";
const home = useHome();
const { articleRankData: data } = storeToRefs(home);
const main = ref();
echarts.registerMap("china", chinaJSON);
let regions = [
  {
    name: "新疆维吾尔自治区",
    itemStyle: {
      areaColor: "#374ba4",
      opacity: 1,
    },
  },
  {
    name: "陕西省",
    itemStyle: {
      areaColor: "#fd691b",
      opacity: 1,
    },
  },
  {
    name: "黑龙江省",
    itemStyle: {
      areaColor: "#ffc556",
      opacity: 1,
    },
  },
];
const zoom = 1.5;
const option = reactive({
  visualMap: {
    min: 0,
    max: 1000,
    right: 26,
    bottom: 40,
    showLabel: !0,
    pieces: [
      {
        gt: 100,
        label: "100人以上",
        color: "#ED5351",
      },
      {
        gte: 51,
        lte: 100,
        label: "51-100人",
        color: "#59D9A5",
      },
      {
        gte: 21,
        lte: 50,
        label: "21-50人",
        color: "#F6C021",
      },
      {
        label: "1-20人",
        gt: 0,
        lte: 20,
        color: "#6DCAEC",
      },
    ],
    show: !0,
  },
  geo: {
    map: "china",
    roam: false, //是否允许缩放，拖拽
    zoom: zoom, //初始化大小
    //设置中心点
    center: [115.97, 35.71],
    //省份地图添加背景
    regions: regions,
    itemStyle: {
      areaColor: "#EEEEEE",
      borderColor: "#CCCCCC",
      borderWidth: 1,
    },
    //高亮状态
    emphasis: {
      itemStyle: {
        areaColor: "#F5DEB3",
        color: "#fff",
      },
    },
  },
  //配置属性
  series: {
    name: "用户人数",
    type: "map",
    geoIndex: 0,
    data: [
      {
        name: "四川省",
        value: 5,
      },
    ],
    areaColor: "#0FB8F0",
  },
});
let userMapChart;
onMounted(() => {
  initChart(userMapChart, main, option);
});
onUpdated(() => {
  initChart(userMapChart, main, option);
});
</script>

<style scoped></style>
