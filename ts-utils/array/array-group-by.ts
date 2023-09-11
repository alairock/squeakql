export const arrayGroupBy = <T extends Record<string, any>>(arr: T[], groupBy: string, withoutProp = false) => {
  const obj: Record<string, T[]> = {}
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i][groupBy] ?? 'undefined'
    if (!obj[key]) {
      obj[key] = []
    }
    if (withoutProp) {
      const {[groupBy]: value, ...theRest} = arr[i]
      obj[key].push(theRest as T)
    } else {
      obj[key].push(arr[i])
    }
  }
  return obj
}
