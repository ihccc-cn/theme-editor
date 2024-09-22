export type TThemeRule = {
  /** 变量名 */
  name: string;
  /** 值 */
  value: any;
  /** 标签名称 */
  label: string;
  /** 描述 */
  desc: string;
  /** 值类型/输入类型 */
  type: "color" | "number" | "pixel" | "input";
  /** 是否标记 !important */
  important?: boolean;
  /** 是否标记为删除 */
  remove?: boolean;
};

export type TThemeData = {
  /** 主题名称 */
  themeName: string;
  /** 变量列表 */
  list: TThemeRule[];
  /** 当前分组选项卡 */
  groupKey?: string;
};

export type TGroupedData = {
  defaultKey: string;
  group: { label: string; key: string }[];
  list: Record<string, any>;
};
