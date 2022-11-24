<template>
  <div style="font-size: 8px">
    <calendar-heatmap
      :round="5"
      :values="data"
      :end-date="new Date()"
      :range-color="rangeColor"
      :max="max"
    />
  </div>
</template>

<script setup>
import { useHome } from "../../../stores/home";
import { storeToRefs } from "pinia";
const home = useHome();
const { headMapData: data } = storeToRefs(home);
console.log(data.value);
const max = 5;
const rangeColor = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
</script>

<style scoped></style>
