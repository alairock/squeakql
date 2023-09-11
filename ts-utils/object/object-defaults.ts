export const objectDefaults = (defaults: Record<string, any>) => (obj: Record<string, any>) => {
  return {...defaults, ...obj}
}
