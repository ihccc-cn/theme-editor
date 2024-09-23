const DEFAULT_THEME_DATA = {
  name: "默认浅色",
  key: "defaultLight",
  list: [
    {
      type: "color",
      label: "主色",
      desc: "",
      name: "--color-primary",
      value: "#3b82f6",
      id: "theme-2",
    },
    {
      type: "color",
      label: "主色",
      desc: "次要",
      name: "--color-primary-secondary",
      value: "#c7d7f1",
      id: "theme-2",
    },
    {
      type: "color",
      label: "主色",
      desc: "禁用状态",
      name: "--color-primary-disabled",
      value: "#133263",
      id: "theme-2",
    },
    {
      type: "color",
      label: "主色",
      desc: "浮动状态",
      name: "--color-primary-hover",
      value: "#5893f1",
      id: "theme-2",
    },
    {
      type: "color",
      label: "主色",
      desc: "激活状态",
      name: "--color-primary-active",
      value: "#2e74e6",
      id: "theme-2",
    },
    {
      type: "color",
      label: "状态色",
      desc: "默认",
      name: "--color-status-default",
      value: "#9e9e9e",
      id: "theme-2",
    },
    {
      type: "color",
      label: "状态色",
      desc: "默认次要",
      name: "--color-status-default-secondary",
      value: "#f5f5f5",
      id: "theme-2",
    },
    {
      type: "color",
      label: "状态色",
      desc: "进行中",
      name: "--color-status-processing",
      value: "#2196f3",
      id: "theme-2",
    },
    {
      type: "color",
      label: "状态色",
      desc: "进行中次要",
      name: "--color-status-processing-secondary",
      value: "#bbdefb",
      id: "theme-2",
    },
    {
      type: "color",
      label: "状态色",
      desc: "成功",
      name: "--color-status-success",
      value: "#4caf50",
      id: "theme-2",
    },
    {
      type: "color",
      label: "状态色",
      desc: "成功次要",
      name: "--color-status-success-secondary",
      value: "#c8e6c9",
      id: "theme-2",
    },
    {
      type: "color",
      label: "状态色",
      desc: "警告",
      name: "--color-status-warning",
      value: "#ff9800",
      id: "theme-2",
    },
    {
      type: "color",
      label: "状态色",
      desc: "警告次要",
      name: "--color-status-warning-secondary",
      value: "#ffecb3",
      id: "theme-2",
    },
    {
      type: "color",
      label: "状态色",
      desc: "错误",
      name: "--color-status-error",
      value: "#f44336",
      id: "theme-2",
    },
    {
      type: "color",
      label: "状态色",
      desc: "错误次要",
      name: "--color-status-error-secondary",
      value: "#ffcdd2",
      id: "theme-2",
    },
    {
      type: "color",
      label: "文字颜色",
      desc: "",
      name: "--color-text",
      value: "#393939",
      id: "theme-2",
    },
    {
      type: "color",
      label: "文字颜色",
      desc: "次要",
      name: "--color-text-secondary",
      value: "#535353",
      id: "theme-2",
    },
    {
      type: "color",
      label: "文字反色",
      desc: "",
      name: "--color-text-inverse",
      value: "#f8fafc",
      id: "theme-2",
    },
    {
      type: "color",
      label: "文字标题颜色",
      desc: "",
      name: "--color-text-heading",
      value: "#03255c",
      id: "theme-2",
    },
    {
      type: "color",
      label: "文字描述颜色",
      desc: "",
      name: "--color-text-desc",
      value: "#a9a9a9",
      id: "theme-2",
    },
    {
      type: "color",
      label: "文字颜色，禁用状态",
      desc: "",
      name: "--color-text-disabled",
      value: "#737373",
      id: "theme-2",
    },
    {
      type: "color",
      label: "文字颜色",
      desc: "浮动状态",
      name: "--color-text-hover",
      value: "#4d4d4d",
      id: "theme-2",
    },
    {
      type: "color",
      label: "文字颜色",
      desc: "激活状态",
      name: "--color-text-active",
      value: "#3b82f6",
      id: "theme-2",
    },
    {
      type: "color",
      label: "背景色",
      desc: "",
      name: "--color-bg",
      value: "#f5f5f5",
      id: "theme-2",
    },
    {
      type: "color",
      label: "背景次要颜色",
      desc: "",
      name: "--color-bg-secondary",
      value: "#f1f1f1",
      id: "theme-2",
    },
    {
      type: "color",
      label: "背景反色",
      desc: "",
      name: "--color-bg-inverse",
      value: "#1e293b",
      id: "theme-2",
    },
    {
      type: "color",
      label: "布局顶栏背景色",
      desc: "",
      name: "--color-bg-layout-header",
      value: "#ffffff",
      id: "theme-2",
    },
    {
      type: "color",
      label: "布局侧栏背景色",
      desc: "",
      name: "--color-bg-layout-side",
      value: "#ffffff",
      id: "theme-2",
    },
    {
      type: "color",
      label: "组件背景色",
      desc: "",
      name: "--color-bg-component",
      value: "#ffffff",
      id: "theme-2",
    },
    {
      type: "color",
      label: "组件背景色",
      desc: "次要",
      name: "--color-bg-component-secondary",
      value: "#f9f9f9",
      id: "theme-2",
    },
    {
      type: "color",
      label: "组件背景色",
      desc: "禁用状态",
      name: "--color-bg-component-disabled",
      value: "#e2e2e2",
      id: "theme-2",
    },
    {
      type: "color",
      label: "组件背景色",
      desc: "浮动状态",
      name: "--color-bg-component-hover",
      value: "#f1f1f1",
      id: "theme-2",
    },
    {
      type: "color",
      label: "组件背景颜色",
      desc: "激活状态",
      name: "--color-bg-component-active",
      value: "#3b82f6",
      id: "theme-2",
    },
    {
      type: "color",
      label: "弹出层背景色",
      desc: "",
      name: "--color-bg-popover",
      value: "#ffffff",
      id: "theme-2",
    },
    {
      type: "color",
      label: "背景色，占用",
      desc: "",
      name: "--color-bg-placeholder",
      value: "#9ca3af",
      id: "theme-2",
    },
    {
      type: "color",
      label: "背景色，遮罩",
      desc: "",
      name: "--color-bg-mask",
      value: "rgba(0,0,0,0.3)",
      id: "theme-2",
    },
    {
      type: "color",
      label: "背景色，模糊背景",
      desc: "",
      name: "--color-bg-blur",
      value: "rgba(55,65,81,0.1)",
      id: "theme-2",
    },
    {
      type: "color",
      label: "边框颜色",
      desc: "",
      name: "--color-border",
      value: "#d9d9d9",
      id: "theme-2",
    },
    {
      type: "color",
      label: "边框颜色，次要",
      desc: "",
      name: "--color-border-secondary",
      value: "#e5e5e5",
      id: "theme-2",
    },
    {
      type: "color",
      label: "边框颜色，反色",
      desc: "",
      name: "--color-border-inverse",
      value: "#414141",
      id: "theme-2",
    },
    {
      type: "color",
      label: "边框颜色",
      desc: "禁用状态",
      name: "--color-border-disabled",
      value: "#d1d1d1",
      id: "theme-2",
    },
    {
      type: "color",
      label: "边框颜色",
      desc: "悬浮状态",
      name: "--color-border-hover",
      value: "#e9e9e9",
      id: "theme-2",
    },
    {
      type: "color",
      label: "边框颜色",
      desc: "激活状态",
      name: "--color-border-active",
      value: "#3b82f6",
      id: "theme-2",
    },
    {
      type: "input",
      label: "背景图",
      desc: "登录页",
      name: "--image-bg-layout-login",
      value: "unset",
      id: "theme-2",
    },
    {
      type: "input",
      label: "背景图",
      desc: "布局顶栏",
      name: "--image-bg-layout-header",
      value: "unset",
      id: "theme-2",
    },
    {
      type: "input",
      label: "背景图",
      desc: "布局主体",
      name: "--image-bg-layout-body",
      value: "unset",
      id: "theme-2",
    },
    {
      type: "input",
      label: "背景图",
      desc: "布局侧栏",
      name: "--image-bg-layout-side",
      value: "unset",
      id: "theme-2",
    },
    {
      type: "pixel",
      label: "圆角尺寸",
      desc: "",
      name: "--size-border-radius",
      value: "6px",
      id: "theme-2",
    },
    {
      type: "pixel",
      label: "圆角小尺寸",
      desc: "",
      name: "--size-border-radius-sm",
      value: "4px",
      id: "theme-2",
    },
    {
      type: "pixel",
      label: "圆角大尺寸",
      desc: "",
      name: "--size-border-radius-lg",
      value: "8px",
      id: "theme-2",
    },
    {
      type: "pixel",
      label: "边框尺寸",
      desc: "",
      name: "--size-border-width",
      value: "1px",
      id: "theme-2",
    },
    {
      type: "pixel",
      label: "内容间隙",
      desc: "",
      name: "--size-cell-gap",
      value: "16px",
      id: "theme-2",
    },
    {
      type: "pixel",
      label: "内容间隙小尺寸",
      desc: "",
      name: "--size-cell-gap-sm",
      value: "8px",
      id: "theme-2",
    },
    {
      type: "pixel",
      label: "内容间隙大尺寸",
      desc: "",
      name: "--size-cell-gap-lg",
      value: "24px",
      id: "theme-2",
    },
    {
      type: "pixel",
      label: "默认页面顶栏高度",
      desc: "",
      name: "--size-layout-header-height",
      value: "52px",
      id: "theme-2",
    },
    {
      type: "pixel",
      label: "页面顶栏扩展高度",
      desc: "可以显示更多信息",
      name: "--size-layout-header-height-expand",
      value: "78px",
      id: "theme-2",
    },
    {
      type: "pixel",
      label: "内容固定宽度尺寸",
      desc: "",
      name: "--size-layout-content-width",
      value: "1400px",
      id: "theme-2",
    },
    {
      type: "input",
      label: "字体",
      desc: "",
      name: "font-family",
      value:
        "-apple-system,BlinkMacSystemFont,'SegoeUI',Roboto,'HelveticaNeue',Arial,'NotoSans',sans-serif,'AppleColorEmoji','SegoeUIEmoji','SegoeUISymbol','NotoColorEmoji'",
      id: "theme-2",
    },
    {
      type: "input",
      label: "系统色调",
      desc: "",
      name: "color-scheme",
      value: "light",
      id: "theme-2",
    },
    {
      type: "input",
      label: "系统强调色",
      desc: "",
      name: "accent-color",
      value: "var(--color-primary)",
      id: "theme-2",
    },
  ],
};

