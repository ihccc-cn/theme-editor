import React, { FC } from "react";
import { useDynamicList } from "ahooks";
import { Tabs, Select, ColorPicker, InputNumber, Input, message } from "antd";
import Layout, { ToolButton } from "./layout";
import SliderWithUnit from "./slider-with-unit";
import EditorForm from "./editor-form";
import Previewer from "./previewer";
import { Importer, Exporter } from "./porter";
import { useVisible } from "./hooks";
import {
  getValue,
  groupBy,
  downloadFile,
  getThemeRules,
  buildCssStyle,
} from "./utils";
import defaultTheme from "./default-theme";
import { TThemeRule, TThemeData, TGroupedData } from "./type";
import "./index.less";

const inputComponents = {
  color: <ColorPicker showText placement="right" />,
  number: <InputNumber />,
  pixel: <SliderWithUnit />,
  input: <Input />,
};

let __UID__ = 1;
// 编辑器
const Editor: FC<{}> = () => {
  // 面板显示状态
  const [visible, setVisible] = useVisible({ import: false, export: false });
  // 导入导出格式
  const [importType, setImportType] = React.useState<string>("JSON");
  const [exportType, setExportType] = React.useState<string>("JSON");
  // 主题列表的所有数据
  const theme = useDynamicList<TThemeData>([defaultTheme as TThemeData]);
  // 当前选择的主题
  const [themeTabKey, setThemeTabKey] = React.useState<string>(
    defaultTheme.themeName
  );
  // 当前选择的主题索引
  const [themeIndex, setThemeIndex] = React.useState(0);
  // 当前主题变量数据
  const themeItem = useDynamicList<TThemeRule>(
    defaultTheme.list as TThemeRule[]
  );
  // 当前分组方式
  const [groupByType, setGroupByType] = React.useState<string>("byName");

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeTabKey);
  }, [themeTabKey]);

  // 主题新增删除
  const handleThemeEdit = React.useCallback(
    (
      themeKey: React.MouseEvent | React.KeyboardEvent | string,
      action: "add" | "remove"
    ) => {
      if (action === "add") {
        const themeName = `new-theme-${__UID__++}`;
        theme.push({ ...defaultTheme, themeName } as TThemeData);
        setThemeTabKey(themeName);
        setThemeIndex(theme.list.length);
      } else {
        const index = theme.list.findIndex(
          (item) => item.themeName === themeKey
        );
        if (themeKey === themeTabKey) {
          // 如果删除的选中的主题，是第一个，切换到下一个选项卡，否则，切换到上一个选项卡
          const activeIndex = index === 0 ? index + 1 : index - 1;
          setThemeTabKey(theme.list[activeIndex].themeName);
        }
        theme.remove(index);
      }
    },
    [themeTabKey, theme.list]
  );

  // 主题切换
  const hanleThemeChange = (themeKey: string) => {
    // 将当前主题数据保存下来
    theme.replace(themeIndex, {
      ...theme.list[themeIndex],
      list: themeItem.list,
    });
    const index = theme.list.findIndex((item) => item.themeName === themeKey);
    themeItem.resetList(theme.list[index].list);
    setThemeTabKey(themeKey);
    setThemeIndex(index);
  };

  // 修改主题名称
  const handleThemeName = (e: React.FormEvent) => {
    const themeName = getValue(e);
    if (!!theme.list.find((item) => item.themeName === themeName)) {
      message.warning("主题名称重复！");
      return;
    }
    setThemeTabKey((themeKey) => {
      const index = theme.list.findIndex((item) => item.themeName === themeKey);
      theme.replace(index, { ...theme.list[index], themeName });
      return themeName;
    });
  };

  // 改变分组
  const hanleThemeGroup = (groupKey: string) => {
    const currentTheme = theme.list[themeIndex];
    theme.replace(themeIndex, { ...currentTheme, groupKey });
  };

  // 主题选项列表
  const themeOptions = React.useMemo(() => {
    const closable = theme.list.length > 1;
    return theme.list.map(({ themeName }) => ({
      label: themeName,
      key: themeName,
      closable,
    }));
  }, [theme.list]);

  // 主题变量分组后数据
  const groupedData = React.useMemo(() => {
    // hanleThemeGroup("");
    const initData: TGroupedData = { defaultKey: "", group: [], list: {} };
    return themeItem.list.reduce((store, item) => {
      const groupName = groupBy.actions[groupByType]?.(item);
      if (groupName) {
        if (!store.defaultKey) store.defaultKey = groupName;
        if (!store.list[groupName]) {
          store.list[groupName] = [];
          store.group.push({ label: groupName, key: groupName });
        }
        store.list[groupName].push(item);
      }
      return store;
    }, initData);
  }, [groupByType, themeItem.list]);

  // 主题分组选中值
  const groupTabKeyActive =
    theme.list[themeIndex]?.groupKey || groupedData.defaultKey;

  // 主题变量转换为 css (实时)
  const cssStyle = React.useMemo(() => {
    return buildCssStyle({ themeName: themeTabKey, list: themeItem.list });
  }, [themeTabKey, themeItem.list]);

  // 修改变量值
  const handleThemeChange = React.useCallback(
    (value: any, item: any) => {
      const index = themeItem.list.indexOf(item);
      themeItem.replace(index, { ...item, value });
    },
    [themeItem.list]
  );

  // 标记删除变量值
  const handleThemeRemove = React.useCallback(
    (item: any) => {
      const index = themeItem.list.indexOf(item);
      themeItem.replace(index, { ...item, remove: !item.remove });
    },
    [themeItem.list]
  );

  // 导入操作
  const hanleImport = (content: string) => {
    let res = null;
    if (importType === "JSON") {
      try {
        res = JSON.parse(content);
      } catch (error) {}
    }
    if (importType === "CSS") res = getThemeRules(content);
    if (!res || !res.themeName || !Array.isArray(res.list)) {
      message.error("导入数据格式错误！");
      return;
    }
    theme.push(res);
    setThemeTabKey(res.themeName);
    setThemeIndex(theme.list.length);
    setVisible("import");
    message.success("导入成功！");
  };

  // 输出操作
  const handleOutput = () => {
    if (exportType === "CSS") return cssStyle;
    const themeItem = theme.list[themeIndex];
    return JSON.stringify(
      {
        themeName: themeTabKey,
        list: themeItem.list.filter((item) => !!item.name && !item.remove),
        ...(!themeItem.groupKey ? {} : { groupKey: themeItem.groupKey }),
      },
      null,
      2
    );
  };

  // 下载操作
  const handleDownload = (content: string) => {
    if (exportType === "JSON") downloadFile(content, `${themeTabKey}.json`);
    if (exportType === "CSS") downloadFile(content, `${themeTabKey}.css`);
  };

  return (
    <React.Fragment>
      <style scoped>{`${cssStyle}`}</style>
      <Layout
        tool={
          <ToolButton
            active={{ import: visible.import, export: visible.export }}
            onImport={() => setVisible("import")}
            onExport={() => setVisible("export")}
          />
        }
        side={
          <Tabs
            size="small"
            tabPosition="left"
            type="editable-card"
            items={themeOptions}
            activeKey={themeTabKey}
            onChange={hanleThemeChange}
            onEdit={handleThemeEdit}
          />
        }
        editor={
          <EditorForm
            extra={
              <React.Fragment>
                <Input
                  addonBefore="主题名称"
                  value={themeTabKey}
                  onChange={handleThemeName}
                />
                <Select
                  variant="borderless"
                  options={groupBy.options}
                  value={groupByType}
                  onChange={(type) => setGroupByType(type)}
                  style={{ width: 110 }}
                />
              </React.Fragment>
            }
            group={groupedData.group}
            tabKey={groupTabKeyActive}
            onTabChange={hanleThemeGroup}
            inputComponents={inputComponents}
            data={
              !groupTabKeyActive
                ? themeItem.list
                : groupedData.list[groupTabKeyActive] || []
            }
            onThemeChange={handleThemeChange}
            onThemeRemove={handleThemeRemove}
          />
        }
        view={
          <React.Fragment>
            {visible.import && (
              <Importer
                type={importType}
                onTypeChange={(type) => setImportType(type)}
                onConfirm={hanleImport}
                onCancel={() => setVisible("import")}
              />
            )}
            {visible.export && (
              <Exporter
                type={exportType}
                onTypeChange={(type) => setExportType(type)}
                onCancel={() => setVisible("export")}
                onOutput={handleOutput}
                onDownload={handleDownload}
              />
            )}
            {!visible.import && !visible.export && <Previewer />}
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
};

export default Editor;
