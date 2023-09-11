import {arrayEnsure} from '../array'

export const objectGet = (obj: Record<string, any>, props: string | string[]): any => {
  const path = arrayEnsure(props)
  return obj == null ? undefined : path.length === 0 ? obj : objectGet(obj[path[0]], path.slice(1))
}
