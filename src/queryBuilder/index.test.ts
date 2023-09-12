import { it, describe, expect } from "bun:test";
import { QueryBuilder } from ".";
import { sql } from "../string-literal";

function newQueryBuilder() {
  return new QueryBuilder("test");
}

describe("RecordQueryBuilder", () => {
  it("constructor() works", async () => {
    const qb = newQueryBuilder();
    expect(qb.baseTable.alias).toBe("t");
    expect(qb.baseTable.tableName).toBe("test");

    // add where clauses and check
    const one = "1";
    const two = "2";
    const nqb = newQueryBuilder();
    nqb.addWhereClause(sql`a = ${one}`);
    nqb.addWhereClause(sql`b = ${two}`);
    expect(nqb.compile().render()).toBe(
      "SELECT t.* FROM ONLY test AS t WHERE (a = '1') AND (b = '2')"
    );

    // add having clauses and check
    const three = "3";
    const four = "4";
    const havingQb = newQueryBuilder();
    havingQb.addHavingClause(sql`c = ${three}`);
    havingQb.addHavingClause(sql`d = ${four}`);
    expect(havingQb.compile().render()).toBe(
      // TODO: This is bad, because you need a group by to have a having
      "SELECT t.* FROM ONLY test AS t HAVING (c = '3') AND (d = '4')"
    );

    // add order bys and check
    const orderByQb = newQueryBuilder();
    orderByQb.addOrderBy(sql`e`);
    orderByQb.addOrderBy(sql`f`);
    expect(orderByQb.compile().render()).toBe(
      "SELECT t.* FROM ONLY test AS t ORDER BY e,f"
    );

    // add group bys and check'
  });
  it("addSelectableColumn() works", async () => {
    const qb = newQueryBuilder();
    qb.addSelectableColumn("column1");
    qb.addSelectableColumn("column2", "alias2");
    expect(qb.compile().render()).toBe(
      "SELECT column1,column2 AS alias2 FROM ONLY test AS t"
    );
  });

  it("addWithClause() works", async () => {
    const qb = newQueryBuilder();
    qb.addSelectableColumn("*");
    qb.addWithClause("subqueryName", sql`SELECT 1`);
    expect(qb.compile().render()).toBe(
      "WITH subqueryName AS MATERIALIZED (SELECT 1) SELECT * FROM ONLY test AS t"
    );
  });

  it("addDistinctColumn() works", async () => {
    const qb = newQueryBuilder();
    qb.addDistinctColumn("uniqueCol");
    expect(qb.compile().render()).toBe(
      "SELECT DISTINCT ON (uniqueCol) t.* FROM ONLY test AS t"
    );
  });

  it("addSearchTerm() works", async () => {
    const qb = newQueryBuilder();
    qb.addSearchTerm(sql`column1 = 'value1'`);
    expect(qb.compile().render()).toBe(
      "SELECT t.* FROM ONLY test AS t WHERE ((column1 = 'value1'))"
    );
  });

  it("addGroupBy() works", async () => {
    const qb = newQueryBuilder();
    qb.addGroupBy(sql`column1`);
    expect(qb.compile().render()).toBe(
      "SELECT t.* FROM ONLY test AS t GROUP BY column1"
    );
  });

  it("convertFiltersToSelectableColumn() works", async () => {
    const qb = newQueryBuilder();
    qb.addWhereClause(sql`a = '1'`);
    qb.convertFiltersToSelectableColumn("filters");
    expect(qb.compile().render()).toBe(
      "SELECT (a = '1') AS filters FROM ONLY test AS t"
    );
  });
  // test a query that counts the number of records in a table
  it("withCount() works", async () => {
    const qb = newQueryBuilder();
    qb.withCount = true;
    expect(qb.compile().render()).toBe(
      "SELECT t.*, COUNT(*) OVER() AS record_count FROM ONLY test AS t"
    );
  });
});
