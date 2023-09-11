import {isArray, isObject} from '../validation'

export const objectMergeDeep = <T extends Record<string, any>>(a: T, b: T): T => {
  const copyA = {...a}
  for (const k in b) {
    if (b.hasOwnProperty(k)) {
      copyA[k] = isObject(b[k]) && !isArray(b[k]) ? objectMergeDeep(copyA[k], b[k]) : b[k]
    }
  }
  return copyA
}
