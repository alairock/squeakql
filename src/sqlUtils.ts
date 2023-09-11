import {
  arrayEnsure as ensureArray,
  isArray,
  isDate,
  isNumberStrict,
  isObject,
  isString,
  keyObjArray,
  objectPrune as pruneObject,
} from "../ts-utils";

type Dictionary<T = any> = Record<string, T>;

export const values = <T = Dictionary>(
  vals: T | T[],
  prefixKeys = true,
  noVal = false
) => {
  const valsArray = ensureArray(vals);
  const trimmedValsArray = valsArray.map((e) => pruneObject(e));
  const keys = keyObjArray(trimmedValsArray);
  return `${prefixKeys ? `(${keys.join(",")})` : ""} VALUES ${trimmedValsArray
    .map(
      (obj: { [x: string]: any }) =>
        `(${keys.map((key: string | number) =>
          noVal ? obj[key] : val(obj[key])
        )})`
    )
    .join(",")}`;
};

export const sqlValues = (
  values: Dictionary | Dictionary[],
  paramOffset = 0
) => {
  const arrValues = ensureArray(values);
  const trimmedValsArray = arrValues.map((e) => pruneObject(e));
  const keys = keyObjArray(trimmedValsArray);

  return {
    sql: `(${keys.join(",")}) VALUES ${arrValues.map(
      (_, i) =>
        `(${keys.map((_, ii) => `$${i * keys.length + ii + 1 + paramOffset}`)})`
    )}`,
    params: arrValues.flatMap((values: { [x: string]: any }) =>
      keys.map((key: string | number) => values[key])
    ),
  };
};

export const list = (vals: any[]) => `(${vals.map(val).join(",")})`;

export const setters = (updates: Dictionary, noVal = false) => {
  const trimmed = pruneObject(updates);
  return `${Object.keys(trimmed)
    .map((key) => [key, noVal ? trimmed[key] : val(trimmed[key])].join("="))
    .join(",")}`;
};

export const val = (value: any): any => {
  if (value == null) {
    return "null";
  } else if (isString(value)) {
    return `'${value.replace(/'/g, "''")}'`;
  } else if (isNumberStrict(value)) {
    return `${value}`;
  } else if (isDate(value)) {
    return `to_timestamp(${+value / 1000})`;
  } else if (isArray(value)) {
    return `ARRAY[${value.map(val).join(",")}]`;
  } else if (isObject(value)) {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  } else {
    return value;
  }
};

export const sorts = (
  itemSorts: { orderBy: string; sortOn: string; sortBy: string }[]
) => {
  let i = 0;
  return itemSorts.length === 0
    ? `ORDER BY t.sequence ASC`
    : `${itemSorts
        .map((sort) => {
          i++;
          return `${i === 1 ? sort.orderBy : ""} ${sort.sortOn} ${
            sort.sortBy
          } nulls last`;
        })
        .join(", ")}, t.sequence ASC`;
};

const invalid_chars = /[ !@#$%^&*()+\-=\[\]{};':"\\|,<>\/?\s\b]/;
function checkTableName(table: string) {
  if (invalid_chars.test(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }
}

export function insert(
  table: string,
  vals: Dictionary | Dictionary[],
  ignoreConflict = false
): [string, any[]] {
  checkTableName(table);
  const real_values: any[] = [];
  let index = 1;
  if (!Array.isArray(vals)) {
    vals = [vals];
  }
  vals.forEach((obj: any) => {
    Object.entries(obj).forEach(([key, value]) => {
      real_values.push(value);
      obj[key] = `$${index}`;
      index++;
    });
  });

  return [
    `INSERT INTO ${table} ${values(vals, true, true)}${
      ignoreConflict ? " ON CONFLICT DO NOTHING" : ""
    } RETURNING *`,
    real_values,
  ];
}

class Paramaterizer {
  params: any[];
  count: number;
  constructor() {
    this.params = [];
    this.count = 1;
  }
}

export function update(
  table: string,
  vals: Dictionary,
  id: string
): [string, any[]] {
  checkTableName(table);
  const real_values: any[] = [];
  let index = 2;
  const final_vals: any = {};
  Object.entries(vals).forEach(([key, value]) => {
    real_values.push(value);
    final_vals[key] = `$${index}`;
    index++;
  });

  return [
    `UPDATE ${table} SET ${setters(final_vals, true)} WHERE id=$1 RETURNING *`,
    [id, ...real_values],
  ];
}
