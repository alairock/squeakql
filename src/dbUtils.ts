import { SQLQuery } from "./sqlQuery";

const getRequestContext = () => {
  // TODO: This is a stub, replace this with a real implementation
  return {
    span: {
      startChild: (options: any) => {
        return {
          setData: (key: string, value: any) => {},
          finish: () => {},
        };
      },
    },
    db: {
      query: async (queryStr: SQLQuery, tags: any) => {
        return {
          rows: [],
        };
      },
      transact: async (callback: () => Promise<any>) => {
        return await callback();
      },
    },
  };
};

export async function dbQuery<T = any>(queryStr: SQLQuery): Promise<T[]> {
  const ctx = getRequestContext();
  let tags = {
    application: "TODO: INSERT APPLICATION NAME HERE",
    route: "TODO: INSERT ROUTE HERE",
  };
  let dbSpan;
  if (ctx?.span)
    dbSpan = ctx.span.startChild({
      description: "TODO: service name",
      op: "db.query",
    });
  let result = (await ctx.db.query(queryStr, tags)).rows;
  if (!dbSpan) {
  } else if (queryStr instanceof SQLQuery)
    dbSpan.setData("query", queryStr.toString());
  if (dbSpan) dbSpan.finish();
  return result;
}

export async function dbTransact<T>(callback: () => Promise<T>): Promise<T> {
  const ctx = getRequestContext();
  return await ctx.db.transact(callback);
}
