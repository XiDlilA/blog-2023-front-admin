import type { Plugin } from "vite";
import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from "vite-plugin-style-import";

export default function styleImport(plugins: Plugin[]) {
  plugins.push(
    createStyleImportPlugin({
      resolves: [ElementPlusResolve()],
      libs: [
        {
          libraryName: "vxe-table",
          esModule: true,
          resolveStyle: (name: string) => `vxe-table/es/${name}/style.css`,
        },
      ],
    })
  );
}
