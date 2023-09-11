export const arrayDiffShallow = <T = any>(previous: T[] = [], current: T[] = []) => {
  return {
    add: current.filter((e) => !previous.includes(e)),
    del: previous.filter((e) => !current.includes(e))
  }
}
