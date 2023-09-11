import {numberPadZeros} from '../number'
import {dateUnpack} from './date-unpack'

type DateFormat = 'mdy-slash' | 'simple' | 'mdy-dash'
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const dateFormat = (date: Date, format: DateFormat = 'mdy-slash', utc = false) => {
  if (!date || isNaN(+new Date(date))) return null
  const objDate = dateUnpack(date, utc)
  if (format.startsWith('mdy')) {
    const values = [numberPadZeros(objDate.month), numberPadZeros(objDate.day), numberPadZeros(objDate.year)]
    if (format === 'mdy-slash') return values.join('/')
    if (format === 'mdy-dash') return values.join('-')
  } else if (format === 'simple') {
    const thisYear = dateUnpack().year
    const month = months[objDate.month - 1]
    if (objDate.year === thisYear) return `${month} ${objDate.day}`
    return `${month} ${objDate.day}, '${numberPadZeros(objDate.year % 100)}`
  }
}
