export const numberRange = (start: number, end?: number, inclusive = false) => {
  let _start = end != null ? start : 0
  let _end = end == null ? start : end

  if (inclusive) {
    if (_start < _end) _end++
    else _start++
  }

  if (typeof _start !== 'number' || isNaN(_start) || typeof _end !== 'number' || isNaN(_end))
    throw new Error(`Invalid range [${_start},${_end}], given [${start},${end}]`)

  return {
    __start: _start,
    __end: _end,
    [Symbol.iterator]: function () {
      let count = this.__start
      return {
        next: () => {
          return {
            value: this.__start < this.__end ? count++ : --count,
            done: this.__start < this.__end ? count > this.__end : count < this.__end
          }
        }
      }
    },
    map: function <T>(fn: (index: number) => T) {
      const result: T[] = []
      for (const i of this) {
        result.push(fn(i))
      }
      return result
    },
    each: function (fn: (index: number) => void) {
      for (const i of this) {
        fn(i)
      }
    },
    reduce: function <T>(fn: (sum: T, index: number) => T, initial: T) {
      let _sum = initial
      for (const i of this) {
        _sum = fn(_sum, i)
      }
      return _sum
    }
  }
}
