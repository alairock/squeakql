export const arrayDelete = <T>(arr: T[], index?: number) => {
  if (index == null) {
    return arr.slice(0, -1)
  } else if (index === 0) {
    return arr.slice(1)
  } else {
    const copy = [...arr]
    copy.splice(index, 1)
    return copy
  }
}
