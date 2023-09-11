import {DeepArray} from '../types'

export const classes = (...classes: DeepArray<string | (() => string) | null | undefined>) =>
  classes
    .flat(21)
    .map((e) => (typeof e === 'function' ? e() : e))
    .filter((e) => !!e)
    .join(' ')
