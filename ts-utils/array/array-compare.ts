import {objectCompare} from '../object/object-compare'

export const arrayCompare = (prev: any[], cur: any[]): boolean => {
  if (prev.length !== cur.length) {
    return false
  }
  for (let i = 0; i < prev.length; i++) {
    const prev_val = prev[i]
    const cur_val = cur[i]
    if (typeof cur_val === 'object' && typeof prev_val === 'object') {
      if (!objectCompare(prev_val, cur_val)) {
        return false
      }
    } else {
      if (prev_val !== cur_val) {
        return false
      }
    }
  }
  return true
}
