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
  defaultType: string;
  options: { label: string; value: string }[];
  actions: Record<string, (theme: TThemeRule) => string>;
} = {
  defaultType: "byName",
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

const regExp = {
  css: /\/\*(\s+|\s*)?(\W+)\s+?\*\/\s+\[data-theme=("|')(.+)("|')\].?\{\s+?(\/(\s|.)+)\}/,
  cssLine: /(\/\*(\W+):+?(\W+)\*\/|\/\*(\W+)\*\/)([-A-z]+):(.+)/,
};

/**
 * 将css 变量转换为 json 数据
 * @example
 * 参数格式必须为，注释可省略，如果省略了必须在两个变量中间空一行
 * /-* 主题名称 *-/
 * [data-theme="xxxx"]{
 *  /-* 变量名称: 变量描述 *-/
 *  --xxx: xxxx;
 * }
 */
export const getThemeRules = (css: string): TThemeData | null => {
  const cssData = regExp.css.exec(css) || [];

  if (!cssData[4]) return null;

  const themeData: TThemeData = {
    name: cssData[2],
    key: cssData[4],
    list: [],
  };

  const lines = cssData[6]
    .replace(/(\r|\n|\s)/g, "")
    .split(";")
    .filter((i) => !!i);

  for (let i = 0; i < lines.length; i += 2) {
    const cssLine = lines[i];
    const info = regExp.cssLine.exec(cssLine) || [];

    if (!info[5]) continue;

    const theme: TThemeRule = {
      type: "input",
      label: info[2] || info[4],
      desc: info[3],
      name: info[5],
      value: info[6],
    };

    if (/^(\#|rgb|hsb)/.test(theme.value)) {
      theme.type = "color";
    } else if (/^\d+(px|em|rem|vw|vh|vmin|vmax)$/.test(theme.value)) {
      theme.type = "pixel";
    } else if (/^\d+$/.test(theme.value)) {
      theme.type = "number";
    }
    themeData.list.push(theme);
  }

  return themeData;
};

/** 创建css样式 */
export const buildCssStyle = (themeData: TThemeData) => {
  const { name, key, list } = themeData;
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
    })
    .join("\n");
  // return `@import url(/editor-theme/ant.var.css);
  return `/* ${name || key} */
[data-theme="${key}"]{
${css}
}`;
};

/** 切换主题 */
export const changeTheme = (theme: string) => {
  document.documentElement.setAttribute("data-theme", theme);
};

/** 动画切换主题 */
export const changeThemeTransitional = async (
  theme: string,
  event?: MouseEvent
) => {
  // changeTheme(theme);
  // return;
  // @ts-ignore 在不支持的浏览器里不做动画
  if (!document.startViewTransition) {
    changeTheme(theme);
    return;
  }
  // @ts-ignore 开始一次视图过渡：
  const transition = document.startViewTransition(() => changeTheme(theme));

  await transition.ready;

  const x = !event ? window.innerWidth / 2 : event.clientX;
  const y = !event ? window.innerHeight / 2 : event.clientY;
  //计算按钮到最远点的距离用作裁剪圆形的半径
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  const keyframes = [
    { clipPath: `circle(0px at ${x}px ${y}px)` },
    { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
  ];
  //开始动画
  document.documentElement.animate(keyframes, {
    duration: 800,
    easing: "ease",
    pseudoElement: "::view-transition-new(root)",
  });
};
