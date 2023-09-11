export const arrayToMap = <T = any>(arr: T[], key: string): Record<string, T> => {
  const map: Record<string, T> = {}
  for (let i = 0; i < arr.length; i++) {
    const item: any = arr[i]
    const keyValue = item[key]
    map[keyValue] = item
  }
  return map
}
