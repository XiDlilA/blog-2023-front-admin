<template>
  <div id="app">
    <RouterView />
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { generaMenu } from "./assets/js/menu";
import { useUser } from "@/stores/user";
import request from "@/utils/request";
const user = useUser();
onMounted(() => {
  if (user.loginState === true) {
    generaMenu();
  }
  // request.post("/report");
});
</script>
<style scoped></style>
