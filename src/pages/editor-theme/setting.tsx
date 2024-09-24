import React, { FC } from "react";
import { Form, Select, Button, Input } from "antd";
import { getValue, groupBy } from "./utils";

import { HeadBar } from "./layout";

// 设置窗口
const Setting: FC<{
  value: Record<string, any>;
  onChange?: (key: string, value: any) => any;
  onCancel?: () => any;
}> = ({ value, onChange, onCancel }) => {
  return (
    <div className="we-importer" style={{ width: 640 }}>
      <HeadBar title="功能设置" />
      <Form layout="vertical">
        <Form.Item label="服务地址">
          <Input
            placeholder="http://xxx.xxx.xxx/xxx"
            value={value.server}
            onChange={(e) => onChange?.("server", getValue(e))}
          />
        </Form.Item>
        <Form.Item label="分组类型">
          <Select
            options={groupBy.options}
            value={value.groupByType}
            onChange={(e) => onChange?.("groupByType", getValue(e))}
          />
        </Form.Item>
      </Form>
      <div className="we-btn-group">
        <Button
          onClick={() => {
            onCancel?.();
          }}
        >
          关闭
        </Button>
      </div>
    </div>
  );
};

export default Setting;
