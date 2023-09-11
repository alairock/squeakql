import { isArray, isObject } from "../validation";

export const objectCopyDeep = <T extends {}>(obj: T): T => {
  if (obj == null) {
    return obj;
  } else if (isArray(obj)) {
    return (obj as any[]).map((e) => objectCopyDeep(e)) as never as T;
  } else if (isObject(obj)) {
    const copy: T = {} as T;
    for (const k in obj) {
      if (obj.hasOwnProperty(k)) {
        copy[k] = objectCopyDeep(obj[k] as any);
      }
    }
    return copy;
  }
  return obj;
};
