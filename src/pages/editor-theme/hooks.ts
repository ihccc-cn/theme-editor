import React from "react";
import { useRequest, useDynamicList } from "ahooks";
import defaultTheme from "./default-theme";
import * as themeServices from "./services";
import { TThemeData, TThemeRule } from "./type";

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

type TActiveTab = { id?: string; key: string; index: number };

/** 本地数据 */
export const useLocalTheme = () => {
  // 主题列表的所有数据
  const theme = useDynamicList<TThemeData>([defaultTheme as TThemeData]);
  // 当前选择的主题
  const [active, setActive] = React.useState<TActiveTab>({
    key: defaultTheme.key,
    index: 0,
  });
  // 当前主题变量数据
  const children = useDynamicList<TThemeRule>(
    defaultTheme.list as TThemeRule[]
  );

  // 主题选项列表
  const themeList = React.useMemo(() => {
    const closable = theme.list.length > 1;
    return theme.list.map(({ name, key }) => ({
      key,
      label: name || key,
      closable,
    }));
  }, [theme.list]);

  // 获取当前主题
  const getCurrentTheme = (
    index: number,
    setData: (theme: TThemeData) => any
  ) => {
    setData(theme.list[index]);
  };

  // 保存
  const save = () => {
    // 将当前主题数据保存下来
    theme.replace(active.index, {
      ...theme.list[active.index],
      list: children.list,
    });
  };

  const setActiveTab = (active: TActiveTab) => {
    setActive(active);
    save();
  };

  const findIndex = (key: string) => {
    return themeList.findIndex((item) => item.key === key);
  };

  // 新增
  const add = (themeData: TThemeData) => {
    theme.push(themeData);
    // 刷新操作
    setActiveTab({ key: themeData.key, index: themeList.length });
  };

  // 修改
  const update = (themeData: Partial<TThemeData>) => {
    const data = { ...theme.list[active.index], ...themeData };
    theme.replace(active.index, data);
    // 刷新操作
    setActive({ ...active, key: data.key });
  };

  // 删除
  const remove = (key: string) => {
    const index = findIndex(key);

    theme.remove(index);
    // 刷新操作
    if (key === active.key) {
      // 如果删除的选中的主题，是第一个，切换到下一个选项卡，否则，切换到上一个选项卡
      const activeIndex = index === 0 ? index + 1 : index - 1;
      setActiveTab({
        key: theme.list[activeIndex].key,
        index: activeIndex,
      });
    }
  };

  const { name, groupKey } = theme.list[active.index] || {};

  return {
    name,
    active,
    setActive: setActiveTab,
    themeList,
    groupKey,
    children,
    findIndex,
    add,
    update,
    remove,
    save,
    getCurrentTheme,
  };
};

/** 远程数据 */
export const useRemoteTheme = () => {
  // 当前选择的主题
  const [active, setActive] = React.useState<TActiveTab>({ key: "", index: 0 });
  const currentThemeRef = React.useRef<string>("");
  // 当前主题变量数据
  const children = useDynamicList<TThemeRule>([]);

  // 获取当前主题
  const themeItemCommand = useRequest(themeServices.queryTheme, {
    manual: true,
    onSuccess: (data) => {
      children.resetList(data);
    },
  });

  // 主题选项列表
  const themesCommand = useRequest(themeServices.list, {
    onSuccess: (data) => {
      if (data.length === 0) return;
      let currentTheme = null;

      if (currentThemeRef.current) {
        currentTheme = data.find(
          (item: any) => item.key === currentThemeRef.current
        );
      } else {
        currentTheme = data[0];
      }
      if (!currentTheme) return;
      setActive({ id: currentTheme.id, key: currentTheme.key, index: 0 });
    },
  });

  React.useEffect(() => {
    console.log(active);

    if (active.id) themeItemCommand.run({ id: active.id });
  }, [active]);

  const themeList = React.useMemo(() => {
    const list = themesCommand.data || [];
    const closable = list.length > 1;
    return list.map(({ name, key }: TThemeData) => ({
      key,
      label: name || key,
      closable,
    }));
  }, [themesCommand.data]);

  const findIndex = (key: string) => {
    return themeList.findIndex((item: any) => item.key === key);
  };

  // // 保存
  // const save = () => {
  //   // 将当前主题数据保存下来
  //   theme.replace(active.index, {
  //     ...theme.list[active.index],
  //     list: children.list,
  //   });
  // };

  const setActiveTab = (key: string) => {
    const index = findIndex(key);
    const list = themesCommand.data || [];
    const theme = list[index];
    setActive({ key, index, id: theme.id });
  };

  // 新增主题
  const addCommand = useRequest(themeServices.create, {
    manual: true,
    onSuccess: () => {
      themesCommand.refresh();
    },
  });
  const add = (themeData: TThemeData) => {
    currentThemeRef.current = themeData.key;
    addCommand.run({
      name: themeData.name || themeData.key,
      key: themeData.key,
      list: themeData.list,
    });
  };
  // const add = (themeData: TThemeData) => {
  //   theme.push(themeData);
  //   // 刷新操作
  //   setActiveTab({ key: themeData.key, index: themeList.length });
  // };

  // // 修改
  // const update = (themeData: Partial<TThemeData>) => {
  //   const data = { ...theme.list[active.index], ...themeData };
  //   theme.replace(active.index, data);
  //   // 刷新操作
  //   setActive({ ...active, key: data.key });
  // };

  // 删除
  const removeCommand = useRequest(themeServices.remove, {
    manual: true,
    onSuccess: () => {
      themesCommand.refresh();
    },
  });
  const remove = (key: string) => {
    removeCommand.run({ key });
  };
  // const remove = (key: string) => {
  //   const index = findIndex(key);

  //   theme.remove(index);
  //   // 刷新操作
  //   if (key === active.key) {
  //     // 如果删除的选中的主题，是第一个，切换到下一个选项卡，否则，切换到上一个选项卡
  //     const activeIndex = index === 0 ? index + 1 : index - 1;
  //     setActiveTab({
  //       key: theme.list[activeIndex].key,
  //       index: activeIndex,
  //     });
  //   }
  // };

  // const { name, groupKey } = theme.list[active.index] || {};

  return {
    // name,
    loading:
      themeItemCommand.loading ||
      themesCommand.loading ||
      addCommand.loading ||
      removeCommand.loading ||
      false,
    active,
    setActive: setActiveTab,
    themeList,
    // groupKey,
    children,
    findIndex,
    add,
    remove,
    // update,
    // save,
    // getCurrentTheme,
  };
};
