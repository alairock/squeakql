import {hexToRgb} from './hex-to-rgb'

export const rgba = (hex: string, opacity: number) => {
  const rgb = hexToRgb(hex)
  return rgb && `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`
}
