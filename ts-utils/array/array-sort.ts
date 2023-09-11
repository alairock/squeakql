import {objectGet} from '../object'

export const arraySort = <T = any>(arr: T[], props: string | string[] = [], {desc = false}: {desc?: boolean} = {}) => {
  const clone = [...arr]
  clone.sort((a, b) => {
    const _a = objectGet(a, props)
    const _b = objectGet(b, props)
    if (_a == null) return 1
    if (_b == null) return -1
    if (_a < _b) return desc ? 1 : -1
    if (_a > _b) return desc ? -1 : 1
    return 0
  })
  return clone
}
