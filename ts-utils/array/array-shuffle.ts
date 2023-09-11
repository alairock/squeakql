export const arrayShuffle = <T = any>(arr: T[]): T[] => {
  let currentIndex = arr.length,
    temporaryValue,
    randomIndex
  const arrCopy = [...arr]
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = arrCopy[currentIndex]
    arrCopy[currentIndex] = arrCopy[randomIndex]
    arrCopy[randomIndex] = temporaryValue
  }

  return arrCopy
}
