import React, { FC } from "react";
import clsx from "clsx";
import { useDynamicList } from "ahooks";
import {
  Button,
  Segmented,
  ColorPicker,
  InputNumber,
  Slider,
  Input,
  Tooltip,
  Upload,
  message,
} from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { saveAs } from "file-saver";
import defaultTheme from "./default-theme";
import "./index.less";

type TThemeRule = {
  name: string;
  value: any;
  label: string;
  desc: string;
  type: "color" | "number" | "pixel" | "input";
};

type TThemeData = {
  themeName: string;
  list: TThemeRule[];
};

const getValue = (e: any, type?: string) => {
  if (type === "color") return e.toHexString();
  return !e.target ? e : e.target.value;
};

/** 读取文件内容 */
const readFile = (file: File, callback: any) => {
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
const downloadFile = (content: string, fileName: string) => {
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
const getThemeRules = (css: string): TThemeData | null => {
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
const buildCssStyle = (themeData: TThemeData) => {
  const { themeName, list } = themeData;
  const css = list
    .filter((item) => !!item.name)
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

const copySuccess = () => message.success("拷贝成功！");

const SliderWithUnit: FC<{
  value?: any;
  onChange?: (value: any) => void;
}> = ({ value, onChange }) => {
  const [val, unit] = React.useMemo(() => {
    const val = /^(\d|\.)+/.exec(value)?.[0] || 0;
    const uni = /^\d+(\w+)/.exec(value)?.[1] || "";
    return [val as number, uni];
  }, [value]);

  const handleChange = (e: number) => {
    onChange?.(getValue(e) + (unit || 0));
  };

  return (
    <Slider
      tooltip={{ open: false }}
      min={0}
      max={2000}
      value={val}
      onChange={handleChange}
    />
  );
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

const HeadBar: FC<{
  className?: string;
  title?: string;
  extra?: any;
  children?: React.ReactNode;
}> = ({ className, title, extra, children }) => {
  return (
    <div className={clsx("we-head-bar", className)}>
      <div className="we-head-main">
        <span className="we-title">{title}</span>
        {extra && <div className="">{extra}</div>}
      </div>
      {children && <div className="we-btn-group">{children}</div>}
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
    <HeadBar className="we-head-title" title="🎨 主题配置">
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
    </HeadBar>
  );
};

// 主题配置项
const ThemeRule: FC<{
  data: TThemeRule;
  children?: React.ReactNode;
}> = ({ data, children }) => {
  const isVariable = /^\-\-/.test(data.name);
  return (
    <div className="we-theme-rule">
      <div className="we-theme-rule-row">
        <div className="we-theme-rule-label">{data.label}</div>
        <div className="we-theme-rule-name">{data.name}</div>
      </div>
      {data.desc && <div className="we-theme-rule-extra">{data.desc}</div>}
      <div className="we-theme-rule-row">
        <div className="we-theme-rule-value">{children}</div>
        <div className="we-btn-group">
          {isVariable && (
            <CopyToClipboard
              text={`var(${data.name}, ${data.value})`}
              onCopy={copySuccess}
            >
              <Tooltip title="拷贝，携带默认值">
                <Button type="text" size="small" shape="circle" icon={"⚡"} />
              </Tooltip>
            </CopyToClipboard>
          )}
          {isVariable && (
            <CopyToClipboard text={`var(${data.name})`} onCopy={copySuccess}>
              <Tooltip title="拷贝">
                <Button type="text" size="small" shape="circle" icon={"📝"} />
              </Tooltip>
            </CopyToClipboard>
          )}
          {/* <Tooltip title="删除">
            <Button danger size="small" shape="circle" icon={"🧺"} />
          </Tooltip> */}
        </div>
      </div>
    </div>
  );
};

// 编辑器表单
const EditorForm: FC<{
  extra?: any;
  data?: TThemeRule[];
  inputs?: Record<string, React.ReactElement>;
  onThemeChange?: (value: any, index: number, item: any) => any;
}> = ({ extra, data = [], inputs = {}, onThemeChange }) => {
  return (
    <div className="we-theme-editor-content">
      <HeadBar title="编辑器" extra={extra} />
      <div className="we-theme-editor-list">
        {data.map((item, index) => {
          return (
            <ThemeRule data={item} key={item.name}>
              <div className="we-theme-rule-item">
                {item.type !== "input" && (
                  <div className="we-theme-rule-view">
                    <Input
                      value={item.value}
                      onChange={(e: React.FormEvent) =>
                        onThemeChange?.(getValue(e), index, item)
                      }
                    />
                  </div>
                )}
                <div className="we-theme-rule-input">
                  {React.isValidElement(inputs[item.type])
                    ? React.cloneElement(inputs[item.type], {
                        value: item.value,
                        onChange: (e: React.FormEvent) =>
                          onThemeChange?.(getValue(e, item.type), index, item),
                      })
                    : item.value}
                </div>
              </div>
            </ThemeRule>
          );
        })}
      </div>
      {/* <Button disabled block shape="round" type="dashed" icon={"✨"}>
        新增
      </Button> */}
    </div>
  );
};

// 效果预览
const viewOptions = [
  { label: "页面示例", value: "0" },
  { label: "组件概览", value: "1" },
];
const Viewer: FC<{}> = () => {
  return (
    <div className="we-theme-view-content">
      <HeadBar title="主题预览" />
      <div className="we-theme-view-body">
        <Segmented
          className="we-theme-view-type"
          options={viewOptions}
          disabled
        />
        <div>
          <h2>Hi, 欢迎使用 Wowon 主题编辑器</h2>
          <p>轻松创建、管理、部署你的主题，提升研发效率，降低业务成本。</p>
        </div>
        {/* <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input />
          <Input.TextArea rows={3} />
          <Slider />
          <Button type="primary">提交</Button>
        </div> */}
      </div>
    </div>
  );
};

// 导入窗口
const importOptions = ["JSON", "CSS"];
const Importer: FC<{
  type?: string;
  onConfirm?: (input: string) => any;
  onCancel?: () => any;
  onTypeChange?: (value: string) => any;
}> = ({ type, onConfirm, onCancel, onTypeChange }) => {
  const [input, setInput] = React.useState<string>("");
  return (
    <div className="we-importer">
      <HeadBar
        title="主题导入"
        extra={
          <Segmented
            value={type}
            options={importOptions}
            onChange={onTypeChange}
          />
        }
      />
      <Input.TextArea
        rows={12}
        value={input}
        onChange={(e: React.FormEvent) => setInput(getValue(e))}
        style={{ fontSize: 12 }}
      />
      <div className="we-btn-group">
        <Button
          onClick={() => {
            onCancel?.();
            // setInput("");
          }}
        >
          关闭
        </Button>
        <Upload
          accept={{ JSON: ".json", CSS: ".css" }[type || "JSON"]}
          fileList={[]}
          beforeUpload={(file: File) => {
            readFile(file, (content: string) => setInput(content));
            return false;
          }}
        >
          <Button>上传</Button>
        </Upload>
        <Button
          type="primary"
          disabled={!input}
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
const exportOptions = ["JSON", "CSS"];
const Exporter: FC<{
  type?: string;
  onCancel?: () => any;
  onOutput?: () => string | void;
  onDownload?: (content: string) => any;
  onTypeChange?: (value: string) => any;
}> = ({ type, onCancel, onOutput, onDownload, onTypeChange }) => {
  const [input, setInput] = React.useState<string>("");
  return (
    <div className="we-importer">
      <HeadBar
        title="主题导出"
        extra={
          <Segmented
            value={type}
            options={exportOptions}
            onChange={onTypeChange}
          />
        }
      />
      <Input.TextArea
        readOnly
        rows={12}
        value={input}
        style={{ fontSize: 12 }}
      />
      <div className="we-btn-group">
        <Button
          onClick={() => {
            onCancel?.();
            setInput("");
          }}
        >
          关闭
        </Button>
        <Button
          onClick={() => {
            const result = onOutput?.();
            if (!!result) setInput(result);
          }}
        >
          输出
        </Button>
        <CopyToClipboard text={input} onCopy={copySuccess}>
          <Button>拷贝</Button>
        </CopyToClipboard>
        <Button
          type="primary"
          disabled={!input}
          onClick={() => {
            onDownload?.(input);
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
  pixel: <SliderWithUnit />,
  input: <Input />,
};
const Editor: FC<{}> = () => {
  const [visible, setVisible] = useVisible({ import: false, export: false });
  const [importType, setImportType] = React.useState<string>("JSON");
  const [exportType, setExportType] = React.useState<string>("JSON");
  const [themeName, setThemeName] = React.useState<string>(
    defaultTheme.themeName
  );
  const theme = useDynamicList<TThemeRule>(defaultTheme.list as TThemeRule[]);

  const cssStyle = React.useMemo(() => {
    return buildCssStyle({ themeName, list: theme.list });
  }, [themeName, theme.list]);

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
    theme.resetList(res.list);
    setThemeName(res.themeName);
    setVisible("import");
    message.success("导入成功！");
  };

  const handleThemeChange = React.useCallback(
    (value: any, index: number, item: any) => {
      theme.replace(index, { ...item, value });
    },
    []
  );

  const handleOutput = () => {
    if (exportType === "CSS") return cssStyle;
    return JSON.stringify({ themeName, list: theme.list }, null, 2);
  };

  const handleDownload = (content: string) => {
    if (exportType === "JSON") downloadFile(content, `${themeName}.json`);
    if (exportType === "CSS") downloadFile(content, `${themeName}.css`);
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
        editor={
          <EditorForm
            extra={
              <Input
                addonBefore="主题名称"
                value={themeName}
                onChange={(e: React.FormEvent) => setThemeName(getValue(e))}
              />
            }
            inputs={inputs}
            data={theme.list}
            onThemeChange={handleThemeChange}
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
            {!visible.import && !visible.export && <Viewer />}
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
};

export default Editor;
