import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/index.css";
import { setupPinia } from "@/plugins/pinia";
import { setupRouter } from "./router";

const app = createApp(App);
setupPinia(app);
setupRouter(app);
app.mount("#app");
