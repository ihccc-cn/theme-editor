import { message } from "antd";
// @ts-ignore
import { saveAs } from "file-saver";
import { TThemeRule, TThemeData } from "./type";

export const copySuccess = () => message.success("拷贝成功！");

export const getValue = (e: any, type?: string) => {
  if (type === "color") return e.toHexString();
  return !e.target ? e : e.target.value;
};

/** 分组规则 */
export const groupBy: {
  options: { label: string; value: string }[];
  actions: Record<string, (theme: TThemeRule) => string>;
} = {
  options: [
    { label: "不显示分组", value: "none" },
    { label: "按类型分组", value: "byType" },
    { label: "按名称分组", value: "byName" },
  ],
  actions: {
    byType: (theme: TThemeRule) => {
      return { color: "颜色", number: "数值", pixel: "尺寸", input: "输入" }[
        theme.type
      ];
    },
    byName: (theme: TThemeRule) => {
      if (/--color-text/.test(theme.name)) return "文本颜色";
      if (/--color-bg/.test(theme.name)) return "背景";
      if (/-border/.test(theme.name)) return "边框";
      if (/--color-/.test(theme.name)) return "颜色";
      if (/-layout/.test(theme.name) || /--z/.test(theme.name)) return "布局";
      if (/--size-/.test(theme.name)) return "尺寸";
      return "其它";
    },
  },
};

/** 读取文件内容 */
export const readFile = (file: File, callback: any) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    if (event.target && event.target.result) {
      callback(event.target.result as string);
    } else {
      message.error("读取文件内容失败！");
    }
  };
  reader.onerror = () => {
    message.error("读取文件内容失败！");
  };
  reader.readAsText(file);
};

/** 保存内容到文件 */
export const downloadFile = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, fileName);
};

/**
 * 将css 变量转换为 json 数据
 * @example
 * 参数格式必须为，注释可省略，如果省略了必须在两个变量中间空一行
 * [data-theme="xxxx"]{
 *  /-* 变量名称: 变量描述 *-/
 *  --xxx: xxxx;
 * }
 */
export const getThemeRules = (css: string): TThemeData | null => {
  // FIXME: 值内换行导致的问题
  // TODO: 添加主题备注名称
  const themeName = /data-theme="([^"]+)"/.exec(css)?.[1];
  if (!themeName) return null;

  const lines = css.split("\n");
  const list: TThemeRule[] = [];

  const start = /data-theme/.test(lines[0]) ? 1 : 0;

  for (let i = start; i < lines.length; i += 2) {
    const noteLine = lines[i];
    const cssLine = lines[i + 1];
    if (!cssLine) continue;
    const theme: TThemeRule = {
      type: "input",
      label: "",
      desc: "",
      name: "",
      value: null,
    };
    // theme.name = cssLine.match(/--((\w|-)+)/)?.[1] || "";
    theme.name = (cssLine.match(/(.+?):/)?.[1] || "").replace(/\s+/g, "");
    if (!theme.name) continue;
    theme.value = cssLine.match(/:\s*(.+);/)?.[1] || "";
    const note = noteLine.match(/\/\*\s*(.+)\*\//)?.[1];
    if (!!note) {
      const [label, desc] = note.split(/:|：/);
      theme.label = (label || "").trim();
      theme.desc = (desc || "").trim();
    }
    if (/^(\#|rgb|hsb)/.test(theme.value)) {
      theme.type = "color";
    } else if (/^\d+(px|em|rem|vw|vh|vmin|vmax)$/.test(theme.value)) {
      theme.type = "pixel";
    } else if (/^\d+$/.test(theme.value)) {
      theme.type = "number";
    }
    list.push(theme);
  }

  return { themeName, list };
};

/** 创建css样式 */
export const buildCssStyle = (themeData: TThemeData) => {
  const { themeName, list } = themeData;
  const css = list
    .filter((item) => !!item.name && !item.remove)
    .map((item) => {
      let note = "";
      if (!!item.label) {
        note += "  /* " + item.label;
        if (!!item.desc) note += "：" + item.desc;
        note += " */";
      }
      const cssRule = `  ${item.name}: ${item.value};`;
      return [note, cssRule].join("\n");
    });
  // return `@import url(/editor-theme/ant.var.css);
  return `[data-theme="${themeName}"]{
${css.join("\n")}
}`;
};
