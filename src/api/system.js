import request from '@/utils/request'

export function getConfig() {
  return request({
    url: '/system/configuration',
    method: 'get'
  })
}
export function setArchivePath(list) {
  return request({
    url: '/system/setArchivePath',
    method: 'post',
    data: { paths: JSON.stringify(list) }
  })
}
export function setResourcePath(list) {
  return request({
    url: '/system/setResourcePath',
    method: 'post',
    data: { paths: JSON.stringify(list) }
  })
}
export function setArchiveServer(data) {
  return request({
    url: '/system/setArchiveServer',
    method: 'post',
    data
  })
}
