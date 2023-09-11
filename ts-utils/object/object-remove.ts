export const objectRemove = (obj: Record<string, any>, prop: string | string[]) => {
  const props = Array.isArray(prop) ? prop : [prop]
  const copy = {...obj}
  props.forEach((e) => delete copy[e])
  return copy
}
