export const arrayFill = <T = any>(num: number, fillWith: () => T) => new Array(num).fill(0).map(fillWith)
