export const arrayInsert = <T>(arr: T[], item: T, index?: number) => {
  if (index == null) {
    return [...arr, item]
  } else if (index === 0) {
    return [item, ...arr]
  } else {
    const copy = [...arr]
    copy.splice(index, 0, item)
    return copy
  }
}
