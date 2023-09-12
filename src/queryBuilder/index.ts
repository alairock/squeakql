import { SqueakqlQuery } from "../query";
import { sql } from "../string-literal";
import { uuid } from "../utils";

export class BaseTable {
  constructor(
    public tableName: string | SqueakqlQuery,
    public alias: string,
    public qb: QueryBuilder,
    public joinColumn: string = "id"
  ) {}
}

/** HELPERS */
type Dictionary<T = any> = Record<string, T>;

/**
 * A class representing a query builder for Squeakql.
 * This can only build SELECT queries.
 */
export class QueryBuilder {
  public baseTable: BaseTable;
  public columns: SqueakqlQuery[] = [];
  private whereClauses: SqueakqlQuery[] = [];
  private havingClauses: SqueakqlQuery[] = [];
  private searchClauses: SqueakqlQuery[] = [];
  private orderBys: SqueakqlQuery[] = [];
  protected withs: Dictionary<SqueakqlQuery> = {};
  private groupBy: SqueakqlQuery[] = [];
  private joins: SqueakqlQuery[] = [];
  private joinedTables: Dictionary<BaseTable> = {};
  private joinedTableAliases: Dictionary<BaseTable> = {};
  private distincts: SqueakqlQuery[] = [];
  public limit: number | undefined;
  public withCount: boolean = false;

  constructor(baseTable: string, public alias = "t") {
    if (alias != "t" && alias.length > 1) {
      throw new Error(
        "Alias must be a single character, or 't' for the base table"
      );
    }
    this.baseTable = new BaseTable(baseTable, alias, this);
  }

  addSelectableColumn(column: string | SqueakqlQuery, as?: string) {
    let sqlColumn;
    if (typeof column === "string") sqlColumn = sql`:${column}`;
    else sqlColumn = column;
    if (as) sqlColumn = sql`${sqlColumn} AS :${as}`;
    if (!this.columns.map((c) => c._repr).includes(sqlColumn._repr)) {
      this.columns.push(sqlColumn);
    }
  }

  addWhereClause(clause: SqueakqlQuery) {
    this.whereClauses.push(clause);
  }

  addHavingClause(clause: SqueakqlQuery) {
    this.havingClauses.push(clause);
  }

  addWithClause(name: string, clause: SqueakqlQuery) {
    if (!(name in this.withs)) {
      this.withs[name] = clause;
    }
  }

  addDistinctColumn(column: string | SqueakqlQuery) {
    let query = column as SqueakqlQuery;
    if (typeof column === "string") {
      query = sql`:${column}`;
    }
    this.distincts.push(query);
  }

  addSearchTerm(clause: SqueakqlQuery) {
    // basically a where clause, but gets "OR"d
    this.searchClauses.push(clause);
  }

  addOrderBy(orderBy: SqueakqlQuery) {
    this.orderBys.push(orderBy);
  }

  addRawJoin(sqlJoinClause: SqueakqlQuery) {
    this.joins.push(sqlJoinClause);
  }

  stealWithsFrom(qb: QueryBuilder) {
    this.withs = { ...qb.withs, ...this.withs };
    qb.withs = {};
  }

  joinTables(
    tableA: BaseTable,
    tableB: BaseTable,
    joinColumnOfTableB: string,
    useLeft = true
  ) {
    let joinAlias = `${tableA.alias}_${tableB.alias}`;
    if (!(joinAlias in this.joinedTables)) {
      if (tableB.alias in this.joinedTableAliases) {
        tableB.alias = tableB.alias + "_" + uuid("short");
      }
      this.joinedTableAliases[tableB.alias] = tableB;
      this.joinedTables[joinAlias] = tableB;
      let style = useLeft ? sql`LEFT` : sql`INNER`;
      this.joins.push(
        sql`${style} JOIN ONLY :${tableB.tableName} :${tableB.alias} ON :${tableA.alias}.:${tableA.joinColumn} = :${tableB.alias}.:${joinColumnOfTableB}`
      );
      return tableB;
    } else {
      return this.joinedTables[joinAlias];
    }
  }

  addGroupBy(groupByClause: SqueakqlQuery) {
    if (!this.groupBy.includes(groupByClause)) this.groupBy.push(groupByClause);
  }

