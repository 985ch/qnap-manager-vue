import request from '@/utils/request'
import _ from 'lodash'

export function getRules() {
  return request({
    url: '/archive/rules',
    method: 'get'
  })
}
export function getHistory() {
  return request({
    url: '/archive/logs',
    method: 'get'
  })
}
export function addRule(values) {
  return request({
    url: '/archive/addRule',
    method: 'post',
    data: values
  })
}
export function editRule(pathBefore, regularBefore, values) {
  return request({
    url: '/archive/editRule',
    method: 'post',
    data: _.assign({ pathBefore, regularBefore }, values)
  })
}
export function setRuleEnable(path, regular, enable) {
  return request({
    url: '/archive/enableRule',
    method: 'post',
    data: { path, regular, enable }
  })
}
