export const isObject = (value: any): value is {} => value != null && value.toString() === '[object Object]'
export const isArray = (value: any): value is [] => Array.isArray(value)
export const isDefined = (value: any) => value != null
export const isString = (value: any): value is string => typeof value === 'string'
export const isNumber = (value: any): value is number => !isArray(value) && !isNaN(value)
export const isDate = (value: any): value is Date => value instanceof Date
export const isNumberStrict = (value: any): value is number => isNumber(value) && typeof value === 'number'
export const isPromise = (value: any): value is Promise<unknown> => Boolean(value && typeof value.then === 'function')
export const isEmail = (value: any) =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value
  )
export const isAlphaNumericChar = (value: string, index: number): boolean => {
  const asciiCode = value.charCodeAt(index)
  return (
    (asciiCode >= 65 && asciiCode <= 90) ||
    (asciiCode >= 97 && asciiCode <= 122) ||
    (asciiCode >= 48 && asciiCode <= 57)
  )
}