  convertFiltersToSelectableColumn(as?: string) {
    let sqlColumn;
    if (this.whereClauses?.length == 0 && this.havingClauses?.length == 0) {
      sqlColumn = sql`true`;
    } else {
      let clauses = [...this.whereClauses, ...this.havingClauses];
      sqlColumn = sql.merge(
        clauses.map((w) => sql`(${w})`),
        sql` AND `
      );
    }
    if (as) sqlColumn = sql`${sqlColumn} AS :${as}`;
    this.columns.push(sqlColumn);
    this.whereClauses = [];
    this.havingClauses = [];
  }

  private compileWithClause(): SqueakqlQuery {
    return Object.keys(this.withs).length
      ? sql`WITH ${sql.merge(
          Object.keys(this.withs).map(
            (n) => sql`:${n} AS MATERIALIZED (${this.withs[n]})`
          )
        )} `
      : sql``;
  }

  private compileColumns(): SqueakqlQuery {
    let cols = this.columns.length
      ? sql.merge(this.columns)
      : sql`:${this.alias}.*`;
    if (this.withCount) {
      cols = sql`${cols}, COUNT(*) OVER() AS record_count`;
    }
    return cols;
  }

  private compileWhereClause(): SqueakqlQuery {
    const searchClause = this.searchClauses?.length
      ? sql`${sql.merge(
          this.searchClauses.map((s) => sql`(${s})`),
          sql` OR `
        )}`
      : null;

    if (searchClause) this.whereClauses.push(searchClause);

    return this.whereClauses?.length
      ? sql`WHERE ${sql.merge(
          this.whereClauses.map((w) => sql`(${w})`),
          sql` AND `
        )}`
      : sql``;
  }
  private compileGroupBy(): SqueakqlQuery {
    return this.groupBy.length
      ? sql`GROUP BY ${sql.merge(this.groupBy)}`
      : sql``;
  }

  private compileHavingClause(): SqueakqlQuery {
    return this.havingClauses.length
      ? sql`HAVING ${sql.merge(
          this.havingClauses.map((h) => sql`(${h})`),
          sql` AND `
        )}`
      : sql``;
  }

  private compileOrderBy(): SqueakqlQuery {
    return this.orderBys.length
      ? sql`ORDER BY ${sql.merge(this.orderBys)}`
      : sql``;
  }

  private compileLimit(): SqueakqlQuery {
    return this.limit ? sql`LIMIT ${this.limit}` : sql``;
  }

  private compileJoins(): SqueakqlQuery {
    return this.joins.length ? sql.merge(this.joins, sql` `) : sql``;
  }

  private compileDistinctClause(): SqueakqlQuery {
    return this.distincts.length
      ? sql`DISTINCT ON (${sql.merge(this.distincts)}) `
      : sql``;
  }

  compile(withBaseAlias = false): SqueakqlQuery {
    const withClause = this.compileWithClause();
    const columns = this.compileColumns();
    const distinctClause = this.compileDistinctClause();
    const whereClause = this.compileWhereClause();
    const groupByClause = this.compileGroupBy();
    const havingClause = this.compileHavingClause();
    const orderBy = this.compileOrderBy();
    const limit = this.compileLimit();
    const joins = this.compileJoins();
    const tableClause =
      typeof this.baseTable.tableName === "string"
        ? sql`ONLY :${this.baseTable.tableName}`
        : this.baseTable.tableName;
    const alias = withBaseAlias
      ? sql`:${this.baseTable.alias}`
      : sql`:${this.alias}`;

    let nonEmptyClauses = [];

    if (joins._repr.trim() !== "") nonEmptyClauses.push(joins);
    if (whereClause._repr.trim() !== "") nonEmptyClauses.push(whereClause);
    if (groupByClause._repr.trim() !== "") nonEmptyClauses.push(groupByClause);
    if (havingClause._repr.trim() !== "") nonEmptyClauses.push(havingClause);
    if (orderBy._repr.trim() !== "") nonEmptyClauses.push(orderBy);
    if (limit._repr.trim() !== "") nonEmptyClauses.push(limit);

    return sql`${withClause}SELECT ${distinctClause}${columns} FROM ${tableClause} AS ${alias} ${sql.merge(
      nonEmptyClauses,
      sql` `
    )}`;
  }
}
