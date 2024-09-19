import { defineConfig } from "umi";

export default defineConfig({
  title: "主题编辑",
  links: [{ href: "/default-light.css" }],
  routes: [{ path: "/", component: "index" }],
  npmClient: "pnpm",
});
