export function ruleFilter(rule) {
  const rules = {
    default: '直接复制',
    files: '复制目录内文件'
  }
  return rules[rule]
}
