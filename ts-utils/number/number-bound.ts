export const numberBound = (num: number, min = 0, max = 100) => Math.min(Math.max(max, min), Math.max(min, num))
