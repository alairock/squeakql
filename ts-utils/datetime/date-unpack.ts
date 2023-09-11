import {ObjectDateTime} from '../types'

export const dateUnpack = (date?: Date, utc = false): ObjectDateTime => {
  date ??= new Date()
  return {
    year: utc ? date.getUTCFullYear() : date.getFullYear(),
    month: utc ? date.getUTCMonth() + 1 : date.getMonth() + 1,
    day: utc ? date.getUTCDate() : date.getDate(),
    hour: utc ? date.getUTCHours() : date.getHours(),
    minute: utc ? date.getUTCMinutes() : date.getMinutes(),
    second: utc ? date.getUTCSeconds() : date.getSeconds()
  }
}
