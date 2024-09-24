import { FC } from "react";
import clsx from "clsx";
import { Button } from "antd";
import { THEME_HIDE_IMPORT_BUTTON, THEME_HIDE_EXPORT_BUTTON } from "./constant";

// 布局
const Layout: FC<{
  tool: any;
  side?: any;
  editor?: any;
  view?: any;
  footer?: any;
}> = ({ tool, side, editor, view, footer }) => {
  return (
    <div className="we-layout we-layout-open-side">
      <div className="we-layout-header">{tool}</div>
      <div className="we-layout-body">
        <div className="we-layout-side-content">{side}</div>
        <div className="we-layout-editor-content">{editor}</div>
        <div className="we-layout-view-content">{view}</div>
      </div>
      <div className="we-layout-footer">{footer}</div>
    </div>
  );
};

export const HeadBar: FC<{
  className?: string;
  title?: string;
  extra?: any;
  children?: React.ReactNode;
}> = ({ className, title, extra, children }) => {
  return (
    <div className={clsx("we-head-bar", className)}>
      <div className="we-head-main">
        <span className="we-title">{title}</span>
        {extra && <div className="we-head-extra">{extra}</div>}
      </div>
      {children && <div className="we-btn-group">{children}</div>}
    </div>
  );
};

// 操作栏
export const ToolButton: FC<{
  shouldUpdate?: boolean;
  active: {
    antd?: boolean;
    import?: boolean;
    export?: boolean;
    setting?: boolean;
  };
  onUpdate?: () => any;
  onImport?: () => any;
  onExport?: () => any;
  onSetting?: () => any;
}> = ({ shouldUpdate, active, onUpdate, onImport, onExport, onSetting }) => {
  return (
    <HeadBar className="we-head-title" title="🎨 主题配置">
      <Button
        type={shouldUpdate ? "primary" : "dashed"}
        icon={"✨"}
        onClick={onUpdate}
      >
        点击刷新
      </Button>
      <Button
        disabled
        type={active.antd ? "primary" : "default"}
        icon={"🎭"}
        onClick={onImport}
      >
        Antd 样式覆盖
      </Button>
      <Button
        type={active.setting ? "primary" : "default"}
        icon={"⚙"}
        onClick={onSetting}
      >
        设置
      </Button>
      {!THEME_HIDE_IMPORT_BUTTON && (
        <Button
          type={active.import ? "primary" : "default"}
          icon={"📥"}
          onClick={onImport}
        >
          导入
        </Button>
      )}
      {!THEME_HIDE_EXPORT_BUTTON && (
        <Button
          type={active.export ? "primary" : "default"}
          icon={"📤"}
          onClick={onExport}
        >
          导出
        </Button>
      )}
    </HeadBar>
  );
};

export default Layout;
