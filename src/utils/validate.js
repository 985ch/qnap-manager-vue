/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validateRegExp(rule, value, callback) {
  try {
    new RegExp(value)
    callback()
  } catch (e) {
    callback(new Error('无效的正则表达式'))
  }
}
