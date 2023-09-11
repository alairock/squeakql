import {ObjectDateTime} from '../types'

export const dateToServer = (date: ObjectDateTime) =>
  date && (date.year * 10000 + date.month * 100 + date.day).toString().padStart(8, '0')
