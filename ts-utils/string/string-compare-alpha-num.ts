import {isAlphaNumericChar, isDefined} from '../validation'

export const stringCompareAlphaNum = (a: any, b: any) => {
  if (!isDefined(a) || !isAlphaNumericChar(a.toString(), 0)) return 1
  else if (!isDefined(b) || !isAlphaNumericChar(b.toString(), 0)) return -1
  else if (a === b) return 0
  return a.toString().localeCompare(b.toString(), navigator.languages[0] || navigator.language, {
    numeric: true,
    ignorePunctuation: true
  })
}
