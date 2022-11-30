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
import autoload from "@/router/aotuload";
const user = useUser();
const router = useRouter();
onMounted(() => {
  if (user.loginState === true) {
    autoload(router);
    console.log(1);
  }
  // request.post("/report");
});
</script>
<style scoped></style>
