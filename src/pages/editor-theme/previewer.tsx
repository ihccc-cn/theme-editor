import { FC } from "react";
import { Segmented } from "antd";
import { HeadBar } from "./layout";

// 效果预览
const viewOptions = [
  { label: "页面示例", value: "0" },
  { label: "组件概览", value: "1" },
];
const Previewer: FC<{}> = () => {
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

export default Previewer;
