/** 主题列表数据 */
let themeList: {
  id: string;
  name: string;
  key: string;
}[] = [];

let themeItemList: {
  type: string;
  label: string;
  desc: string;
  name: string;
  value: string | number;
  id: string;
  remove?: boolean;
}[] = [];

const changeHash: Record<string, number> = {};

let __UID__ = 1;

export default {
  /** 查询主题变更hash */
  "GET /mock/theme/hash": async (_: any, res: any) => {
    res.json({ code: "0", data: changeHash, message: "成功！" });
  },

  /** 查询主题列表 */
  "GET /mock/theme/list": async (_: any, res: any) => {
    res.json({ code: "0", list: themeList, message: "成功！" });
  },

  /** 添加/导入主题 */
  "POST /mock/theme/create": async (req: any, res: any) => {
    const { name, key, list } = req.body;
    const id = `theme-${__UID__++}`;
    const themeData = { id, name, key };
    const index = themeList.findIndex((item) => item.key === key);
    if (index > -1) {
      // 已存在，删除旧主题数据
      const oldTheme = themeList[index];
      themeList.splice(index, 1, themeData);
      themeItemList = themeItemList.filter((item) => item.id !== oldTheme.id);
    } else {
      // 添加新主题
      themeList.push(themeData);
    }
    // 添加主题变量列表
    const defaultList = (list || []).map((item: any) => ({ ...item, id }));
    themeItemList = themeItemList.concat(defaultList);
    changeHash[id] = new Date().getTime();
    res.json({ code: "0", message: "成功！" });
  },

  /** 更新主题 */
  "POST /mock/theme/update": async (req: any, res: any) => {
    const { id, name, key } = req.body;

    if (
      themeList.findIndex((item) => item.id !== id && item.key === key) > -1
    ) {
      res.json({ code: "0", message: "重复的主题 key！" });
      return;
    }

    const index = themeList.findIndex((item) => item.id === id);
    themeList.splice(index, 1, { ...themeList[index], name, key });

    changeHash[id] = new Date().getTime();
    res.json({ code: "0", message: "成功！" });
  },

  /** 删除主题 */
  "POST /mock/theme/remove": async (req: any, res: any) => {
    const { key } = req.body;
    let id = "";
    themeList = themeList.filter((item) => {
      if (item.key !== key) return true;
      id = item.id;
      return false;
    });
    if (!!id) {
      themeItemList = themeItemList.filter((item) => item.id !== id);
      delete changeHash[id];
    }
    res.json({ code: "0", message: "成功！" });
  },

  /** 查询主题详情 */
  "GET /mock/theme/profile": async (req: any, res: any) => {
    const { id } = req.query;
    const themeData = themeList.find((item) => item.id === id);
    if (!themeData) {
      res.json({ code: "-1", message: "主题不存在！" });
      return;
    }
    const list = themeItemList.filter((item) => item.id === id);
    res.json({ code: "0", data: { ...themeData, list }, message: "成功！" });
  },

  /** 批量更新主题配置 */
  "POST /mock/theme/list/update": async (req: any, res: any) => {
    const { id, list } = req.body;

    if (Array.isArray(list)) {
      list.forEach((data: any) => {
        const index = themeItemList.findIndex(
          (item) => item.id === id && item.name === data.name
        );
        themeItemList.splice(index, 1, data);
      });
    }

    changeHash[id] = new Date().getTime();
    res.json({ code: "0", message: "成功！" });
  },
};
