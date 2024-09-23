import { request } from "umi";

/** 获取主题hash */
export async function hash() {
  return request("/mock/theme/hash").then((res: any) => res.data);
}

/** 获取主题列表 */
export async function list() {
  return request("/mock/theme/list").then((res: any) => res.list);
}

/** 添加主题 */
export async function create(data: { name: string; key: string; list: any }) {
  return request("/mock/theme/create", { method: "POST", data }).then(
    (res: any) => res.code === "0"
  );
}

/** 更新主题 */
export async function update(data: { id: string; name: string; key: string }) {
  return request("/mock/theme/update", { method: "POST", data }).then(
    (res: any) => res.message
  );
}

/** 删除主题 */
export async function remove(data: { key: string }) {
  return request("/mock/theme/remove", { method: "POST", data }).then(
    (res: any) => res.message
  );
}

/** 获取主题详情 */
export async function queryTheme(params: { id: string }) {
  return request("/mock/theme/item/list", { params }).then(
    (res: any) => res.list
  );
}

/** 更新主题变量数据 */
export async function updateTheme(data: {
  key: string;
  type: string;
  label: string;
  desc: string;
  name: string;
  value: string | number;
  id: string;
}) {
  return request("/mock/theme/item/update", { method: "POST", data }).then(
    (res: any) => res.code === "0"
  );
}
