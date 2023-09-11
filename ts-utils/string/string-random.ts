export const stringRandom = (length: number = 10) => {
  let id = ''
  for (let i = 0; i < Math.ceil(length / 10); i++) {
    id += Math.random().toString(36).slice(2)
  }
  return id.substr(0, length)
}
