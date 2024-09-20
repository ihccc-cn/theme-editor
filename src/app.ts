import React from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

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
