import React, { FC } from "react";
import {
  Tabs,
  ColorPicker,
  InputNumber,
  Input,
  Button,
  Spin,
  Empty,
  message,
} from "antd";
import Layout, { ToolButton } from "./layout";
import SliderWithUnit from "./slider-with-unit";
import EditorForm from "./editor-form";
import Previewer from "./previewer";
import { Importer, Exporter } from "./porter";
import Setting from "./setting";
// import { useVisible, useLocalTheme } from "./hooks";
import { useVisible, useRemoteTheme } from "./hooks";
import {
  THEME_CACHE_KEY,
  THEME_DEFAULT_SERVER,
  THEME_HIDE_ADD_BUTTON,
} from "./constant";
import {
  // getValue,
  groupBy,
  downloadFile,
  getThemeRules,
  buildCssStyle,
  // changeTheme,
  changeThemeTransitional,
  getStorage,
  setStorage,
} from "./utils";
import defaultTheme from "./default-theme";
import { TThemeData, TGroupedData } from "./type";
import "./index.less";

const inputComponents = {
  color: <ColorPicker showText placement="right" />,
  number: <InputNumber />,
  pixel: <SliderWithUnit />,
  input: <Input />,
};

const DEFAULT_SETTING = {
  server: THEME_DEFAULT_SERVER,
  groupByType: groupBy.defaultType,
};

let __UID__ = 1;
// 编辑器
const Editor: FC<{}> = () => {
  // 用户设置
  const [themeSetting, setThemeSetting] = React.useState<Record<string, any>>(
    getStorage(THEME_CACHE_KEY, DEFAULT_SETTING)
  );
  // 面板显示状态
  const [visible, setVisible] = useVisible({
    import: false,
    export: false,
    setting: themeSetting === DEFAULT_SETTING,
  });
  // 导入导出格式
  const [importType, setImportType] = React.useState<string>("JSON");
  const [importContent, setImportContetn] = React.useState<string>("");
  const [exportType, setExportType] = React.useState<string>("JSON");
  const theme = useRemoteTheme({ server: themeSetting.server });

  React.useEffect(() => {
    if (theme.active.key) changeThemeTransitional(theme.active.key);
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
        list: theme.list,
      });
    } else {
      theme.remove(themeKey as string);
    }
  };

  // 修改主题名称
  const handleThemeName = (e: React.FormEvent) => {
    // const key = getValue(e);
    // if (theme.findIndex(key) > -1) {
    //   message.warning("主题名称重复！");
    //   return;
    // }
    // theme.update({ key });
  };

  // 主题变量分组后数据
  const groupedData = React.useMemo(() => {
    const initData: TGroupedData = { defaultKey: "", group: [], list: {} };
    return theme.list.reduce((store, item) => {
      const groupName = groupBy.actions[themeSetting.groupByType]?.(item);
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
  }, [themeSetting.groupByType, theme.list]);

  // 主题分组选中值
  const groupTabKeyActive = theme.group || groupedData.defaultKey;

  // 主题变量转换为 css (实时)
  const cssStyle = React.useMemo(() => {
    return buildCssStyle({
      name: theme.current.name,
      key: theme.current.key,
      list: theme.list,
    });
  }, [theme.current, theme.list]);

  // 修改变量值
  const handleThemeItemChange = (value: any, item: any) => {
    theme.updateItem({ ...item, value });
  };

  // 标记删除变量值
  const handleThemeItemRemove = (item: any) => {
    theme.updateItem({ ...item, remove: !item.remove });
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
    theme.add(res);
    setVisible("import");
    message.success("导入成功！");
  };

  // 输出操作
  const handleOutput = () => {
    if (exportType === "CSS") {
      return buildCssStyle(
        {
          name: theme.current.name,
          key: theme.current.key,
          list: theme.list,
        },
        {
          filterRemove: true,
          noteInfo: true,
        }
      );
    }
    return JSON.stringify(
      {
        // 获取名称
        name: theme.current.name,
        key: theme.current.key,
        list: theme.list.filter((item) => !!item.name && !item.remove),
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
        footer={
          <React.Fragment>
            <div className="we-system-analysis">{theme.infos}</div>
            {/* <div className="we-system-message">系统消息</div> */}
          </React.Fragment>
        }
        tool={
          <ToolButton
            shouldUpdate={theme.shouldUpdate}
            active={{
              import: visible.import,
              export: visible.export,
              setting: visible.setting,
            }}
            onUpdate={theme.refresh}
            onImport={() => setVisible("import")}
            onExport={() => setVisible("export")}
            onSetting={() => setVisible("setting")}
          />
        }
        side={
          theme.tabs.length > 0 && (
            <Tabs
              size="small"
              tabPosition="left"
              type="editable-card"
              items={theme.tabs}
              activeKey={theme.active.key}
              onChange={theme.setActive}
              onEdit={handleThemeEdit}
              hideAdd={THEME_HIDE_ADD_BUTTON}
            />
          )
        }
        editor={
          <Spin spinning={theme.loading}>
            {theme.tabs.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="点击右上方导入按钮添加主题，也可以点击下面按钮，查看导入示例"
              >
                <Button
                  type="primary"
                  onClick={() => {
                    setVisible("import");
                    setImportContetn(JSON.stringify(defaultTheme, null, 2));
                  }}
                >
                  添加案例
                </Button>
                <div style={{ marginTop: 12 }}>随后点击确定完成主题添加</div>
              </Empty>
            ) : (
              <EditorForm
                extra={
                  <Input
                    disabled
                    addonBefore="主题名称"
                    value={theme.active.key}
                    onChange={handleThemeName}
                  />
                }
                headTool={
                  theme.saveBtnVisible && (
                    <React.Fragment>
                      <Button size="small" type="primary" onClick={theme.save}>
                        保存
                      </Button>
                      <Button size="small" onClick={theme.cancel}>
                        取消
                      </Button>
                    </React.Fragment>
                  )
                }
                group={groupedData.group}
                tabKey={groupTabKeyActive}
                onTabChange={theme.setGroup}
                inputComponents={inputComponents}
                data={groupedData.list[groupTabKeyActive] || theme.list}
                onThemeChange={handleThemeItemChange}
                onThemeRemove={handleThemeItemRemove}
              />
            )}
          </Spin>
        }
        view={
          <React.Fragment>
            {visible.setting && (
              <Setting
                value={themeSetting}
                onChange={(key, value) =>
                  setThemeSetting((data) => {
                    const setting = { ...data, [key]: value };
                    setStorage(THEME_CACHE_KEY, setting);
                    return setting;
                  })
                }
                onCancel={() => setVisible("setting")}
              />
            )}
            {visible.import && (
              <Importer
                type={importType}
                value={importContent}
                onChange={setImportContetn}
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
            {!visible.import && !visible.export && !visible.setting && (
              <Previewer />
            )}
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
};

export default Editor;
