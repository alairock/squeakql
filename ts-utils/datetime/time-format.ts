import {numberPadZeros} from '../number'
import {dateUnpack} from './date-unpack'

export const timeFormat = (date: Date, utc = false, militaryTime = false) => {
  if (!date || isNaN(+new Date(date))) return null
  const objDate = dateUnpack(date, utc)
  let hour = objDate.hour ?? 0
  hour %= 12
  hour = hour === 0 ? 12 : hour
  if (militaryTime) return `${numberPadZeros(hour)}:${numberPadZeros(objDate.minute)}}`
  return `${numberPadZeros(hour)}:${numberPadZeros(objDate.minute)} ${objDate.hour! >= 12 ? 'pm' : 'am'}`
}
