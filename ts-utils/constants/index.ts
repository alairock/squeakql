export const digitKeyValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const
export const lowercaseLetterKeyValues = [
  'q',
  'w',
  'e',
  'r',
  't',
  'y',
  'u',
  'i',
  'o',
  'p',
  'a',
  's',
  'd',
  'f',
  'g',
  'h',
  'j',
  'k',
  'l',
  'z',
  'x',
  'c',
  'v',
  'b',
  'n',
  'm'
] as const
export const uppercaseLetterKeyValues = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M'
] as const
export const punctuationKeyValues = [
  '`',
  '~',
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
  '-',
  '_',
  '=',
  '+',
  '[',
  ']',
  '{',
  '}',
  '\\',
  ',',
  ';',
  ':',
  "'",
  '"',
  ',',
  '<',
  '.',
  '>',
  '/',
  '?'
] as const
export const modifierKeyValues = ['Shift', 'Control', 'Alt', 'Meta'] as const
export const whitespaceKeyValues = ['Enter', ' ', 'Tab'] as const
export const actionKeyValues = ['Escape', 'End', 'Home'] as const
export const deleteKeyValues = ['Backspace', 'Delete'] as const
export const arrowKeyValues = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'] as const
export const pageNavKeyValues = ['PageDown', 'PageUp'] as const

export const keyGroupValues = ['%letter', '%digit', '%arrow', '%punctuation', '%modifier', '%delete'] as const

export const groupExpansions: Record<string, string[]> = {
  '%letter': [...lowercaseLetterKeyValues, ...uppercaseLetterKeyValues],
  '%digit': [...digitKeyValues],
  '%arrow': [...arrowKeyValues],
  '%punctuation': [...punctuationKeyValues],
  '%modifier': [...modifierKeyValues],
  '%delete': [...deleteKeyValues]
}
