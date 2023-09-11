export const arrayDiff = (previous: any[], current: any[]) => {
  previous = previous || []
  current = current || []
  const add: any[] = []
  const del: any[] = []
  for (let i = 0; i < previous.length; i++) {
    if (!current.includes(previous[i])) {
      del.push(previous[i])
    }
  }
  for (let i = 0; i < current.length; i++) {
    if (!previous.includes(current[i])) {
      add.push(current[i])
    }
  }
  return {
    add,
    del
  }
}
