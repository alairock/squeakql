export const arrayEnsure = <T>(data: T | T[] = []): T[] => (Array.isArray(data) ? data : data ? [data] : [])

export const keyObjArray = (objs: Record<string, any>[]): string[] => {
    const keyMap: Record<string, any> = {}
    for (let i = 0; i < objs.length; i++) {
      Object.keys(objs[i]).forEach((key) => {
        keyMap[key] = 1
      })
    }
    return Object.keys(keyMap)
  }
  