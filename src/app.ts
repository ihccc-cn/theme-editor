import React from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "./ant.var.css";

window.onload = () => {
  document.documentElement.setAttribute("data-theme", "defaultLight");
};

export function rootContainer(container: any) {
  return React.createElement(
    ConfigProvider,
    {
      theme: { cssVar: true, hashed: false },
      locale: zhCN,
    },
    container
  );
}

export const request = {
  timeout: 3000,
};