/** 主题列表数据 */
let themeList = [
  {
    id: "theme-0",
    name: "默认浅色",
    key: "defaultLight",
  },
];

let themeItemList: {
  type: string;
  label: string;
  desc: string;
  name: string;
  value: string | number;
  id: string;
  remove?: boolean;
}[] = DEFAULT_THEME_DATA.list.map((item) => ({ ...item, id: "theme-0" }));

const changeHash: Record<string, number> = {};

let __UID__ = 1;

export default {
  /** 查询主题变更hash */
  "GET /mock/theme/hash": async (_: any, res: any) => {
    res.json({ code: "0", data: changeHash, message: "成功！" });
  },

  /** 查询主题列表 */
  "GET /mock/theme/list": async (_: any, res: any) => {
    res.json({ code: "0", list: themeList, message: "成功！" });
  },

  /** 添加主题 */
  "POST /mock/theme/create": async (req: any, res: any) => {
    const { name, key, list } = req.body;
    const id = `theme-${__UID__++}`;
    // 创建一个主题
    themeList.push({ id, name, key });
    const defaultList = (list || []).map((item: any) => ({ ...item, id }));
    // 在主题内默认添加继承的变量
    themeItemList = themeItemList.concat(defaultList);
    changeHash[key] = new Date().getTime();
    res.json({ code: "0", message: "成功！" });
  },

  /** 更新主题 */
  "POST /mock/theme/update": async (req: any, res: any) => {
    const { id, name, key } = req.body;
    const index = themeList.findIndex((item) => item.id === id);
    if (themeList.findIndex((item) => item.key === key) > -1) {
      res.json({ code: "0", message: "重复的主题 key！" });
      return;
    }
    themeList.splice(index, 1, { id, name, key });
    changeHash[key] = new Date().getTime();
    res.json({ code: "0", message: "成功！" });
  },

  /** 删除主题 */
  "POST /mock/theme/remove": async (req: any, res: any) => {
    const { key } = req.body;
    let id = "";
    themeList = themeList.filter((item) => {
      if (item.key !== key) return true;
      id = item.id;
      return false;
    });
    if (!!id) themeItemList = themeItemList.filter((item) => item.id !== id);
    delete changeHash[key];
    res.json({ code: "0", message: "成功！" });
  },

  /** 查询主题详情列表 */
  "GET /mock/theme/item/list": async (req: any, res: any) => {
    const { id } = req.query;
    const list = themeItemList.filter((item) => item.id === id);
    res.json({ code: "0", list: list, message: "成功！" });
  },

  /** 更新主题详情 */
  "POST /mock/theme/item/update": async (req: any, res: any) => {
    const { key, type, label, desc, name, value, remove, id } = req.body;
    const index = themeItemList.findIndex(
      (item) => item.id === id && item.name === name
    );
    themeItemList.splice(index, 1, {
      type,
      label,
      desc,
      name,
      value,
      remove,
      id,
    });
    changeHash[key] = new Date().getTime();
    res.json({ code: "0", message: "成功！" });
  },
};
