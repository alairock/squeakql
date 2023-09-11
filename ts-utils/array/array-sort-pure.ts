import {stringCompareAlphaNum} from '../string'

export const arraySortPure = <T>(arr: T[], fn: (a: T, b: T) => number = stringCompareAlphaNum) => {
  const copy = [...arr]
  copy.sort(fn)
  return copy
}
