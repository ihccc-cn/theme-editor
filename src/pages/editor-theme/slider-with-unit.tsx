import React, { FC } from "react";
import { Slider } from "antd";
import { getValue } from "./utils";

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

export default SliderWithUnit;
