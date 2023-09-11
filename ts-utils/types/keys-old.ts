export type KeyGroup = 'content' | 'digits' | 'arrows'

export type Key =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '0'
  | 'backquote'
  | 'q'
  | 'w'
  | 'e'
  | 'r'
  | 't'
  | 'y'
  | 'u'
  | 'i'
  | 'o'
  | 'p'
  | 'a'
  | 's'
  | 'd'
  | 'f'
  | 'g'
  | 'h'
  | 'j'
  | 'k'
  | 'l'
  | 'z'
  | 'x'
  | 'c'
  | 'v'
  | 'b'
  | 'n'
  | 'm'
  | 'minus'
  | 'equal'
  | 'leftbracket'
  | 'rightbracket'
  | 'backslash'
  | 'semicolon'
  | 'quote'
  | 'comma'
  | 'period'
  | 'forwardslash'
  | 'enter'
  | 'delete'
  | 'space'
  | 'tab'
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'esc'
  | KeyGroup

export const keyMap: Record<string, Key> = {
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  Digit0: '0',
  Backquote: 'backquote',
  KeyQ: 'q',
  KeyW: 'w',
  KeyE: 'e',
  KeyR: 'r',
  KeyT: 't',
  KeyY: 'y',
  KeyU: 'u',
  KeyI: 'i',
  KeyO: 'o',
  KeyP: 'p',
  KeyA: 'a',
  KeyS: 's',
  KeyD: 'd',
  KeyF: 'f',
  KeyG: 'g',
  KeyH: 'h',
  KeyJ: 'j',
  KeyK: 'k',
  KeyL: 'l',
  KeyZ: 'z',
  KeyX: 'x',
  KeyC: 'c',
  KeyV: 'v',
  KeyB: 'b',
  KeyN: 'n',
  KeyM: 'm',
  Minus: 'minus',
  Equal: 'equal',
  BracketLeft: 'leftbracket',
  BracketRight: 'rightbracket',
  Backslash: 'backslash',
  Semicolon: 'semicolon',
  Quote: 'quote',
  Comma: 'comma',
  Period: 'period',
  Slash: 'forwardslash',
  Enter: 'enter',
  Backspace: 'delete',
  Delete: 'delete',
  Space: 'space',
  Tab: 'tab',
  Escape: 'esc',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  Numpad1: '1',
  Numpad2: '2',
  Numpad3: '3',
  Numpad4: '4',
  Numpad5: '5',
  Numpad6: '6',
  Numpad7: '7',
  Numpad8: '8',
  Numpad9: '9',
  Numpad0: '0',
  NumpadEnter: 'enter',
  NumpadDecimal: 'period',
  NumpadEqual: 'equal',
  NumpadSubtract: 'minus'
}

export const keyGroupExpansions: Record<string, Key[]> = {
  content: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    'backquote',
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
    'm',
    'minus',
    'equal',
    'leftbracket',
    'rightbracket',
    'backslash',
    'semicolon',
    'quote',
    'comma',
    'period',
    'forwardslash'
  ],
  digits: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  arrows: ['up', 'down', 'left', 'right']
}
