import {numberIsBetween} from '../number'
import {datePack} from './date-pack'
import {dateUnpack} from './date-unpack'

export const dateParse = (date: string) => {
  const today = dateUnpack()
  const separatedValues = /(\d{1,2})[-\/.]?(\d{1,2})?[-\/.]?(\d{1,4})?(\s+(\d{1,2})\:?(\d{1,2})?\s*([ap]m)?)?/.exec(
    date
  )
  const [full, m = '', d = '', y = '', time, h = '', mi = '', ampm = 'am'] = separatedValues ?? []
  const month = +m
  const day = +(d || 1)
  const year = y ? (y.length <= 2 ? +y + (+y >= 50 ? 1900 : 2000) : +y) : today.year

  const hour = +h + (ampm === 'am' ? 0 : 12)
  const minute = +mi

  if (isNaN(month) || isNaN(day) || isNaN(year)) {
    return null
  }

  if (!numberIsBetween(month, 1, 12) || !numberIsBetween(day, 1, 31) || !numberIsBetween(year, 0, 5000)) {
    return null
  }
  const parsed = {
    month,
    day,
    year,
    hour,
    minute
  }
  return datePack(parsed)
}
