export const objectToArray = <T = Record<string, any>>(
  map: Record<string, T>,
  keyKey?: string,
  keyOrder?: (string | number)[]
): T[] => {
  const keys = keyOrder || Object.keys(map)
  return keys.map((k) => {
    const item: T = map[k]
    if (keyKey) {
      ;(item as any)[keyKey] = k
    }
    return item
  })
}
