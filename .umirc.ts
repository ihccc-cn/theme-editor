import { defineConfig } from "@umijs/max";

export default defineConfig({
  base: "/editor-theme",
  publicPath: "/editor-theme/",
  outputPath: "./editor-theme",
  title: "主题编辑",
  routes: [{ path: "/", component: "index" }],
  request: {},
  fastRefresh: true,
  mfsu: false,
});
