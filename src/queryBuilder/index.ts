import { SQLQuery } from "../sqlQuery";
import { sql } from "../sql";
import { uuid } from "../sqlUtils";

export class BaseTable {
  constructor(
    public tableName: string | SQLQuery,
    public alias: string,
    public qb: RecordQueryBuilder,
    public joinColumn: string = "id"
  ) {}
}
/** HELPERS */
type Dictionary<T = any> = Record<string, T>;

export class RecordQueryBuilder {
  public baseTable: BaseTable;
  public columns: SQLQuery[] = [];
  private whereClauses: SQLQuery[] = [];
  private havingClauses: SQLQuery[] = [];
  private searchClauses: SQLQuery[] = [];
  private orderBys: SQLQuery[] = [];
  protected withs: Dictionary<SQLQuery> = {};
  private groupBy: SQLQuery[] = [];
  private joins: SQLQuery[] = [];
  private joinedTables: Dictionary<BaseTable> = {};
  private joinedTableAliases: Dictionary<BaseTable> = {};
  private distincts: SQLQuery[] = [];
  public limit: number | undefined;
  public withCount: boolean = false;

  constructor(baseTable: string) {
    this.baseTable = new BaseTable(baseTable, "t", this);
  }

  addSelectableColumn(column: string | SQLQuery, as?: string) {
    let sqlColumn;
    if (typeof column === "string") sqlColumn = sql`:${column}`;
    else sqlColumn = column;
    if (as) sqlColumn = sql`${sqlColumn} AS :${as}`;
    if (!this.columns.map((c) => c._repr).includes(sqlColumn._repr)) {
      this.columns.push(sqlColumn);
    }
  }

  addWhereClause(clause: SQLQuery) {
    this.whereClauses.push(clause);
  }

  addHavingClause(clause: SQLQuery) {
    this.havingClauses.push(clause);
  }

  addWithClause(name: string, clause: SQLQuery) {
    if (!(name in this.withs)) {
      this.withs[name] = clause;
    }
  }

  addDistinctColumn(column: string | SQLQuery) {
    let query = column as SQLQuery;
    if (typeof column === "string") {
      query = sql`:${column}`;
    }
    this.distincts.push(query);
  }

  addSearchTerm(clause: SQLQuery) {
    // basically a where clause, but gets "OR"d
    this.searchClauses.push(clause);
  }

  addOrderBy(orderBy: SQLQuery) {
    this.orderBys.push(orderBy);
  }

  addRawJoin(sqlJoinClause: SQLQuery) {
    this.joins.push(sqlJoinClause);
  }

  stealWithsFrom(qb: RecordQueryBuilder) {
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

  addGroupBy(groupByClause: SQLQuery) {
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

  compile(withBaseAlias = false): SQLQuery {
    this.joinedTables["base"] = this.baseTable;
    let columns = this.columns?.length ? sql.merge(this.columns) : sql`t.*`;
    let withClause = Object.keys(this.withs).length
      ? sql`WITH ${sql.merge(
          Object.keys(this.withs).map(
            (n) => sql`:${n} AS MATERIALIZED (${this.withs[n]})`
          )
        )} `
      : sql``;
    Object.keys(this.withs).map((n) => {
      if (n != this.baseTable.tableName) {
        this.joinTables(this.baseTable, new BaseTable(n, n, this), "id");
      }
    });

    let distinctClause = this.distincts.length
      ? sql`DISTINCT ON (${sql.merge(this.distincts)}) `
      : sql``;
    let searchClause = this.searchClauses?.length
      ? sql`${sql.merge(
          this.searchClauses.map((s) => sql`(${s})`),
          sql` OR `
        )}`
      : null;
    if (searchClause) this.whereClauses.push(searchClause);

    let whereClause = this.whereClauses?.length
      ? sql`WHERE ${sql.merge(
          this.whereClauses.map((w) => sql`(${w})`),
          sql` AND `
        )}`
      : sql``;
    let havingClause = this.havingClauses?.length
      ? sql`HAVING ${sql.merge(
          this.havingClauses.map((h) => sql`(${h})`),
          sql` AND `
        )}`
      : sql``;
    let groupByClause = this.groupBy?.length
      ? sql`GROUP BY ${sql.merge(this.groupBy)}`
      : sql``;
    let sortClause = this.orderBys?.length
      ? sql`ORDER BY ${sql.merge(this.orderBys)}`
      : sql``;
    let limitClause = this.limit ? sql`LIMIT ${this.limit}` : sql``;
    if (this.withCount) {
      columns = sql`${columns}, count(*) OVER() AS record_count`;
    }
    let joinClause = this.joins?.length ? sql.merge(this.joins, sql` `) : sql``;

    let tableClause =
      this.baseTable.tableName instanceof SQLQuery
        ? this.baseTable.tableName
        : sql`ONLY :${this.baseTable.tableName}`;
    let alias = withBaseAlias ? sql`:${this.baseTable.alias}` : sql`t`;

    const clauses = [
      joinClause,
      whereClause,
      groupByClause,
      havingClause,
      sortClause,
      limitClause,
    ];
    const nonEmptyClauses = clauses.filter(
      (clause) => clause._repr.trim() !== ""
    );

    return sql`${withClause}SELECT ${distinctClause}${columns} FROM ${tableClause} AS ${alias} ${sql.merge(
      nonEmptyClauses,
      sql` `
    )}`;
  }
}
