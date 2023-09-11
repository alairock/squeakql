export const objectPrune = (obj: Record<string, any>, shouldPrune = (val: any) => val === undefined) => {
  const newObj: Record<string, any> = {}
  Object.keys(obj).forEach((key) => {
    if (!shouldPrune(obj[key])) {
      newObj[key] = obj[key]
    }
  })
  return newObj
}
