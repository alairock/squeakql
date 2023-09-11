import {arrayCompare} from '../array'
import {objectIsEmpty} from './object-is-empty'

export const objectDiffDeep = (previous: any, current: any) => {
  previous = previous ?? {}
  current = current ?? {}
  const diff: any = {}
  for (const key of Object.keys(current)) {
    if (current[key] !== undefined && previous[key] === undefined) diff[key] = current[key]
    else if (current[key] === undefined && previous[key] !== undefined) diff[key] = undefined
    else if (current[key] !== undefined && previous[key] !== undefined) {
      if (Array.isArray(current[key]) && Array.isArray(previous[key])) {
        if (!arrayCompare(previous[key], current[key])) diff[key] = current[key]
      } else if (typeof current[key] === 'object' && typeof previous[key] === 'object') {
        const sub_diff = objectDiffDeep(previous[key], current[key])
        if (!objectIsEmpty(sub_diff)) diff[key] = sub_diff
      } else if (current[key] !== previous[key]) diff[key] = current[key]
    }
  }
  for (const key of Object.keys(previous))
    if (previous[key] !== undefined && current[key] === undefined) diff[key] = current[key]

  return diff
}
