export const objectCompareExcept =
  (...excludeProps: string[]) =>
  (prev: Record<string, any>, next: Record<string, any>) => {
    for (const key in prev) {
      if (!excludeProps.includes(key) && prev[key] !== next[key]) {
        return false
      }
    }
    for (const key in next) {
      if (!excludeProps.includes(key) && prev[key] !== next[key]) {
        return false
      }
    }
    return true
  }
