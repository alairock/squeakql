import {arrayShuffle} from './array-shuffle'

export const arrayRandomSample = <T = any>(arr: T[], num: number): T[] =>
  arrayShuffle(arr.map((_, i) => i))
    .slice(-Math.min(num, arr.length))
    .map((i) => arr[i])
