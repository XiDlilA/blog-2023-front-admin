import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/index.css";
import { setupPlugins } from "@/plugins";

const app = createApp(App);
setupPlugins(app);
app.mount("#app");
