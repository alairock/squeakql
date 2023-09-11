
export const numberIsBetween = (num: number, lower: number, upper: number, inclusive = true) => {
  return inclusive ? num >= lower && num <= upper : num > lower && num < upper
}
