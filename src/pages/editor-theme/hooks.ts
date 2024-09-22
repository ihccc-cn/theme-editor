import React from "react";

type TVisible = Record<string, boolean>;

// hooks: 显示状态
export const useVisible = (
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
