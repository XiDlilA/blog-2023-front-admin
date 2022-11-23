import type { Plugin } from "vite";
import Icons from 'unplugin-icons/vite'
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import IconsResolver from "unplugin-icons/resolver";

export default function autoImport(plugins: Plugin[]) {
  plugins.push(
    AutoImport({
      dts: "types/auto-imports.d.ts",
      imports: ["vue", "vue-router"],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
        })
      ],
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      dts: "types/components.d.ts",
      dirs: ["src/components"],
      directoryAsNamespace: true,
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
  );
}
