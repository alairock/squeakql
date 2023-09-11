export const arrayMove = <T>(arr: T[], oldIndex: number, newIndex: number) => {
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
  return arr
}
