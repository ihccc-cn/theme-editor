import { defineConfig } from "umi";

export default defineConfig({
  base: "/editor-theme",
  publicPath: "/editor-theme/",
  outputPath: "./editor-theme",
  title: "主题编辑",
  links: [{ href: "/editor-theme/default-light.css" }],
  routes: [{ path: "/", component: "index" }],
  request: {},
  fastRefresh: true,
  mfsu: false,
});
