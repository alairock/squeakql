export * from './keys-old'

export interface ObjectDateTime {
  year: number
  month: number
  day: number
  hour?: number
  minute?: number
  second?: number
}

export type DeepArray<T> = Array<T | DeepArray<T>>

import {
  actionKeyValues,
  arrowKeyValues,
  deleteKeyValues,
  digitKeyValues,
  keyGroupValues,
  lowercaseLetterKeyValues,
  modifierKeyValues,
  pageNavKeyValues,
  punctuationKeyValues,
  uppercaseLetterKeyValues,
  whitespaceKeyValues
} from '../constants'

export type DigitKeyValues = typeof digitKeyValues[number]
export type LowercaseLetterKeyValues = typeof lowercaseLetterKeyValues[number]
export type UppercaseLetterKeyValues = typeof uppercaseLetterKeyValues[number]
export type PunctuationKeyValues = typeof punctuationKeyValues[number]
export type ModifierKeyValues = typeof modifierKeyValues[number]
export type WhitespaceKeyValues = typeof whitespaceKeyValues[number]
export type ActionKeyValues = typeof actionKeyValues[number]
export type ArrowKeyValues = typeof arrowKeyValues[number]
export type PageNavKeyValues = typeof pageNavKeyValues[number]
export type DeleteKeyValues = typeof deleteKeyValues[number]
export type KeyGroupValues = typeof keyGroupValues[number]

export type AllKeyValues =
  | DigitKeyValues
  | LowercaseLetterKeyValues
  | UppercaseLetterKeyValues
  | PunctuationKeyValues
  | ModifierKeyValues
  | ArrowKeyValues
  | PageNavKeyValues
  | WhitespaceKeyValues
  | ActionKeyValues
  | DeleteKeyValues

export type AllKeysAndGroupValues = AllKeyValues | KeyGroupValues

export type ModifierConfig = {
  shift?: boolean
  alt?: boolean
  ctrl?: boolean
  meta?: boolean
  dynamicMeta?: boolean // cmd if macos, ctrl if windows or linux
}

export type PartialKeyboardEvent = {
  key: string
  shiftKey: boolean
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
}

export type KeyConfig = {
  keys: AllKeysAndGroupValues[]
  modifiers?: ModifierConfig
  caseSensitive?: boolean
}
