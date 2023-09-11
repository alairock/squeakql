import {arrayEnsure} from '../array'

export const objectWithProp = <T = any>(obj: Record<string, any>, prop: string | string[]): T =>
  arrayEnsure(prop).reduce((newObj, key) => ({...newObj, [key]: obj[key]}), {} as T)
