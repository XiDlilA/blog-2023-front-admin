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
import autoload from "@/router/aotuload";
const user = useUser();
const router = useRouter();
onBeforeMount(() => {
  if (user.loginState === true) {
    autoload(router);
  }
  // request.post("/report");
});
</script>
<style scoped></style>
