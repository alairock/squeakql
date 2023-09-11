import {ObjectDateTime} from '../types'
import {isDefined} from '../validation'

export const dateFromServer = (date: number): ObjectDateTime | null => {
  if (!isDefined(date)) {
    return null
  }
  const year = Math.floor(date / 10000)
  const month = Math.floor((date % 10000) / 100)
  const day = date % 100
  return {year, month, day}
}
