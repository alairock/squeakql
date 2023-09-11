export const stringTrimLength = (str: string, length: number) => {
  if (!str) return ''
  if (str.length <= length) return str
  if (str.length > length) return str.slice(0, length)
}
