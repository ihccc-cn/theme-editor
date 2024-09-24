import { request } from "@umijs/max";

let server = "/mock";

export const setServer = (_server?: string) => {
  if (!!_server) server = _server;
};

/** 获取主题hash */
export async function hash(_refreshSelf?: boolean) {
  return request(`${server}/theme/hash`).then((res: any) => res.data);
}

/** 获取主题列表 */
export async function list() {
  return request(`${server}/theme/list`).then((res: any) => res.list);
}

/** 添加/导入主题 */
export async function create(data: { name: string; key: string; list: any }) {
  return request(`${server}/theme/create`, { method: "POST", data }).then(
    (res: any) => res.code === "0"
  );
}

/** 更新主题 */
export async function update(data: { id: string; name: string; key: string }) {
  return request(`${server}/theme/update`, { method: "POST", data }).then(
    (res: any) => res.message
  );
}

/** 删除主题 */
export async function remove(data: { key: string }) {
  return request(`${server}/theme/remove`, { method: "POST", data }).then(
    (res: any) => res.message
  );
}

/** 获取主题详情 */
export async function profile(params: { id: string }) {
  return request(`${server}/theme/profile`, { params }).then(
    (res: any) => res.data
  );
}

/** 批量更新主题变量数据 */
export async function updateList(data: { id: string; list: any[] }) {
  return request(`${server}/theme/list/update`, { method: "POST", data }).then(
    (res: any) => res.code === "0"
  );
}
