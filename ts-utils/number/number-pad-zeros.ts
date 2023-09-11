export const numberPadZeros = (num?: number, length = 2, char = '0') => {
  return (num?.toString() ?? '').padStart(length, char)
}
