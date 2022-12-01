import type { App } from "vue";
import mdEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";

export function setupMdEditor(app: App) {
  app.use(mdEditor);
}
