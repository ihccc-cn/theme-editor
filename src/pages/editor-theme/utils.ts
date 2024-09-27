import { message } from "antd";
import qs from "qs";
import { saveAs } from "file-saver";
import { TThemeRule, TThemeData } from "./type";

export const copySuccess = () => message.success("拷贝成功！");

export const getValue = (e: any, type?: string) => {
  if (type === "color") return e.toHexString();
  return !e.target ? e : e.target.value;
};

/** 读取缓存 */
export const getStorage = (key: string, defaultData: any) => {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "");
  } catch (error) {
    return defaultData;
  }
};

/** 设置缓存 */
export const setStorage = (key: string, data: any) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
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
      const typeName = {
        color: "颜色",
        number: "数值",
        pixel: "尺寸",
        input: "输入",
      };
      return typeName[theme.type];
    },
    byName: (theme: TThemeRule) => {
      if (/-layout/.test(theme.name) || /--z/.test(theme.name)) return "布局";
      if (/-border/.test(theme.name)) return "边框";
      if (/--color-text/.test(theme.name)) return "文本颜色";
      if (/--color-bg/.test(theme.name)) return "背景";
      if (/--color-/.test(theme.name)) return "颜色";
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
  css: /(\/\*(\s*)?(.+)?(\s*)?\*\/\s*?)?\[data-theme=("|')(.+)("|')\].?\{([^\}]*)\}(\s*)?((.|\s)*)?/,
  cssLine:
    /\s*?\/\*(\s*)?([^:?]+):?(\s*)?([^?]+)?(\s*)?\??([-=&\w]+)?(\s*)?\*\/\s*?([-\w]+):\s*((\s|.)*)/,
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

  if (!cssData[6]) return null;

  const themeData: TThemeData = {
    name: (cssData[3] || "").trim(),
    key: cssData[6],
    list: [],
    extra: (cssData[10] || "").trim(),
  };

  const lines = (cssData[8] || "").split(";").filter((i) => !!i);

  for (let i = 0; i < lines.length; i += 1) {
    const cssLine = lines[i];
    const info = regExp.cssLine.exec(cssLine) || [];

    if (!info[8]) continue;

    const theme: TThemeRule = {
      type: "input",
      label: info[2],
      desc: (info[4] || "").trim(),
      name: info[8],
      value: info[9] || "",
    };

    if (!!info[6]) theme.props = qs.parse(info[6]);

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
export const buildCssStyle = (
  themeData: TThemeData,
  config?: { filterRemove?: boolean; noteInfo?: boolean }
) => {
  const { name, key, list, extra } = themeData;

  if (!key) return "";

  const extraContent = !!extra ? "\n\n" + extra : "";

  const css = list
    .filter((item) => {
      if (!item.name) return false;
      if (config?.filterRemove && item.remove) return false;
      return true;
    })
    .map((item) => {
      const cssLine = `  ${item.name}: ${item.value};`;
      if (!config?.noteInfo) return cssLine;
      let note = "";
      if (!!item.label) {
        note += "  /* " + item.label;
        if (!!item.desc) note += ": " + item.desc;
        if (!!item.props) note += "?" + qs.stringify(item.props);
        note += " */";
      }
      return [note, cssLine].join("\n");
    })
    .join("\n");

  return `/* ${name || key} */
[data-theme="${key}"]{
${css}
}${extraContent}`;
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
    duration: 500,
    easing: "ease",
    pseudoElement: "::view-transition-new(root)",
  });
};
