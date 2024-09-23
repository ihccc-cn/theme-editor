import React, { FC } from "react";
import { Tabs, Select, ColorPicker, InputNumber, Input, message } from "antd";
import Layout, { ToolButton } from "./layout";
import SliderWithUnit from "./slider-with-unit";
import EditorForm from "./editor-form";
import Previewer from "./previewer";
import { Importer, Exporter } from "./porter";
// import { useVisible, useLocalTheme } from "./hooks";
import { useVisible, useRemoteTheme } from "./hooks";
import {
  getValue,
  groupBy,
  downloadFile,
  getThemeRules,
  buildCssStyle,
  changeTheme,
} from "./utils";
import { TThemeData, TGroupedData } from "./type";
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
  const theme = useRemoteTheme();
  // 当前主题变量数据
  const themeItem = theme.children;
  const [groupByType, setGroupByType] = React.useState<string>(
    groupBy.defaultType
  );

  React.useEffect(() => {
    changeTheme(theme.active.key);
  }, [theme.active]);

  // 主题新增删除
  const handleThemeEdit = (
    themeKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      // 从当前主题衍生新的主题
      const themeId = __UID__++;
      theme.add({
        name: `新主题-${themeId}`,
        key: `new-theme-${themeId}`,
        list: themeItem.list,
      });
    } else {
      theme.remove(themeKey as string);
    }
  };

  // 修改主题名称
  const handleThemeName = (e: React.FormEvent) => {
    const key = getValue(e);
    if (theme.findIndex(key) > -1) {
      message.warning("主题名称重复！");
      return;
    }
    theme.update({ key });
  };

  // 更改主题的分组
  const hanleThemeGroup = (groupKey: string) => {
    theme.update({ groupKey });
  };

  // 主题变量分组后数据
  const groupedData = React.useMemo(() => {
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
  const groupTabKeyActive = theme.groupKey || groupedData.defaultKey;

  // 主题变量转换为 css (实时)
  const cssStyle = React.useMemo(() => {
    return buildCssStyle({
      name: theme.name,
      key: theme.active.key,
      list: themeItem.list,
    });
  }, [theme.name, theme.active, themeItem.list]);

  // 修改变量值
  const handleThemeItemChange = (value: any, item: any) => {
    const index = themeItem.list.indexOf(item);
    themeItem.replace(index, { ...item, value });
  };

  // 标记删除变量值
  const handleThemeItemRemove = (item: any) => {
    const index = themeItem.list.indexOf(item);
    themeItem.replace(index, { ...item, remove: !item.remove });
  };

  // 导入操作
  const hanleImport = (content: string) => {
    let res: TThemeData | null = null;
    if (importType === "JSON") {
      try {
        res = JSON.parse(content);
      } catch (error) {}
    }
    if (importType === "CSS") res = getThemeRules(content);
    if (!res || !res.key || !Array.isArray(res.list)) {
      message.error("导入数据格式错误！");
      return;
    }
    const index = theme.findIndex(res.key);
    // if(index ===  -1) {
    //   // 添加一个临时的 tab
    // }
    // theme.setActive( res.key);
    // // 更新当前主题
    // themeItem.resetList(res.list);
    // // 显示保存按钮
    // 存在，更新主题，不存在新增主题
    if (index > -1) {
      theme.update(res);
    } else {
      theme.add(res);
    }
    themeItem.resetList(res.list);
    setVisible("import");
    message.success("导入成功！");
  };

  // 输出操作
  const handleOutput = () => {
    if (exportType === "CSS") return cssStyle;
    return JSON.stringify(
      {
        // 获取名称
        name: theme.name,
        key: theme.active.key,
        list: themeItem.list.filter((item) => !!item.name && !item.remove),
        ...(!theme.groupKey ? {} : { groupKey: theme.groupKey }),
      },
      null,
      2
    );
  };

  // 下载操作
  const handleDownload = (content: string) => {
    const key = theme.active.key;
    if (exportType === "JSON") downloadFile(content, `${key}.json`);
    if (exportType === "CSS") downloadFile(content, `${key}.css`);
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
            items={theme.themeList}
            activeKey={theme.active.key}
            onChange={theme.setActive}
            onEdit={handleThemeEdit}
          />
        }
        editor={
          <EditorForm
            extra={
              <React.Fragment>
                <Input
                  addonBefore="主题名称"
                  value={theme.active.key}
                  onChange={handleThemeName}
                />
                <Select
                  variant="borderless"
                  options={groupBy.options}
                  value={groupByType}
                  onChange={setGroupByType}
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
            onThemeChange={handleThemeItemChange}
            onThemeRemove={handleThemeItemRemove}
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
