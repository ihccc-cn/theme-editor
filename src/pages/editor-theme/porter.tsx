import React, { FC } from "react";
import { Button, Segmented, Input, Upload } from "antd";
// @ts-ignore
import { CopyToClipboard } from "react-copy-to-clipboard";
import { HeadBar } from "./layout";
import { copySuccess, getValue, readFile } from "./utils";

// 导入窗口
const importOptions = ["JSON", "CSS"];
export const Importer: FC<{
  type?: string;
  value: string;
  onChange: (input: string) => any;
  onConfirm?: (input: string) => any;
  onCancel?: () => any;
  onTypeChange?: (value: string) => any;
}> = ({ type, value, onChange, onConfirm, onCancel, onTypeChange }) => {
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
        value={value}
        onChange={(e: React.FormEvent) => onChange(getValue(e))}
        style={{ fontSize: 12 }}
      />
      <div className="we-btn-group">
        <Button
          onClick={() => {
            onCancel?.();
            onChange("");
          }}
        >
          关闭
        </Button>
        <Upload
          accept={{ JSON: ".json", CSS: ".css" }[type || "JSON"]}
          fileList={[]}
          beforeUpload={(file: File) => {
            readFile(file, (content: string) => onChange(content));
            return false;
          }}
        >
          <Button>上传</Button>
        </Upload>
        <Button
          type="primary"
          disabled={!value}
          onClick={() => {
            onConfirm?.(value);
            onChange("");
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
export const Exporter: FC<{
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
