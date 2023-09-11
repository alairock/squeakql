export const objectGetSharedKeys = (objs: Record<string, any>[]): string[] => {
  const keyMap: Record<string, any> = {}
  for (let i = 0; i < objs.length; i++) {
    Object.keys(objs[i]).forEach((key) => {
      keyMap[key] = 1
    })
  }
  return Object.keys(keyMap)
}
