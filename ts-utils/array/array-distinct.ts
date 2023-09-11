export const arrayDistinct = <T>(values: T[]) => {
  const set = new Set(values)
  return Array.from(set)
}
