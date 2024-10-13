import React, { FC } from "react";
import clsx from "clsx";
import { Tabs, Button, Input, Empty, Tooltip } from "antd";
// @ts-ignore
import { CopyToClipboard } from "react-copy-to-clipboard";
import { HeadBar } from "./layout";
import { TThemeRule } from "./type";
import { copySuccess, getValue } from "./utils";

// 主题配置项
export const ThemeRule: FC<{
  data: TThemeRule;
  children?: React.ReactNode;
  onRmove?: () => any;
}> = ({ data, children, onRmove }) => {
  const isVariable = /^\-\-/.test(data.name);
  return (
    <div
      className={clsx("we-theme-rule", data.remove && "we-theme-rule-remove")}
    >
      <div className="we-theme-rule-row">
        <div className="we-theme-rule-label">{data.label}</div>
        <div className="we-theme-rule-name">{data.name}</div>
      </div>
      {data.desc && <div className="we-theme-rule-extra">{data.desc}</div>}
      <div className="we-theme-rule-row">
        <div className="we-theme-rule-value">{!data.remove && children}</div>
        <div className="we-btn-group">
          {isVariable && !data.remove && (
            <CopyToClipboard
              text={`var(${data.name}, ${data.value})`}
              onCopy={copySuccess}
            >
              <Tooltip title="拷贝，携带默认值">
                <Button type="text" size="small" shape="circle" icon={"⚡"} />
              </Tooltip>
            </CopyToClipboard>
          )}
          {isVariable && !data.remove && (
            <CopyToClipboard text={`var(${data.name})`} onCopy={copySuccess}>
              <Tooltip title="拷贝">
                <Button type="text" size="small" shape="circle" icon={"📝"} />
              </Tooltip>
            </CopyToClipboard>
          )}
          <Tooltip title={data.remove ? "保留" : "移除"}>
            <Button
              danger
              type={data.remove ? "dashed" : "text"}
              size="small"
              shape="circle"
              icon={"🗑"}
              onClick={onRmove}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

// 编辑器表单
const EditorForm: FC<{
  extra?: any;
  headTool?: any;
  group?: any;
  tabKey?: string;
  onTabChange?: (key: string) => any;
  data?: TThemeRule[];
  inputComponents?: Record<string, React.ReactElement>;
  onThemeChange?: (value: any, item: any) => any;
  onThemeRemove?: (item: any) => any;
}> = ({
  extra,
  headTool,
  group,
  tabKey,
  onTabChange,
  data = [],
  inputComponents = {},
  onThemeChange,
  onThemeRemove,
}) => {
  return (
    <div className="we-theme-editor-content">
      <HeadBar title="编辑器" extra={extra}>
        {headTool}
      </HeadBar>
      {!group || group.length === 0 ? (
        <div style={{ height: 38 }} />
      ) : (
        <Tabs
          size="small"
          type="line"
          items={group}
          activeKey={tabKey}
          onChange={onTabChange}
        />
      )}
      <div className="we-theme-editor-list">
        {data.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        {data.map((item) => {
          return (
            <ThemeRule
              data={item}
              onRmove={() => onThemeRemove?.(item)}
              key={item.name}
            >
              <div className="we-theme-rule-item">
                {item.type !== "input" && item.type !== "text" && (
                  <div className="we-theme-rule-view">
                    <Input
                      value={item.value}
                      onChange={(e: React.FormEvent) =>
                        onThemeChange?.(getValue(e), item)
                      }
                    />
                  </div>
                )}
                <div className="we-theme-rule-input">
                  {React.isValidElement(inputComponents[item.type])
                    ? React.cloneElement(inputComponents[item.type], {
                        ...item.props,
                        value: item.value,
                        onChange: (e: React.FormEvent) =>
                          onThemeChange?.(getValue(e, item.type), item),
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

export default EditorForm;
