import type { Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import autoImport from "./autoImport";
import styleImport from "./styleImport";

export default function setupPlugins() {
  const plugins: Plugin[] = [vue()];
  autoImport(plugins);
  styleImport(plugins);
  return plugins;
}
