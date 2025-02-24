import http from '@/utils/http'
import type * as System from './type'

const BASE_URL = '/system/file'

/** @desc 查询文件列表 */
export function listFile(query: System.FileQuery) {
  return http.get<System.FileItem[]>(`${BASE_URL}/list`, query)
}

/** @desc 修改文件 */
export function updateFile(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除文件 */
export function deleteFile(ids: string | Array<string>) {
  return http.del(`${BASE_URL}/${ids}`)
}
