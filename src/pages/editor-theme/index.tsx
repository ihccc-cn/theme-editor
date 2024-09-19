import React, { FC } from "react";
import { useDynamicList } from "ahooks";
import { Button, ColorPicker, InputNumber, Slider, Input, Tooltip } from "antd";
import defaultTheme from "./default-theme";
import "./index.less";

type TThemeRule = {
  name: string;
  value: any;
  label: string;
  desc: string;
  type: "color" | "number" | "pixel" | "input";
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
const getThemeRules = (css: string) => {
  const themeName = /data-theme="([^"]+)"/.exec(css)?.[1];
  if (!themeName) return null;

  const lines = css.split("\n");
  const list: TThemeRule[] = [];

  const start = /data-theme/.test(lines[0]) ? 1 : 0;

  for (let i = start; i < lines.length; i += 2) {
    const remarkLine = lines[i];
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
    theme.name = (cssLine.match(/(.+):/)?.[1] || "").replace(/\s+/g, "");
    if (!theme.name) continue;
    theme.value = cssLine.match(/:\s*(.+);/)?.[1] || "";
    const remark = remarkLine.match(/\/\*\s*(.+)\*\//)?.[1];
    if (!!remark) {
      const [label, desc] = remark.split(/:|：/);
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

// 布局
const Layout: FC<{ tool: any; editor?: any; view?: any }> = ({
  tool,
  editor,
  view,
}) => {
  return (
    <div className="we-layout">
      <div className="we-header">{tool}</div>
      <div className="we-body">
        <div className="we-editor-content">{editor}</div>
        <div className="we-view-content">{view}</div>
      </div>
    </div>
  );
};

// 操作栏
const ToolButton: FC<{
  active: { antd?: boolean; import?: boolean; export?: boolean };
  onImport?: () => any;
  onExport?: () => any;
}> = ({ active, onImport, onExport }) => {
  return (
    <div className="we-tool">
      <div className="we-title we-tool-title">主题编辑</div>
      <div className="we-btn-group">
        <Button
          disabled
          type={active.antd ? "primary" : "default"}
          icon={"🎭"}
          onClick={onImport}
        >
          Antd 样式覆盖
        </Button>
        <Button
          type={active.import ? "primary" : "default"}
          icon={"📥"}
          onClick={onImport}
        >
          导入
        </Button>
        <Button
          type={active.export ? "primary" : "default"}
          icon={"📤"}
          onClick={onExport}
        >
          导出
        </Button>
      </div>
    </div>
  );
};

// 主题配置项
const ThemeRule: FC<{
  label?: string;
  name?: string;
  extra?: any;
  children?: React.ReactNode;
}> = ({ label, extra, name, children }) => {
  return (
    <div className="we-theme-rule">
      <div className="we-theme-rule-row">
        <div className="we-theme-rule-label">{label}</div>
        {name && <div className="we-theme-rule-name">{name}</div>}
      </div>
      <div className="we-theme-rule-row">
        <div className="we-theme-rule-value">{children}</div>
        <div className="we-btn-group">
          <Tooltip title="应用">
            <Button type="primary" size="small" shape="circle" icon={"⚡"} />
          </Tooltip>
          <Tooltip title="拷贝">
            <Button type="primary" size="small" shape="circle" icon={"📝"} />
          </Tooltip>
          {/* <Tooltip title="删除">
            <Button danger size="small" shape="circle" icon={"🧺"} />
          </Tooltip> */}
        </div>
      </div>
      {extra && <div className="we-theme-rule-extra">{extra}</div>}
    </div>
  );
};

// 编辑器表单
const EditorForm: FC<{
  data?: TThemeRule[];
  inputs?: Record<string, React.ReactElement>;
}> = ({ data = [], inputs = {} }) => {
  return (
    <div className="we-theme-editor-content">
      <div className="we-title">编辑器</div>
      <div className="we-theme-editor-list">
        {data.map((item) => {
          return (
            <ThemeRule
              label={item.label}
              name={item.name}
              extra={item.desc}
              key={item.name}
            >
              <div className="we-theme-rule-item">
                {item.type !== "input" && (
                  <div className="we-theme-rule-view">
                    <Input value={item.value} />
                  </div>
                )}
                <div className="we-theme-rule-input">
                  {React.isValidElement(inputs[item.type])
                    ? React.cloneElement(inputs[item.type], {
                        value: item.value,
                      })
                    : item.value}
                </div>
              </div>
            </ThemeRule>
          );
        })}
      </div>
      <Button disabled block shape="round" type="dashed" icon={"✨"}>
        新增
      </Button>
    </div>
  );
};

// 效果预览
const Viewer: FC<{}> = () => {
  return (
    <div className="we-theme-view-content">
      <div className="we-title">主题预览</div>

      <div className="we-theme-view-body">
        <div>
          <h2>Hi, 欢迎使用 Wowon 主题编辑器</h2>
          <p>轻松创建、管理、部署你的主题，提升研发效率，降低业务成本。</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input />
          <Input.TextArea rows={3} />
          <Slider />
          <Button type="primary">提交</Button>
        </div>
      </div>
    </div>
  );
};

// 导入窗口
const Inputer: FC<{
  onConfirm?: (input: string) => any;
  onCancel?: () => any;
}> = ({ onConfirm, onCancel }) => {
  const [input, setInput] = React.useState<string>("");
  return (
    <div className="we-inputer">
      <div className="we-title">样式导入</div>
      <Input.TextArea
        rows={12}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ fontSize: 12 }}
      />
      <div className="we-btn-group">
        <Button
          onClick={() => {
            onCancel?.();
            // setInput("");
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            onConfirm?.(input);
            // setInput("");
          }}
        >
          确认
        </Button>
      </div>
    </div>
  );
};

// 导出窗口
const Exporter: FC<{
  onCancel?: () => any;
  onOutput?: () => string;
  onDownload?: () => any;
}> = ({ onCancel, onOutput, onDownload }) => {
  const [input, setInput] = React.useState<string>("");
  return (
    <div className="we-inputer">
      <div className="we-title">主题导出</div>
      <Input.TextArea rows={12} value={input} style={{ fontSize: 12 }} />
      <div className="we-btn-group">
        <Button
          onClick={() => {
            onCancel?.();
            setInput("");
          }}
        >
          取消
        </Button>
        <Button
          onClick={() => {
            const result = onOutput?.();
            if (!!result) setInput(result);
          }}
        >
          输出
        </Button>
        <Button
          type="primary"
          disabled
          onClick={() => {
            onDownload?.();
          }}
        >
          下载
        </Button>
      </div>
    </div>
  );
};

// hooks: 显示状态
type TVisible = Record<string, boolean>;
const useVisible = (
  initialValue: TVisible
): [TVisible, (key: keyof TVisible) => void] => {
  const [visible, setVisible] =
    React.useState<Record<keyof TVisible, boolean>>(initialValue);
  const setVisibleToggle = React.useCallback(
    (k: string) => setVisible((v) => ({ ...v, [k]: !v[k] })),
    []
  );
  return [visible, setVisibleToggle];
};

// 编辑器
const inputs = {
  color: <ColorPicker showText placement="right" />,
  number: <InputNumber />,
  pixel: <Slider tooltip={{ open: false }} />,
  input: <Input />,
};
const Editor: FC<{}> = () => {
  const [visible, setVisible] = useVisible({ import: false, export: false });
  const [themeName, setThemeName] = React.useState<string>(
    defaultTheme.themeName
  );
  const theme = useDynamicList<TThemeRule>(defaultTheme.list as TThemeRule[]);

  const hanleImport = (content: string) => {
    const res = getThemeRules(content);
    if (!res) {
      return;
    }
    theme.resetList(res.list);
    setThemeName(res.themeName);
    setVisible("import");
  };

  return (
    <React.Fragment>
      <Layout
        tool={
          <ToolButton
            active={{ import: visible.import, export: visible.export }}
            onImport={() => setVisible("import")}
            onExport={() => setVisible("export")}
          />
        }
        editor={<EditorForm inputs={inputs} data={theme.list} />}
        view={
          <React.Fragment>
            {visible.import && (
              <Inputer
                onConfirm={hanleImport}
                onCancel={() => setVisible("import")}
              />
            )}
            {visible.export && (
              <Exporter
                onCancel={() => setVisible("export")}
                onOutput={() => {
                  return JSON.stringify({ themeName, list: theme.list });
                }}
              />
            )}
            {!visible.import && !visible.export && <Viewer />}
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
};

export default Editor;
