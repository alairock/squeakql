import {objectDiffDeep} from './object-diff-deep'
import {objectIsEmpty} from './object-is-empty'

export const objectCompare = (one: any, two: any): boolean => {
  if (one === two) return true
  if (one == null || two == null) return false
  return objectIsEmpty(objectDiffDeep(one, two))
}
