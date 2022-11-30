<template>
  <div id="app">
    <RouterView />
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useUser } from "@/stores/user";
import request from "@/utils/request";
import autoload from "@/router/autoload";
const user = useUser();
const router = useRouter();
onMounted(() => {
  if (user.loginState === true) {
    autoload(router);
    console.log("loading success");
  }
  // request.post("/report");
});
</script>
<style scoped></style>
