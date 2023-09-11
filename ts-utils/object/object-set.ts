export const objectSet = <T>(obj: T, prop: string, value: any): T => {
  const update = {[prop]: value}
  return {...obj, ...update}
}
