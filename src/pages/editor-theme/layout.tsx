import { FC } from "react";
import clsx from "clsx";
import { Button } from "antd";

// 布局
const Layout: FC<{ tool: any; side?: any; editor?: any; view?: any }> = ({
  tool,
  side,
  editor,
  view,
}) => {
  return (
    <div className="we-layout we-layout-open-side">
      <div className="we-layout-header">{tool}</div>
      <div className="we-layout-body">
        <div className="we-layout-side-content">{side}</div>
        <div className="we-layout-editor-content">{editor}</div>
        <div className="we-layout-view-content">{view}</div>
      </div>
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

export default Layout;
