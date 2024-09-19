import { defineConfig } from "umi";

export default defineConfig({
  base: "/editor-theme",
  publicPath: "/editor-theme/",
  outputPath: "./editor-theme",
  title: "主题编辑",
  links: [
    { href: "/editor-theme/default-light.css" },
    { href: "/editor-theme/ant.var.css" },
  ],
  routes: [{ path: "/", component: "index" }],
  npmClient: "pnpm",
  mfsu: false,
});
