import {ObjectDateTime} from '../types'

export const datePack = (obj: Partial<ObjectDateTime>): Date => {
  const date = new Date()
  if (obj.second != null) date.setSeconds(obj.second)
  if (obj.minute != null) date.setMinutes(obj.minute)
  if (obj.hour != null) date.setHours(obj.hour)
  if (obj.day != null) date.setDate(1)
  if (obj.month != null) date.setMonth(obj.month - 1)
  if (obj.day != null) date.setDate(obj.day)
  if (obj.year != null) date.setFullYear(obj.year)
  return date
}
