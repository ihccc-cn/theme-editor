import React from "react";
import { useRequest, useDynamicList } from "ahooks";
import defaultTheme from "./default-theme";
import * as themeServices from "./services";
import { THEME_HIDE_CLOSE_BUTTON } from "./constant";
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
export const useRemoteTheme = (config?: { server?: string }) => {
  themeServices.setServer(config?.server);

  // 当前选择的主题
  const [active, setActive] = React.useState<TActiveTab>({ key: "", index: 0 });
  const nextThemeRef = React.useRef<string>("");
  // 当前主题变量数据
  const themeConfig = useDynamicList<TThemeRule>([]);
  const [saveBtnVisible, setSaveBtnVisible] = React.useState<
    Record<string, boolean>
  >({});
  const [group, setGroup] = React.useState<Record<string, string>>({});
  // 临时未保存主题信息
  const [newThemes, setNewThemes] = React.useState<TThemeData[]>([]);
  // 保存主题更新状态 hash
  const themeHashRef = React.useRef<null | Record<string, any>>(null);
  const [shouldUpdate, setShouldUpdate] = React.useState<boolean>(false);

  // 请求hash
  const refreshHashCommand = useRequest(themeServices.hash, {
    pollingInterval: 3000,
    pollingWhenHidden: false,
    onSuccess: (data, refreshSelf) => {
      if (!themeHashRef.current || refreshSelf?.[0]) {
        themeHashRef.current = data;
        return;
      }
      if (
        Object.keys(themeHashRef.current).length !== Object.keys(data).length
      ) {
        setShouldUpdate(true);
        themeHashRef.current = data;
        return;
      }
      for (const key in data) {
        if (data[key] !== themeHashRef.current[key]) {
          setShouldUpdate(true);
          themeHashRef.current = data;
          return;
        }
      }
    },
  });

  // 获取当前主题
  const currentThemeCommand = useRequest(themeServices.profile, {
    manual: true,
    onSuccess: (data) => {
      themeConfig.resetList(data.list);
    },
  });

  // 主题选项列表
  const themesCommand = useRequest(themeServices.list, {
    onSuccess: (data) => {
      setShouldUpdate(false);
      if (data.length === 0) return;
      let currentTheme = null;

      if (nextThemeRef.current) {
        currentTheme = data.find(
          (item: any) => item.key === nextThemeRef.current
        );
      } else {
        currentTheme = data[0];
      }
      if (!currentTheme) return;
      setActive({ id: currentTheme.id, key: currentTheme.key, index: 0 });
    },
  });

  React.useEffect(() => {
    if (active.id) {
      currentThemeCommand.run({ id: active.id });
    }
  }, [active]);

  const tabs = React.useMemo(() => {
    const list = themesCommand.data || [];
    const closable = THEME_HIDE_CLOSE_BUTTON ? false : list.length > 1;
    return list.concat(newThemes).map(({ name, key }: TThemeData) => ({
      key,
      label: name || key,
      closable,
    }));
  }, [themesCommand.data, newThemes]);

  const findIndex = (key: string) => {
    return tabs.findIndex((item: any) => item.key === key);
  };

  const setSaveVisible = (key: string, visible: boolean) => {
    setSaveBtnVisible((btnVisible) => ({ ...btnVisible, [key]: visible }));
  };

  const setActiveTab = (key: string) => {
    const index = findIndex(key);
    let themeData = null;
    if (index < themesCommand.data.length) {
      themeData = themesCommand.data[index];
    } else {
      themeData = newThemes.find((item) => item.key === key);
      if (!!themeData) {
        currentThemeCommand.mutate(themeData);
        themeConfig.resetList(themeData.list);
      }
    }
    setActive({ key, index, id: themeData.id });
  };

  const setGroupTab = (groupKey: string) => {
    setGroup((keys) => ({ ...keys, [active.key]: groupKey }));
  };

  // 新增
  // 显示保存按钮，判断存不存在
  // 如果存在，修改已经存在的主题配置，跳转对应的 tab
  // 如果不存在，添加一个临时的 tab，修改主题配置，跳转对应 tab
  const add = (themeData: TThemeData) => {
    const newTheme = { ...themeData, _newTheme: true };
    const index = findIndex(newTheme.key);
    if (index === -1) {
      setNewThemes((themes) => themes.concat(newTheme));
    }
    currentThemeCommand.mutate(newTheme);
    themeConfig.resetList(newTheme.list);
    setActive({ index: tabs.length, key: newTheme.key });
    setSaveVisible(newTheme.key, true);
  };

  // 删除
  const removeCommand = useRequest(themeServices.remove, {
    manual: true,
    onSuccess: () => {
      themesCommand.refresh();
      refreshHashCommand.run(true);
    },
  });
  const remove = (key: string) => {
    const index = findIndex(key);
    if (index < themesCommand.data.length) {
      removeCommand.run({ key });
      if (key === active.key) {
        const index = findIndex(key);
        // 如果删除的选中的主题，是第一个，切换到下一个选项卡，否则，切换到上一个选项卡
        const nextIndex = index === 0 ? index + 1 : index - 1;
        nextThemeRef.current = tabs[nextIndex].key;
      }
    } else {
      setActiveTab(key);
      setNewThemes((themes) =>
        themes.filter((item) => item.key !== active.key)
      );
    }
  };

  // 修改
  const updateCommand = useRequest(themeServices.update, {
    manual: true,
    onSuccess: () => {
      themesCommand.refresh();
      refreshHashCommand.run(true);
    },
  });
  const update = (theme: { name?: string; key?: string }) => {
    const { id, name, key } = currentThemeCommand.data || {};
    updateCommand.run({ id, name, key, ...theme });
  };

  // 修改变量
  // 显示保存按钮，调用 themeConfig.replace(index, data);
  const updateItem = (theme: any) => {
    const index = themeConfig.list.findIndex(
      (item) => item.name === theme.name
    );
    themeConfig.replace(index, { ...theme, _changed: true });
    setSaveVisible(active.key, true);
  };

  // 保存 updateList
  // 判断当前主题是否是新主题
  // 如果是新主题，调用新增接口
  // 如果不是新主题，调用 updateList 更新配置
  // 新增主题
  const addCommand = useRequest(themeServices.create, {
    manual: true,
    onSuccess: () => {
      setSaveVisible(active.key, false);
      setNewThemes((themes) =>
        themes.filter((item) => item.key !== active.key)
      );
      themesCommand.refresh();
      refreshHashCommand.run(true);
    },
  });
  const updateListCommand = useRequest(themeServices.updateList, {
    manual: true,
    onSuccess: () => {
      setSaveVisible(active.key, false);
      currentThemeCommand.refresh();
      refreshHashCommand.run(true);
    },
  });
  const save = () => {
    const { _newTheme, ...themeData } = currentThemeCommand.data || {};
    if (_newTheme) {
      addCommand.run(themeData);
    } else {
      const list = themeConfig.list
        .filter((item: any) => item._changed)
        .map(({ _changed, ...item }: any) => item);
      updateListCommand.run({ id: themeData.id, list });
    }
  };

  // 取消
  // 判断当前主题是否是新主题
  // 如果是新主题，setNewThemes 中的数据，跳转
  // 如果不是，刷新当前配置，
  const cancel = () => {
    const { _newTheme } = currentThemeCommand.data || {};
    if (_newTheme) {
      const index = active.index;
      const nextIndex = index === 0 ? index + 1 : index - 1;
      if (!!tabs[nextIndex]) {
        const key = tabs[nextIndex].key;
        setActiveTab(key);
      }
      setNewThemes((themes) =>
        themes.filter((item) => item.key !== active.key)
      );
    } else {
      setSaveVisible(active.key, false);
      currentThemeCommand.refresh();
    }
  };

  return {
    infos: `主题 ${tabs.length} | 变量 ${currentThemeCommand.data?.list?.length || 0}`,
    /** 当前主题数据 */
    current: currentThemeCommand.data || {},
    /** 当前主题配置数据 */
    list: themeConfig.list,
    /** 操作请求状态 */
    loading:
      currentThemeCommand.loading ||
      themesCommand.loading ||
      addCommand.loading ||
      removeCommand.loading ||
      updateCommand.loading ||
      updateListCommand.loading ||
      false,
    /** 需要更新的标记 */
    shouldUpdate,
    /** 激活选项卡数据 */
    active,
    /** 修改选项卡 */
    setActive: setActiveTab,
    /** 当前主题激活的分组 */
    group: group[active.key],
    /** 修改当前主题激活的分组 */
    setGroup: setGroupTab,
    /** 保存按钮显示状态 */
    saveBtnVisible: saveBtnVisible[active.key] || false,
    /** 主题选项卡列表数据 */
    tabs,
    /** 刷新数据 */
    refresh: themesCommand.refresh,
    /** 添加主题 */
    add,
    /** 删除主题 */
    remove,
    /** 更新主题信息 */
    update,
    /** 更新主题配置项 */
    updateItem,
    /** 发布/保存 */
    save,
    /** 取消 */
    cancel,
  };
};
