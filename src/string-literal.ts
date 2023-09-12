import { SqueakqlQuery } from "./query";
import {
  arrayEnsure as ensureArray,
  keyObjArray,
} from "../ts-utils/array/array-ensure";
import { objectPrune as pruneObject } from "../ts-utils/object/object-prune";

/** HELPERS */
type Dictionary<T = any> = Record<string, T>;

/** sql string literal */
export function sql(literals: TemplateStringsArray, ...values: any[]) {
  return new SqueakqlQuery(Array.from(literals), values);
}

const __internalsql = (literals: string[], values: any[]) =>
  new SqueakqlQuery(literals, values);

sql.basicSelect = (
  table: string,
  { columns = [], ids = [] }: { columns?: string[]; ids: string | string[] }
) => {
  if (columns.length == 0) {
    columns.push("*");
  }
  ids = ensureArray(ids);
  const sColumns = sql.merge(columns.map((c) => sql`:${c}`));

  return sql`SELECT ${sColumns} FROM :${table} WHERE id IN @${ids}`;
};

sql.unsafe = (text: string) => {
  /*
      /  WARNING!!!! HERE LIE DRAGONS!!!
      / DO NOT USE THIS METHOD WITH DATA PROVIDED BY A USER.
      /
      / This method is designed as an escape hatch so that you can write queries that
      / do anything. Especially useful when you are doing more dynamic queries, based
      / on data that is not user data. You should never use this method in a utility function with inputs,
      / as you can not guarantee the inputs are not user data.
      /
      / This function takes the input `text` and turns it into a `sql` object so that you can
      / use it with other sql strings.
      */
  // @ts-ignore
  return new SqueakqlQuery([text], []);
};

sql.merge = (queries: SqueakqlQuery[], joinOn = sql`,`) => {
  if (queries.length === 0) {
    return sql``;
  }
  const blanks = new Array(queries.length * 2).fill("");
  const flattened = queries.flatMap((e) => [e, joinOn]);
  flattened.pop();
  return __internalsql(blanks, flattened);
};

sql.values = (values: Dictionary | Dictionary[]) => {
  const arrValues = ensureArray(values);
  const trimmedValsArray = arrValues.map((e) => pruneObject(e));
  const keys = keyObjArray(trimmedValsArray);

  return sql`(${sql.merge(
    keys.map((key: any) => sql`:${key}`)
  )}) VALUES ${sql.merge(
    arrValues.map(
      (e) =>
        sql`(${sql.merge(keys.map((key: string | number) => sql`${e[key]}`))})`
    )
  )}`;
};

sql.setters = (setters: Dictionary) => {
  const prunedSetters = pruneObject(setters);
  const keys = Object.keys(prunedSetters);

  return sql.merge(keys.map((key) => sql`:${key}=${prunedSetters[key]}`));
};

sql.columns = (columns: string[]) => {
  return sql.merge(columns.map((id) => sql`:${id}`));
};

sql.insert = (tableName: string, values: Dictionary | Dictionary[]) => {
  return sql`INSERT INTO :${tableName} ${sql.values(values)} RETURNING *`;
};

sql.basicUpdate = (tableName: string, values: Dictionary, id: string) => {
  return sql`UPDATE :${tableName} SET ${sql.setters(values)} WHERE id=${id}`;
};

sql.updateMany = async <
  K extends Required<{ [param in keyof K]: any }>,
  T = any
>(
  table: string,
  vals: Dictionary<K>,
  arrayType?: SqueakqlQuery
) => {
  let columns = [];
  let columns_set = false;
  let all_vals = [];
  for (let [key, value] of Object.entries(vals)) {
    let myvals: any[] = [key];
    for (let [c, v] of Object.entries(value)) {
      if (!columns_set) {
        columns.push(c);
      }
      myvals.push(v);
    }
    columns_set = true;
    all_vals.push(myvals);
  }
  let sqlHintVals = sql.merge(columns.map((c) => sql`(NULL:::${table}).:${c}`));
  let sqlVals = sql.merge(
    all_vals.map(
      (v) =>
        sql`(${sql.merge(
          v.map((i) => {
            let val = sql`${i}`;
            if (Array.isArray(i)) {
              val = arrayType ? sql`${val}:::${arrayType}[]` : sql`${val}`;
            }
            return val;
          })
        )})`
    )
  );
  if (columns.length < 1) {
    return [];
  }

  let query = sql`UPDATE :${table} d SET ${sql.merge(
    columns.map((c) => sql`:${c}=v.:${c}`)
  )}
             FROM (VALUES ((NULL:::${table}).id,${sqlHintVals}), ${sqlVals}) as v(id,${sql.merge(
    columns.map((c) => sql`:${c}`)
  )}) WHERE d.id=v.id`;

  return query;
};
