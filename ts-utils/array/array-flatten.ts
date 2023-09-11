import {arrayEnsure} from './array-ensure'

export const arrayFlatten = <T = any>(arr: (T | T[])[]): T[] =>
  arr.reduce<T[]>((flattened, e) => [...flattened, ...arrayEnsure(e)], [])
